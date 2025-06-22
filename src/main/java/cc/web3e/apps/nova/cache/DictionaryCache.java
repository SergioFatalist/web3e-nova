package cc.web3e.apps.nova.cache;

import lombok.Getter;

@Getter
public enum DictionaryCache {
    ACLS("acls"),
    CONTEXTS("contexts"),
    DOMAINS("domains"),
    GATEWAYS("gateways"),
    GROUPS("groups"),
    HOSTS("hosts"),
    PHONE_NUNBERS("phone-numbers"),
    SCHEDULES("schedules"),
    SIP_PROFILES("sip-profiles"),
    USERS("users"),
    TIMEZONES("timezones");

    private final String cacheName;

    DictionaryCache(String cacheName) {
        this.cacheName = cacheName;
    }

    public static DictionaryCache fromCacheName(String name) {
        for (DictionaryCache key : DictionaryCache.values()) {
            if (key.getCacheName().equals(name)) {
                return key;
            }
        }
        return null;
    }
}
