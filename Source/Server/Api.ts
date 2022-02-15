import type { SessionKey } from "./Session";

export type Uncertain<T> = { [K in keyof Omit<T, 'type'>]: K extends 'id' ? T[K] : T[K] | undefined };
type ID<T> = T & { id: number };

export type DistributiveOmit<T, K extends keyof any> = T extends any
    ? Omit<T, K>
    : never;

export type RequestResponseMap = {
    [Req in API.Request['type']]: 
        Req extends API.RequestLoginInfo['type'] ? API.ResponseLoginInfo
        : Req extends API.RequestLogin['type'] ? API.ResponseLogin
        : Req extends API.RequestServerInfo['type'] ? API.ResponseServerInfo
        : Req extends API.RequestLogout['type'] ? API.ResponseLogout
        : Req extends API.RequestSessionExists['type'] ? API.ResponseSesssionExists
        : Req extends API.SubscribeDevices['type'] ? API.ResponseSubscribeDevices
        : Req extends API.SubscribeUsers['type'] ? API.ResponseSubscribeUsers
        : API.Ack
};

export namespace API {
    export type RequestLoginInfo = ID<{
        type: 'loginInformation'
    }>
    export type RequestServerInfo = ID<{
        type: 'serverInformation'
    }>
    export type RequestLogin = ID<{
        type: 'login',
        nickname: string,
        password?: string
    }>
    export type RequestLogout = ID<{
        type: 'logout',
        sessionKey: SessionKey
    }>
    export type RequestSessionExists = ID<{
        type: 'sessionExists',
        sessionKey: SessionKey
    }>
    export type SubscribeDevices = ID<{
        type: 'subscibeDevices',
        sessionKey: SessionKey
    }>
    export type SubscribeUsers = ID<{
        type: 'subscibeUsers',
        sessionKey: SessionKey
    }>
    type RequestTypes = RequestLoginInfo | RequestLogin | RequestServerInfo | RequestLogout | RequestSessionExists | SubscribeDevices | SubscribeUsers;
    export type Request = Extract<RequestTypes, ID<{type: string}>>

    export type ResponseLoginInfo = ID<{
        anonymousAllowed: boolean
    }>
    export type ResponseServerInfo = ID<{
        name: string
    }>
    export type ResponseLogin = ID<{
        result: 'ok',
        sessionKey: SessionKey
    } | {
        result: 'invalid',
        reason: 'nickname and password required' | 'nickname required' | 'password required' | 'invalid credentials'
    }>
    export type ResponseLogout = ID<{
        result: 'ok' | 'session not found'
    }>
    export type ResponseSesssionExists = ID<{
        value: boolean
    }>
    export type ResponseSubscribeDevices = ID<{
        result: 'ok',
        devices: string[]
    } | {
        result: 'session not found'
    }>
    export type ResponseSubscribeUsers = ID<{
        result: 'ok',
        users: { nickname: string, location: string }[]
    } | {
        result: 'session not found'
    }>
    export type Ack = ID<{ result: boolean }>
    export type Error = ID<{
        error: string
    }>
    type ResponseTypes = RequestResponseMap[keyof RequestResponseMap] | Error
    export type Response = Extract<ResponseTypes, ID<{}>>

    export type HeartbeatDevices = {
        type: 'heartbeat-devices',
        kind: 'added' | 'removed',
        value: string[]
    }
    export type HeartbeatUsers = {
        type: 'heartbeat-users'
    } & ({
        kind: 'added' | 'updated',
        user: { nickname: string, location: string }
    } | {
        kind: 'removed',
        user: string
    })
    type HeartbeatTypes = HeartbeatDevices | HeartbeatUsers
    export type Heartbeat = Exclude<HeartbeatTypes, {id: number}>
};