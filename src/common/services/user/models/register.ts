export class registerUser {
    email:string;
    firstName:string;
    invitationCode:string;
    lastName:string;
    organizationId:string;
    role:string;
    roleId:string;
    claims:claims[];
}

export class claims {
    domain:string
}