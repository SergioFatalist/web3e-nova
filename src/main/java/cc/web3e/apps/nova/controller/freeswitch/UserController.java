package cc.web3e.apps.nova.controller.freeswitch;

import cc.web3e.apps.nova.cache.DictionaryItem;
import cc.web3e.apps.nova.cache.UserCacheItem;
import cc.web3e.apps.nova.model.RealmRole;
import cc.web3e.apps.nova.utils.JsonFormatter;
import cc.web3e.protobuf.callmanager.UserMessage;
import cc.web3e.protobuf.callmanager.UserService;
import cc.web3e.protobuf.callmanager.UserServiceGrpc;
import cc.web3e.protobuf.common.IdMessage;
import cc.web3e.protobuf.common.ListRequest;
import com.google.protobuf.Empty;
import io.quarkus.grpc.GrpcClient;
import io.quarkus.infinispan.client.Remote;
import io.quarkus.security.Authenticated;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.common.annotation.RunOnVirtualThread;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.infinispan.client.hotrod.RemoteCache;
import org.jboss.logging.Logger;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Path("/api/callmanager/user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
@RequestScoped
public class UserController {

    @Inject
    Logger log;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;

    @Inject
    Keycloak keycloak;

    @GrpcClient("callmanager")
    UserServiceGrpc.UserServiceBlockingStub service;

    @Inject
    @Remote("users")
    RemoteCache<UUID, UserCacheItem> userCache;

    @Inject
    @Remote("domains")
    RemoteCache<UUID, DictionaryItem> domainCache;

    @GET
    @Path("/candidates")
    @Blocking
    @RunOnVirtualThread
    public List<DictionaryItem> candidates() {

        List<RealmRole> roles = List.of(
                RealmRole.CC_MANAGER,
                RealmRole.CC_OPERATOR_HOT,
                RealmRole.CC_OPERATOR_COLD,
                RealmRole.CC_OPERATOR_REJECTED
        );

        Map<UUID, UserRepresentation> users = new HashMap<>();

        for (RealmRole role : roles) {
            keycloak.realm(realm).roles().get(role.getRoleName()).getUserMembers(0, -1).forEach(u -> users.put(UUID.fromString(u.getId()), u));
        }

        System.out.println(">>>> " + users.size());

        List<UserCacheItem> userCache = this.userCache.values().stream().toList();
        List<DictionaryItem> domainCache = this.domainCache.values().stream().toList();

        return users.values().stream()
                .filter(userRepresentation ->
                        userCache.stream().noneMatch(userCacheItem ->
                                userCacheItem.getExternalId().equals(userRepresentation.getId())
                        )
                )
                .filter(
                        userRepresentation ->
                                domainCache.stream().allMatch(userCacheItem ->
                                        userCacheItem.getName().equals(userRepresentation.getUsername().split("@")[1])
                                )
                )
                .map(userRepresentation -> DictionaryItem.builder()
                        .isEnabled(userRepresentation.isEnabled())
                        .name(userRepresentation.getEmail())
                        .value(userRepresentation.getId())
                        .description(userRepresentation.getFirstName() + " " + userRepresentation.getLastName())
                        .build()
                ).toList();
    }

    @GET
    @Path("/dictionary")
    @Blocking
    @RunOnVirtualThread
    public List<UserCacheItem> dictionary() {
        return userCache.values().stream().toList();
    }

    @GET
    @Path("/prepare/{keycloakId}")
    @Blocking
    @RunOnVirtualThread
    public String prepare(@PathParam("keycloakId") String keycloakId) {

        UserRepresentation userRepresentation = keycloak.realm(realm).users().get(keycloakId).toRepresentation();
        UserMessage template = service.getUserTemplate(Empty.getDefaultInstance());
        UserMessage message = UserMessage.newBuilder()
                        .setId(template.getId())
                        .setExternalId(keycloakId)
                        .setIsEnabled(userRepresentation.isEnabled())
                        .setName(userRepresentation.getUsername().split("@")[0])
                        .setDescription(userRepresentation.getFirstName() + " " + userRepresentation.getLastName())
                        .setPassword(new SecureRandom()
                                .ints(16, 33, 127)
                                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                                .toString())
                        .addAllParams(template.getParamsList())
                        .addAllVariables(template.getVariablesList())
                        .build();
        return JsonFormatter.toJson(message);

    }

    @POST
    @Path("/list")
    @Blocking
    @RunOnVirtualThread
    public String list(String json) throws Exception {
        return JsonFormatter.toJson(service.listUsers(JsonFormatter.toProto(json, ListRequest.class)));
    }

    @POST
    @Path("/get")
    @Blocking
    @RunOnVirtualThread
    public String get(String json) {
        return JsonFormatter.toJson(service.getUser(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/set")
    @Blocking
    @RunOnVirtualThread
    public String set(String json) {
        return JsonFormatter.toJson(service.setUser(JsonFormatter.toProto(json, UserMessage.class)));
    }


    @POST
    @Path("/toggle")
    @Blocking
    @RunOnVirtualThread
    public String toggle(String json) {
        return JsonFormatter.toJson(service.toggleUser(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/remove")
    @Blocking
    @RunOnVirtualThread
    public String remove(String json) {
        return JsonFormatter.toJson(service.removeUser(JsonFormatter.toProto(json, IdMessage.class)));
    }


    @POST
    @Path("/unmapped")
    @Blocking
    @RunOnVirtualThread
    public String unmapped() {
        return "";
    }
}
