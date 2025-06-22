package cc.web3e.apps.nova.cache;

import org.infinispan.protostream.GeneratedSchema;
import org.infinispan.protostream.annotations.ProtoSchema;

@ProtoSchema(includeClasses = {
        DictionaryItem.class,
        UserCacheItem.class
})
public interface CacheProtoSchema extends GeneratedSchema {
}
