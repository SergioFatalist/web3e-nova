package cc.web3e.apps.nova.utils;

import cc.web3e.apps.nova.model.RealmRole;
import cc.web3e.protobuf.utgidcrm.UserRoles;

import java.util.Map;

public class CompatUtils {

    public static final Map<UserRoles, RealmRole> UtgidToNovaRoles = Map.ofEntries(
            Map.entry(UserRoles.ADVERTISER, RealmRole.CPA_ADVERTISER),
            Map.entry(UserRoles.CALLCENTER_MANAGER, RealmRole.CC_MANAGER),
            Map.entry(UserRoles.CALLCENTER_OPERATOR, RealmRole.CC_OPERATOR_HOT),
            Map.entry(UserRoles.CALLCENTER_OPERATOR_COLD, RealmRole.CC_OPERATOR_COLD),
            Map.entry(UserRoles.CALLCENTER_OPERATOR_REJECTED, RealmRole.CC_OPERATOR_REJECTED),
            Map.entry(UserRoles.COURIER, RealmRole.DLV_COURIER),
            Map.entry(UserRoles.CPA_ADMIN, RealmRole.CPA_ADMIN),
            Map.entry(UserRoles.CRM_ADMIN, RealmRole.CRM_ADMIN),
            Map.entry(UserRoles.CRM_WAREHOUSE_MANAGER, RealmRole.WH_MANAGER),
            Map.entry(UserRoles.CRM_WAREHOUSE_OPERATOR, RealmRole.WH_OPERATOR),
            Map.entry(UserRoles.DELIVERY_MANAGER, RealmRole.DLV_MANAGER),
            Map.entry(UserRoles.FINANCIER, RealmRole.CRM_FINANCIER),
            Map.entry(UserRoles.PUBLISHER, RealmRole.CPA_WEBMASTER)
    );


    public static final Map<RealmRole, UserRoles> NovaToUtgidRoles = Map.ofEntries(
            Map.entry(RealmRole.CC_MANAGER, UserRoles.CALLCENTER_MANAGER),
            Map.entry(RealmRole.CC_OPERATOR_COLD, UserRoles.CALLCENTER_OPERATOR_COLD),
            Map.entry(RealmRole.CC_OPERATOR_HOT, UserRoles.CALLCENTER_OPERATOR),
            Map.entry(RealmRole.CC_OPERATOR_REJECTED, UserRoles.CALLCENTER_OPERATOR_REJECTED),
            Map.entry(RealmRole.CPA_ADMIN, UserRoles.CPA_ADMIN),
            Map.entry(RealmRole.CPA_ADVERTISER, UserRoles.ADVERTISER),
            Map.entry(RealmRole.CPA_WEBMASTER, UserRoles.PUBLISHER),
            Map.entry(RealmRole.CRM_ADMIN, UserRoles.CRM_ADMIN),
            Map.entry(RealmRole.CRM_FINANCIER, UserRoles.FINANCIER),
            Map.entry(RealmRole.DLV_COURIER, UserRoles.COURIER),
            Map.entry(RealmRole.DLV_MANAGER, UserRoles.DELIVERY_MANAGER),
            Map.entry(RealmRole.GLOBAL_ADMIN, UserRoles.UNKNOWN),
            Map.entry(RealmRole.PBX_ADMIN, UserRoles.UNKNOWN),
            Map.entry(RealmRole.WH_MANAGER, UserRoles.CRM_WAREHOUSE_MANAGER),
            Map.entry(RealmRole.WH_OPERATOR, UserRoles.CRM_WAREHOUSE_OPERATOR)
    );

}
