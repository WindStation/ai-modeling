/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GrantedAuthority } from './GrantedAuthority';
import type { Role } from './Role';
export type User = {
    id: number;
    account?: string;
    roles: Array<Role>;
    username: string;
    authorities: Array<GrantedAuthority>;
    enabled?: boolean;
    accountNonExpired?: boolean;
    credentialsNonExpired?: boolean;
    accountNonLocked?: boolean;
};

