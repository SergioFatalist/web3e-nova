package cc.web3e.apps.nova.model;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class SessionData {

    String name;

    String locale;

    String dark;

    String pageSize;

    List<String> roles;

}
