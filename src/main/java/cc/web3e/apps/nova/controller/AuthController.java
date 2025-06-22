package cc.web3e.apps.nova.controller;

import cc.web3e.apps.nova.model.AuthProviderConfig;
import cc.web3e.apps.nova.model.RealmRole;
import cc.web3e.apps.nova.model.SessionData;
import io.quarkus.oidc.IdToken;
import io.quarkus.oidc.OidcConfigurationMetadata;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {

    @Inject
    OidcConfigurationMetadata metadata;

    @ConfigProperty(name = "quarkus.oidc.client-id")
    String clientId;

    @ConfigProperty(name = "quarkus.oidc.auth-server-url")
    String authServerUri;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;

    @Inject
    Keycloak keycloak;

    @Inject
    @IdToken
    JsonWebToken token;

    @GET
    @Path("/endpoints")
    public AuthProviderConfig getAuthEndpoints() {
        return AuthProviderConfig.builder()
                .clientId(clientId)
                .authServerUri(authServerUri)
                .endSessionUri(metadata.getEndSessionUri())
                .authorizationUri(metadata.getAuthorizationUri())
                .discoveryUri(metadata.getDiscoveryUri())
                .tokenUri(metadata.getTokenUri())
                .introspectionUri(metadata.getIntrospectionUri())
                .jsonWebKeySetUri(metadata.getJsonWebKeySetUri())
                .userInfoUri(metadata.getUserInfoUri())
                .issuer(metadata.getIssuer())
                .supportedScopes(metadata.getSupportedScopes())
                .propertyNames(metadata.getPropertyNames())
                .build();
    }

    @GET
    @Path("/session")
    @Authenticated
    public SessionData getSession() {

        UserResource userResource = keycloak.realm(realm).users().get(token.getSubject());
        UserRepresentation user = userResource.toRepresentation();

        List<String> roles = userResource.roles()
                .realmLevel()
                .listAll()
                .stream()
                .map(RoleRepresentation::getName)
                .filter(role -> RealmRole.fromRoleName(role) != null)
                .toList();

        user.setRealmRoles(roles);

        String firstName = user.getFirstName().trim();
        String lastName = user.getLastName().trim();
        String name = ((!firstName.isEmpty() ? firstName + " " : "") + (!lastName.isEmpty() ? lastName : ""))
                .trim()
                .transform(it -> it.isEmpty() ? user.getEmail() : it);

        String locale = user.getAttributes().get("locale") != null ? user.getAttributes().get("locale").getFirst() : "en";
        String dark = user.getAttributes().get("dark") != null ? user.getAttributes().get("dark").getFirst() : "true";
        String pageSize = user.getAttributes().get("pageSize") != null ? user.getAttributes().get("pageSize").getFirst() : "25";

        return SessionData.builder()
                .name(name)
                .roles(roles)
                .dark(dark)
                .locale(locale)
                .pageSize(pageSize)
                .build();
    }

    @POST
    @Path("/session")
    @Authenticated
    public void setSession(SessionData sessionData) {
        UserResource userResource = keycloak.realm(realm).users().get(token.getSubject());
        UserRepresentation user = userResource.toRepresentation();

        if (user.getAttributes() == null) {
            user.setAttributes(new HashMap<>());
        }

        Map<String, List<String>> attributes = user.getAttributes();
        attributes.put("locale", List.of(sessionData.getLocale()));
        attributes.put("dark", List.of(String.valueOf(sessionData.getDark())));
        attributes.put("pageSize", List.of(sessionData.getPageSize()));

        user.setAttributes(attributes);

        userResource.update(user);
    }

    @GET
    @Path("/check-auth")
    public Response checkAuth(@Context SecurityContext securityContext) {
        System.out.println("======");
        System.out.println(securityContext.getUserPrincipal());
        System.out.println("======");
        if (securityContext.getUserPrincipal() == null) {
           return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        return Response.ok().build();
    }
}
