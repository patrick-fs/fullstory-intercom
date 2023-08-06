export interface CreateEventRequest {
    'user'?: UserIdRequest;
    'session'?: SessionIdRequest;
    'context'?: Context;
    'name': string;
    'timestamp'?: string;
    'properties'?: object;
    'schema'?: Schema;
}
export interface UserIdRequest {
    'uid'?: string;
    'id'?: string;
}
export interface SessionIdRequest {
    'id'?: string;
    'use_most_recent'?: boolean;
}
export interface Context {
    'integration'?: string;
    'custom_annotations'?: {
        [key: string]: string;
    };
    'browser'?: BrowserContext;
    'mobile'?: MobileContext;
    'device'?: DeviceContext;
    'location'?: LocationContext;
}
export interface MobileContext {
    'app_id'?: string;
    'app_version'?: string;
    'app_name'?: string;
    'build_variant'?: string;
}
export interface LocationContext {
    'country_code'?: string;
    'region_code'?: string;
    'city_name'?: string;
    'latitude'?: number;
    'longitude'?: number;
}
export interface BrowserContext {
    'url'?: string;
    'user_agent'?: string;
    'referrer_url'?: string;
}
export interface DeviceContext {
    'ip'?: string;
    'platform'?: string;
    'os_version'?: string;
    'manufacturer'?: string;
    'model'?: string;
    'serial_number'?: string;
    'features'?: Array<string>;
    'screen_width'?: number;
    'screen_height'?: number;
    'viewport_width'?: number;
    'viewport_height'?: number;
}
export interface Schema {
    'properties'?: object;
}
export declare const init: (api_key: string | undefined, base_url?: string) => {
    createEvent: (request: CreateEventRequest) => Promise<void>;
};
