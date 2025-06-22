package cc.web3e.apps.nova.controller.freeswitch;

import cc.web3e.apps.nova.cache.DictionaryItem;
import cc.web3e.apps.nova.utils.JsonFormatter;
import cc.web3e.protobuf.callmanager.ScheduleMessage;
import cc.web3e.protobuf.callmanager.ScheduleService;
import cc.web3e.protobuf.callmanager.ScheduleServiceGrpc;
import cc.web3e.protobuf.common.IdMessage;
import cc.web3e.protobuf.common.ListRequest;
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

@Path("/api/callmanager/schedule")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
@RequestScoped
public class ScheduleController {

    @Inject
    @Remote("schedules")
    RemoteCache<UUID, DictionaryItem> schedulesCache;

    @GrpcClient("callmanager")
    ScheduleServiceGrpc.ScheduleServiceBlockingStub service;

    @GET
    @Path("/dictionary")
    @Blocking
    @RunOnVirtualThread
    public List<DictionaryItem> dictionary() {
        return schedulesCache.values().stream().toList();
    }

    @POST
    @Path("/list")
    @Blocking
    @RunOnVirtualThread
    public String list(String json) throws Exception {
        return JsonFormatter.toJson(service.listSchedules(JsonFormatter.toProto(json, ListRequest.class)));
    }

    @POST
    @Path("/get")
    @Blocking
    @RunOnVirtualThread
    public String get(String json) {
        return JsonFormatter.toJson(service.getSchedule(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/set")
    @Blocking
    @RunOnVirtualThread
    public String set(String json) {
        return JsonFormatter.toJson(service.setSchedule(JsonFormatter.toProto(json, ScheduleMessage.class)));
    }


    @POST
    @Path("/toggle")
    @Blocking
    @RunOnVirtualThread
    public String toggle(String json) {
        return JsonFormatter.toJson(service.toggleSchedule(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/remove")
    @Blocking
    @RunOnVirtualThread
    public String remove(String json) {
        return JsonFormatter.toJson(service.deleteSchedule(JsonFormatter.toProto(json, IdMessage.class)));
    }
}
