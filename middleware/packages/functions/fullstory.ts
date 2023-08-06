import axios from 'axios';

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
  'custom_annotations'?: { [key: string]: string; };
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

export const init = (api_key: string | undefined, base_url = 'https://api.staging.fullstory.com') => {
  if (api_key === undefined) throw new Error('api key value is undefined');

  const instance = axios.create({
    baseURL: base_url,
    headers: { common: { Authorization: `Basic ${api_key}` } }
  });
  
  const createEvent = async (request: CreateEventRequest) => {
    const maxRetry = 5;
    let wait = 0;
    let retry = 0;
    let response;
    do {
      if (retry >= maxRetry) throw new Error(`retried ${maxRetry} times before giving up`);
      response = await instance.post('/v2beta/events', request);
      if (response.status === 429) {
        // no exponential backoff
        wait = response.headers['Retry-After'] ? parseInt(response.headers['Retry-After'], 10) * 1000 : 1000;
        await sleep(wait);
        retry++;
      }
    } while (response.status === 429);
  }

  return { createEvent };
}


function sleep(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
