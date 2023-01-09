import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export interface JWTParams {
    _id: string;
    email: string;
    exp: number;
    iat: number;
    iss: string
    permissions: string;
    username: string;
}

export interface JWTBody {
    jwt: JWTParams;
}

const allRoutes : RouteInfo = {
    path: '*', 
    method: RequestMethod.ALL
}

const allGetRoutes : RouteInfo = {
    path: '*', 
    method: RequestMethod.GET
}

const allPostRoutes : RouteInfo = {
    path: '*', 
    method: RequestMethod.POST
}

const allPutRoutes : RouteInfo = {
    path: '*', 
    method: RequestMethod.PUT
}

const allPatchRoutes : RouteInfo = {
    path: '*', 
    method: RequestMethod.PATCH
}

const allDeleteRoutes : RouteInfo = {
    path: '*', 
    method: RequestMethod.DELETE
}

const notesRoutes : RouteInfo = {
    path: '/notes*', 
    method: RequestMethod.ALL
}

const authPostRoutes : RouteInfo = {
    path: '/auth*', 
    method: RequestMethod.POST
}

const authPutRoutes : RouteInfo = {
    path: '/auth*', 
    method: RequestMethod.PUT
}

const userRoutes : RouteInfo = {
    path: '/user*', 
    method: RequestMethod.ALL
}

export const routeInfos = {
    allRoutes,
    allGetRoutes,
    allDeleteRoutes,
    allPatchRoutes,
    allPostRoutes,
    allPutRoutes,
    notesRoutes,
    authPostRoutes,
    authPutRoutes,
    userRoutes,
}