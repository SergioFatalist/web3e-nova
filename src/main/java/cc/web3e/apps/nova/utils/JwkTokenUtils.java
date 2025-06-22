package cc.web3e.apps.nova.utils;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import io.jsonwebtoken.Jwts;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.time.Instant;
import java.util.Date;
import java.util.Map;

@ApplicationScoped
public class JwkTokenUtils {

    @Inject
    Logger LOG;

    @ConfigProperty(name = "utgid.jwk-privkey")
    String privKey;

    @ConfigProperty(name = "utgid.jwk-pubkey")
    String pubKey;

    public String createToken(Map<String, Object> payload, int expiresIn) {
        try {
            JWK jwk = JWK.parse(privKey);
            if (!(jwk instanceof RSAKey)) {
                LOG.error("JWK  Private Key is not RSA Key.");
            }

            Instant now = Instant.now();
            return Jwts.builder()
                    .claims(payload)
                    .issuedAt(Date.from(now))
                    .expiration(Date.from(now.plusSeconds(expiresIn)))
                    .signWith(jwk.toRSAKey().toPrivateKey(), Jwts.SIG.RS256) // Подписываем токен
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("JWT creation error: " + e.getMessage(), e);
        }
    }
}
