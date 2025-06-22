package cc.web3e.apps.nova.controller.freeswitch;

import cc.web3e.apps.nova.cache.DictionaryItem;
import cc.web3e.apps.nova.utils.JsonFormatter;
import cc.web3e.protobuf.callmanager.GatewayMessage;
import cc.web3e.protobuf.callmanager.GatewayServeice;
import cc.web3e.protobuf.callmanager.GatewayServeiceGrpc;
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
import org.jboss.logging.Logger;

import java.util.List;
import java.util.UUID;

@Path("/api/callmanager/gateway")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
@RequestScoped
public class GatewayController {

    @Inject
    @Remote("gateways")
    RemoteCache<UUID, DictionaryItem> gatewaysCache;

    @GrpcClient("callmanager")
    GatewayServeiceGrpc.GatewayServeiceBlockingStub service;

    @GET
    @Path("/dictionary")
    @Blocking
    @RunOnVirtualThread
    public List<DictionaryItem> dictionary() {
        return gatewaysCache.values().stream().toList();
    }

    @POST
    @Path("/list")
    @Blocking
    @RunOnVirtualThread
    public String list(String json) throws Exception {
        return JsonFormatter.toJson(service.listGateways(JsonFormatter.toProto(json, ListRequest.class)));
    }

    @GET
    @Path("/prepare")
    @Blocking
    @RunOnVirtualThread
    public String get() {
        return JsonFormatter.toJson(service.getGatewayTemplate(Empty.getDefaultInstance()));
    }

    @POST
    @Path("/get")
    @Blocking
    @RunOnVirtualThread
    public String get(String json) {
        return JsonFormatter.toJson(service.getGateway(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/set")
    @Blocking
    @RunOnVirtualThread
    public String set(String json) {
        return JsonFormatter.toJson(service.setGateway(JsonFormatter.toProto(json, GatewayMessage.class)));
    }


    @POST
    @Path("/toggle")
    @Blocking
    @RunOnVirtualThread
    public String toggle(String json) {
        return JsonFormatter.toJson(service.toggleGateway(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/remove")
    @Blocking
    @RunOnVirtualThread
    public String remove(String json) {
        return JsonFormatter.toJson(service.removeGateway(JsonFormatter.toProto(json, IdMessage.class)));
    }
}
