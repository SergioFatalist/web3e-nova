package cc.web3e.apps.nova.utils;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NoCacheFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        responseContext.getHeaders().add(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate");
        responseContext.getHeaders().add("Pragma", "no-cache");
        responseContext.getHeaders().add(HttpHeaders.EXPIRES, "0");
    }
}