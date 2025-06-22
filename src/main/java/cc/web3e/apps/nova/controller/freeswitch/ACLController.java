package cc.web3e.apps.nova.controller.freeswitch;

import cc.web3e.apps.nova.utils.JsonFormatter;
import cc.web3e.protobuf.callmanager.ACLMessage;
import cc.web3e.protobuf.callmanager.ACLService;
import cc.web3e.protobuf.callmanager.PhoneNumberMessage;
import cc.web3e.protobuf.callmanager.PhoneNumberService;
import cc.web3e.protobuf.common.IdMessage;
import cc.web3e.protobuf.common.ListRequest;
import io.quarkus.grpc.GrpcClient;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.common.annotation.RunOnVirtualThread;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/callmanager/acl")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
@RequestScoped
public class ACLController {

    @GrpcClient("callmanager")
    ACLService service;

    @Inject
    SecurityIdentity identity;

    @POST
    @Path("/list")
    @Blocking
    @RunOnVirtualThread
    public Uni<String> list(String json) throws Exception {
        return service
                .listACLs(JsonFormatter.toProto(json, ListRequest.class))
                .onItem()
                .transform(JsonFormatter::toJson);
    }

    @POST
    @Path("/get")
    @Blocking
    @RunOnVirtualThread
    public Uni<String> get(String json) {
        return service
                .getACL(JsonFormatter.toProto(json, IdMessage.class))
                .onItem()
                .transform(JsonFormatter::toJson);
    }

    @POST
    @Path("/set")
    @Blocking
    @RunOnVirtualThread
    public Uni<String> set(String json) {
        return this.service
                .setACL(JsonFormatter.toProto(json, ACLMessage.class))
                .onItem()
                .transform(JsonFormatter::toJson);
    }


    @POST
    @Path("/toggle")
    @Blocking
    @RunOnVirtualThread
    public Uni<String> toggle(String json) {
        return this.service
                .toggleACL(JsonFormatter.toProto(json, IdMessage.class))
                .onItem()
                .transform(JsonFormatter::toJson);
    }

    @POST
    @Path("/remove")
    @Blocking
    @RunOnVirtualThread
    public Uni<String> remove(String json) {
        return this.service
                .removeACL(JsonFormatter.toProto(json, IdMessage.class))
                .onItem()
                .transform(JsonFormatter::toJson);
    }
}
