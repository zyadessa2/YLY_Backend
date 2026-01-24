import { RoleEnum } from './user.types.js';

// define access roles for each endpoint in user module
export const endPoint = {
    profile:[RoleEnum.user],
    restoreAccount:[RoleEnum.admin],
    hardDelete:[RoleEnum.admin]
}