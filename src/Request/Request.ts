/// <reference path="../.d.ts"/>
"use strict";

import Body from "../Body";
import { RequestHeaders } from "../Headers";
import { normalizeMethod } from "../utils/http";

export default class Request extends Body implements FetchRequest {
  method: string;
  url: string;
  headers: FetchHeaders;
  context: string;
  referrer: string;
  mode: string;
  credentials: string;
  cache: string;

  constructor(input: string|Request, init: FetchRequestInit = {}) {
    // Some defaults
    this.method = "GET";
    this.credentials = "omit";
    this.mode = "no-cors";
    this.cache = "default";

    let body = init.body;

    if (input instanceof Request) {
      this.url = input.url;
      this.headers = new RequestHeaders(input.headers);
      this.method = input.method;
      this.mode = input.mode;
      this.credentials = input.credentials;
      this.cache = input.cache;

      if (input.bodyUsed) {
        throw new TypeError("Already read");
      }

      if (!body) {
        body = input.rawBody;
        input.bodyUsed = true;
      }

    } else if (typeof input === "string") {
      this.url = input;
    }

    // Override anything set with props from RequestInit
    this.headers = init.headers ? new RequestHeaders(init.headers) : this.headers;
    this.method = init.method ? normalizeMethod(init.method || "GET") : this.method;
    if ((this.method === "GET" || this.method === "HEAD") && body) {
      throw new TypeError("Body not allowed for GET or HEAD requests");
    }
    this.mode = init.mode || this.mode;
    this.credentials = init.credentials || this.credentials;
    this.cache = init.cache || this.cache;

    this.referrer = null;

    // Call super to set Body to an empty string
    super(body || "");
  }

  clone(): Request {
    return new Request(this);
  }
}
