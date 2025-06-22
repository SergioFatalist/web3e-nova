package cc.web3e.apps.nova.controller.freeswitch;

import cc.web3e.apps.nova.cache.DictionaryItem;
import cc.web3e.apps.nova.utils.JsonFormatter;
import cc.web3e.protobuf.callmanager.ContextMessage;
import cc.web3e.protobuf.callmanager.ContextService;
import cc.web3e.protobuf.callmanager.ContextServiceGrpc;
import cc.web3e.protobuf.common.BaseItemsList;
import cc.web3e.protobuf.common.IdMessage;
import cc.web3e.protobuf.common.ListRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
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

@Path("/api/callmanager/context")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
@RequestScoped
public class ContextController {

    @Inject
    @Remote("contexts")
    RemoteCache<UUID, DictionaryItem> contextsCache;

    @GrpcClient("callmanager")
    ContextServiceGrpc.ContextServiceBlockingStub service;

    @GET
    @Path("/dictionary")
    @Blocking
    @RunOnVirtualThread
    public List<DictionaryItem> dictionary() throws JsonProcessingException {
        return contextsCache.values().stream().toList();
    }

    @POST
    @Path("/list")
    @Blocking
    @RunOnVirtualThread
    public String list(String json) throws Exception {
        return JsonFormatter.toJson(service.listContexts(JsonFormatter.toProto(json, ListRequest.class)));
    }

    @POST
    @Path("/get")
    @Blocking
    @RunOnVirtualThread
    public String get(String json) {
        return JsonFormatter.toJson(service.getContext(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/set")
    @Blocking
    @RunOnVirtualThread
    public String set(String json) {
        return JsonFormatter.toJson(service.setContext(JsonFormatter.toProto(json, ContextMessage.class)));
    }


    @POST
    @Path("/toggle")
    @Blocking
    @RunOnVirtualThread
    public String toggle(String json) {
        return JsonFormatter.toJson(service.toggleContext(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/remove")
    @Blocking
    @RunOnVirtualThread
    public String remove(String json) {
        return JsonFormatter.toJson(service.removeContext(JsonFormatter.toProto(json, IdMessage.class)));
    }
}
