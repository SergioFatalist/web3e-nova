package cc.web3e.apps.nova.model;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum RealmRole {
    CC_MANAGER("cc-manager"),
    CC_OPERATOR_COLD("cc-operator-cold"),
    CC_OPERATOR_HOT("cc-operator-hot"),
    CC_OPERATOR_REJECTED("cc-operator-rejected"),
    CPA_ADMIN("cpa-admin"),
    CPA_ADVERTISER("cpa-advertiser"),
    CPA_WEBMASTER("cpa-webmaster"),
    CRM_ADMIN("crm-admin"),
    CRM_FINANCIER("crm-financier"),
    DLV_COURIER("dlv-courier"),
    DLV_MANAGER("dlv-manager"),
    GLOBAL_ADMIN("global-admin"),
    PBX_ADMIN("pbx-admin"),
    WH_MANAGER("wh-manager"),
    WH_OPERATOR("wh-operator");

    private final String roleName;

    RealmRole(String roleName) {
        this.roleName = roleName;
    }

    public static RealmRole fromRoleName(String name) {
        return Arrays.stream(RealmRole.values()).filter(role -> role.roleName.equals(name)).findFirst().orElse(null);
    }
}
