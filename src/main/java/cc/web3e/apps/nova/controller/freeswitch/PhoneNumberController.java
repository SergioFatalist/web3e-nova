package cc.web3e.apps.nova.controller.freeswitch;

import cc.web3e.apps.nova.cache.DictionaryItem;
import cc.web3e.apps.nova.utils.JsonFormatter;
import cc.web3e.protobuf.callmanager.PhoneNumberMessage;
import cc.web3e.protobuf.callmanager.PhoneNumberService;
import cc.web3e.protobuf.callmanager.PhoneNumberServiceGrpc;
import cc.web3e.protobuf.common.IdMessage;
import cc.web3e.protobuf.common.ListRequest;
import io.quarkus.grpc.GrpcClient;
import io.quarkus.infinispan.client.Remote;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
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

@Path("/api/callmanager/phone-number")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
@RequestScoped
public class PhoneNumberController {

    @Inject
    @Remote("phone-numbers")
    RemoteCache<UUID, DictionaryItem> phoneNumbersCache;

    @GrpcClient("callmanager")
    PhoneNumberServiceGrpc.PhoneNumberServiceBlockingStub service;

    @Inject
    SecurityIdentity identity;

    @GET
    @Path("/dictionary")
    @Blocking
    @RunOnVirtualThread
    public Uni<List<DictionaryItem>> dictionary() {
        return Uni.createFrom().item(phoneNumbersCache.values().stream().toList());
    }

    @POST
    @Path("/list")
    @Blocking
    @RunOnVirtualThread
    public String list(String json) throws Exception {
        return JsonFormatter.toJson(service.listPhoneNumbers(JsonFormatter.toProto(json, ListRequest.class)));
    }

    @POST
    @Path("/get")
    @Blocking
    @RunOnVirtualThread
    public String get(String json) {
        return JsonFormatter.toJson(service.getPhoneNumber(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/set")
    @Blocking
    @RunOnVirtualThread
    public String set(String json) {
        return JsonFormatter.toJson(service.setPhoneNumber(JsonFormatter.toProto(json, PhoneNumberMessage.class)));
    }


    @POST
    @Path("/toggle")
    @Blocking
    @RunOnVirtualThread
    public String toggle(String json) {
        return JsonFormatter.toJson(service.togglePhoneNumber(JsonFormatter.toProto(json, IdMessage.class)));
    }

    @POST
    @Path("/remove")
    @Blocking
    @RunOnVirtualThread
    public String remove(String json) {
        return JsonFormatter.toJson(service.removePhoneNumber(JsonFormatter.toProto(json, IdMessage.class)));
    }
}
