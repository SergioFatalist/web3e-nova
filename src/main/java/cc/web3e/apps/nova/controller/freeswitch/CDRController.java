package cc.web3e.apps.nova.controller.freeswitch;

import cc.web3e.apps.nova.utils.JsonFormatter;
import cc.web3e.protobuf.callmanager.CDRServiceGrpc;
import cc.web3e.protobuf.callmanager.CDRsList;
import cc.web3e.protobuf.common.IdMessage;
import io.quarkus.grpc.GrpcClient;
import io.quarkus.security.Authenticated;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.common.annotation.RunOnVirtualThread;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/api/callmanager/cdr")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
@RequestScoped
public class CDRController {

    @GrpcClient("callmanager")
    CDRServiceGrpc.CDRServiceBlockingStub service;

    @POST
    @Path("/list")
    @Blocking
    @RunOnVirtualThread
    public String list(String json) throws Exception {
        return JsonFormatter.toJson(service.listCDRs(JsonFormatter.toProto(json, CDRsList.class)));
    }

    @GET
    @Path("/get-raw-xml")
    @Blocking
    @RunOnVirtualThread
    public String rawXml(@QueryParam("id") String id) {
        return service.getRawXml(IdMessage.newBuilder().setId(id).build()).getValue();
    }

}
