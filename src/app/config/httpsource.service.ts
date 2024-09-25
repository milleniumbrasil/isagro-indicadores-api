// src/app/config/httpsource.service.ts

import "reflect-metadata";
import { Injectable, Logger } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";

@Injectable()
export class HttpSourceService {
  private readonly logger = new Logger(HttpSourceService.name);
  private endpointSessionTokenURL = undefined;
  private endpointSessionHealthCheckURL = undefined;

  constructor(private env: EnvironmentService) {
    this.endpointSessionTokenURL = env
      .getEnv()
      .get<string>("ENDPOINT_SESSION_TOKEN");
    this.endpointSessionHealthCheckURL = env
      .getEnv()
      .get<string>("ENDPOINT_SESSION_HEALTHCHECK");
  }

  async getEndpointSessionHealthCheckURL(): Promise<string> {
    if (!this.endpointSessionHealthCheckURL) {
      throw Error(`ENDPOINT_SESSION_HEALTHCHECK undefined at .env!`);
    } else {
      this.logger.log(
        `ENDPOINT_SESSION_HEALTHCHECK is defined at .env as ${this.endpointSessionHealthCheckURL}`,
      );
    }
    return this.endpointSessionHealthCheckURL;
  }

  async getEndpointSessionTokenURL(): Promise<string> {
    if (!this.endpointSessionTokenURL) {
      throw Error(`ENDPOINT_SESSION_TOKEN undefined at .env!`);
    } else {
      this.logger.log(
        `ENDPOINT_SESSION_TOKEN is defined at .env as ${this.endpointSessionTokenURL}`,
      );
    }
    return this.endpointSessionTokenURL;
  }
}
