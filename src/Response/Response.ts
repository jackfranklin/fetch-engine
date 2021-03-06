/// <reference path="../.d.ts"/>
"use strict";

import Body from "../Body";
import { ResponseHeaders } from "../Headers";
import { isValidRedirectStatus } from "../utils/http";

export default class Response extends Body implements FetchResponse {
  type: string;
  url: string;
  status: number;
  ok: boolean;
  statusText: string;
  headers: ResponseHeaders;

  constructor(body = "", init: FetchResponseInit = {}) {
    this.type = "default";
    this.status = init.status;
    this.ok = init.status >= 200 && init.status < 300;
    this.statusText = init.statusText;
    this.headers = new ResponseHeaders(init.headers);
    this.url = init.url || "";

    // Call super to set Body or an empty string
    super(body);
  }

  error(): Response {
    let response = new Response(this.rawBody, {
      status: 0,
      statusText: ""
    });
    response.type = "error";
    return response;
  }

  redirect(url: string, status: number): Response {
    if (!isValidRedirectStatus(status)) {
      throw new RangeError("Invalid status code");
    }

    return new Response("", {
      status: status,
      headers: new ResponseHeaders({
        location: url
      })
    });
  }

  clone(): Response {
    if (this.bodyUsed) {
      throw new TypeError("Already read");
    }
    return new Response(this.rawBody, this);
  }
}
