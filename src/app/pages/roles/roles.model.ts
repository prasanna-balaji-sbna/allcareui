export class RolePermissionMenu {
    roleMenu: roleMenu[];
    rolePermissiondata: rolePermissiondata[];
    isSelectAllEnabled: boolean;
}

export class roleMenu {
    roleHeading: string;
    isRoleEnabled: boolean;
}

export class Mainmenu {
    menuName: string;
    menuItemsId: number;
    subMenu: SubMenu[];
    functionalityMenu: FunctionalityMenu[];
}

export class SubMenu {
    menuName: string;
    menuItemsId: number;
    functionalityMenu: FunctionalityMenu[];
}

export class FunctionalityMenu {
    menuName: string;
    menuFunctionalityId: number;
}

export interface rolePermissiondata {
    menuName: string;
    isSubMenu: boolean | null;
    isFunctionMenu: boolean | null;
    rolePermissionMappingData: RolePermissionMappingData[];
}

export class RolePermissionMappingData {
    isEnabled: boolean;
    loginRoleId: string;
    menuItemsId: number | null;
    menuFunctionalityId: number | null;
    rolePermissionId: number;
}

export class SaveRoleBasedMenuBO {
    isRoleEnabled: boolean;
    roleId: string;
}