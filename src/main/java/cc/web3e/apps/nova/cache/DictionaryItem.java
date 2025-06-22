package cc.web3e.apps.nova.cache;

import lombok.*;
import org.infinispan.protostream.annotations.Proto;
import org.infinispan.protostream.annotations.ProtoField;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Proto
public class DictionaryItem {
    @ProtoField(number = 1)
    public String name;

    @ProtoField(number = 2)
    public String value;

    @ProtoField(number = 3)
    public String description;

    @ProtoField(number = 4)
    public Boolean isEnabled;
}
