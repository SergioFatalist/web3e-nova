package cc.web3e.apps.nova.controller.freeswitch;

import cc.web3e.apps.nova.cache.DictionaryItem;
import cc.web3e.apps.nova.utils.JsonFormatter;
import cc.web3e.protobuf.callmanager.HostMessage;
import cc.web3e.protobuf.callmanager.HostService;
import cc.web3e.protobuf.callmanager.HostServiceGrpc;
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
import org.infinispan.client.hotrod.RemoteCache;

import java.util.List;
import java.util.UUID;

@Path("/api/callmanager/host")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
@RequestScoped
public class HostController {

    @Inject
    @Remote("hosts")
    RemoteCache<UUID, DictionaryItem> hostsCache;

    @GrpcClient("callmanager")
    HostServiceGrpc.HostServiceBlockingStub service;

    @GET
    @Path("/dictionary")
    @Blocking
    @RunOnVirtualThread
    public Uni<List<DictionaryItem>> dictionary() {
        return Uni.createFrom().item(hostsCache.values().stream().toList());
    }

    @POST
    @Path("/list")
    @Blocking
    @RunOnVirtualThread
    public String list(String json) throws Exception {
        return JsonFormatter.toJson(service.listHosts(JsonFormatter.toProto(json, ListRequest.class)));
    }

    @GET
    @Path("/get")
    @Blocking
    @RunOnVirtualThread
    public String get() {
        return JsonFormatter.toJson(service.getHostTemplate(Empty.getDefaultInstance()));
    }

    @POST
    @Path("/get")
    @Blocking
    @RunOnVirtualThread
    public String get(String json) {
        return JsonFormatter.toJson(service.getHost(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @GET
    @Path("/get-freeswitch-xml")
    @Blocking
    @RunOnVirtualThread
    public String getFreeswitchXml(@QueryParam("id") String id) {
        return service.getFreeswitchXml(IdMessage.newBuilder().setId(id).build()).getValue();
    }

    @POST
    @Path("/set")
    @Blocking
    @RunOnVirtualThread
    public String set(String json) {
        return JsonFormatter.toJson(service.setHost(JsonFormatter.toProto(json, HostMessage.class)));
    }

    @POST
    @Path("/toggle")
    @Blocking
    @RunOnVirtualThread
    public String toggle(String json) {
        return JsonFormatter.toJson(service.toggleHost(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/remove")
    @Blocking
    @RunOnVirtualThread
    public String remove(String json) {
        return JsonFormatter.toJson(service.removeHost(JsonFormatter.toProto(json, IdMessage.class)));
    }
}
