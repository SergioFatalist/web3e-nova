package cc.web3e.apps.nova.model;

import lombok.*;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthProviderConfig {
    String clientId;
    String realm;
    String authServerUri;
    String discoveryUri;
    String tokenUri;
    String introspectionUri;
    String authorizationUri;
    String jsonWebKeySetUri;
    String userInfoUri;
    String endSessionUri;
    String issuer;
    List<String> supportedScopes;
    Set<String> propertyNames;
}
