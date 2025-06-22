package cc.web3e.apps.nova.controller;

import cc.web3e.apps.nova.cache.DictionaryItem;
import io.quarkus.infinispan.client.Remote;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.infinispan.client.hotrod.RemoteCache;

import java.util.List;

@Authenticated
@Path("/api/timezone")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class TimezonesController {

    @Inject
    @Remote("timezones")
    RemoteCache<String, DictionaryItem> timezonesCache;

    @GET
    @Path("/dictionary")
    public Uni<List<DictionaryItem>> dictionary() {
        return Uni.createFrom().item(timezonesCache.values().stream().toList());
    }
}
