package cc.web3e.apps.nova.workers;

import cc.web3e.apps.nova.model.RealmRole;
import cc.web3e.apps.nova.utils.CompatUtils;
import cc.web3e.apps.nova.utils.JwkTokenUtils;
import cc.web3e.protobuf.common.PaginationOptions;
import cc.web3e.protobuf.utgidcrm.ListUsersFilter;
import cc.web3e.protobuf.utgidcrm.ListUsersRequest;
import cc.web3e.protobuf.utgidcrm.User;
import cc.web3e.protobuf.utgidcrm.UserService;
import io.grpc.Metadata;
import io.quarkus.grpc.GrpcClient;
import io.quarkus.grpc.GrpcClientUtils;
import io.quarkus.runtime.StartupEvent;
import io.quarkus.scheduler.Scheduled;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.common.annotation.RunOnVirtualThread;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@ApplicationScoped
public class UsersSyncScheduler {

    @Inject
    Logger log;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;

    @Inject
    Keycloak keycloak;

    @Inject
    JwkTokenUtils jwkTokenUtils;

    @GrpcClient("userservice")
    UserService userservice;

    public void startup(@Observes StartupEvent ev) {
        run();
    }

    @Scheduled(every = "60s") // Run every 10 minutes
    @Blocking
    @RunOnVirtualThread
    public void run() {
        log.info("Synchronize users");

        String token = jwkTokenUtils.createToken(Collections.emptyMap(), 30);

        Metadata metadata = new Metadata();
        Metadata.Key<String> TOKEN_KEY = Metadata.Key.of("token", Metadata.ASCII_STRING_MARSHALLER);
        metadata.put(TOKEN_KEY, token);

        UserService userService = GrpcClientUtils.attachHeaders(this.userservice, metadata);

        userService
                .listUsers(ListUsersRequest.newBuilder()
                        .setFilter(ListUsersFilter.getDefaultInstance())
                        .setPagination(PaginationOptions.newBuilder().setPage(1).setLimit(10000).build()).build())
                .subscribe().with(
                        response -> response.getUsersList().forEach(this::syncUser),
                        failure -> log.errorf("User sync error: %s", failure.getCause())
                );
    }

    private void syncUser(User user) {

        String userId;
        String email = user.getEmails(0).getEmail().trim();
        String firstName = user.getFirstName().isEmpty() ? "" : user.getFirstName();
        String lastName = user.getLastName().isEmpty() ? "" : user.getLastName();
        String crmUserId = String.valueOf(user.getId());

        List<UserRepresentation> userRepresentations = keycloak.realm(realm).users().searchByEmail(email, true);
        if (userRepresentations.isEmpty()) {
            var newUser = new UserRepresentation();
            newUser.setUsername(email);
            newUser.setEmail(email);
            newUser.setEmailVerified(true);
            newUser.setFirstName(firstName);
            newUser.setLastName(lastName);
            newUser.setEnabled(user.getIsActive());
            newUser.setAttributes(Map.of(
                    "locale", List.of("en"),
                    "dark", List.of("true"),
                    "pageSize", List.of("25"),
                    "crmUserId", List.of(crmUserId)
            ));
            try (Response response = keycloak.realm(realm).users().create(newUser)) {
                int status = response.getStatus();
                if (status == 201) {
                    userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");
                    log.infof("Created user <%s> with ID: %s", email, userId);
                } else {
                    log.errorf("Error when creating user <%s>: %s - %s", email, status, response.readEntity(String.class));
                    return;
                }
            } catch (Exception e) {
                log.error("Unexpected error: " + e.getMessage());
                return;
            }
        } else {
            userId = userRepresentations.getFirst().getId();
        }

        if (userId != null) {
            try {

                UserRepresentation userRepresentation = keycloak.realm(realm).users().get(userId).toRepresentation();
                boolean updateAttributes = false;

                List<String> crmIds = userRepresentation.getAttributes().getOrDefault("crmUserId", Collections.emptyList());
                String currentCrmUserId = crmIds.isEmpty() ? null : crmIds.getFirst();

                List<String> darkList = userRepresentation.getAttributes().getOrDefault("dark", Collections.emptyList());
                String currentDark = darkList.isEmpty() ? null : darkList.getFirst();


                if (currentCrmUserId == null || !currentCrmUserId.trim().equals(crmUserId)) {
                    userRepresentation.getAttributes().put("crmUserId", List.of(crmUserId));
                    updateAttributes = true;
                }

                if (currentDark == null || currentDark.trim().equals("1") || currentDark.trim().equals("0")) {
                    currentDark = currentDark == null || currentDark.trim().equals("1") ? "true" : "false";
                    userRepresentation.getAttributes().put("dark", List.of(currentDark));
                    updateAttributes = true;
                }

                if (updateAttributes) {
                    keycloak.realm(realm).users().get(userId).update(userRepresentation);
                    log.infof("Updated user <%s> with CRM User ID: %s and Dark: %s", email, crmUserId, currentDark);
                }

                // Роли, которые должны быть у пользователя
                List<String> desiredRoles = user.getRoleIdsList().stream()
                        .map(CompatUtils.UtgidToNovaRoles::get)
                        .filter(Objects::nonNull)
                        .map(RealmRole::getRoleName)
                        .toList();

                // Текущие роли пользователя в Keycloak
                List<String> currentRoles = keycloak.realm(realm).users().get(userId)
                        .roles().realmLevel().listAll().stream()
                        .map(RoleRepresentation::getName)
                        .toList();

                // Роли для добавления
                List<RoleRepresentation> rolesToAdd = desiredRoles.stream()
                        .filter(role -> !currentRoles.contains(role))
                        .map(role -> keycloak.realm(realm).roles().get(role).toRepresentation())
                        .collect(Collectors.toList());

                List<RoleRepresentation> rolesToRemove = currentRoles.stream()
                        .filter(currentRole -> !desiredRoles.contains(currentRole) && RealmRole.fromRoleName(currentRole) != null)
                        .map(role -> keycloak.realm(realm).roles().get(role).toRepresentation())
                        .collect(Collectors.toList());

                if (!rolesToAdd.isEmpty()) {
                    keycloak.realm(realm).users().get(userId).roles().realmLevel().add(rolesToAdd);
                    log.infof("Added roles for user <%s>: %s", email, rolesToAdd);
                }

                if (!rolesToRemove.isEmpty()) {
                    keycloak.realm(realm).users().get(userId).roles().realmLevel().remove(rolesToRemove);
                    log.infof("Removed roles for user <%s>: %s", email, rolesToRemove);
                }

            } catch (Exception e) {
                log.errorf("Error when synchronizing roles for user %s: %s", email, e);
            }
        }
    }

}
