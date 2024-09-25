// src/app/health/health.service.ts

import { firstValueFrom } from "rxjs";
import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { HttpSourceService } from "../config/httpsource.service";
import { AppReadinessService } from "../config/app.readiness.service";
import { CustomDatabaseHealthIndicator } from "./health.database.indicator";
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  HealthIndicator,
  HttpHealthIndicator,
  HealthCheckResult,
} from "@nestjs/terminus";

@Injectable()
export class HealthService extends HealthIndicator {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private httpSourceService: HttpSourceService,
    private customDatabaseHealthIndicator: CustomDatabaseHealthIndicator,
    private health: HealthCheckService,
    private httpHealthIndicator: HttpHealthIndicator,
    private httpService: HttpService,
    private appReadinessService: AppReadinessService,
  ) {
    super();
  }

  @HealthCheck()
  async checkMe() {
    if (!this.appReadinessService.isAppReady) {
      this.logger.warn(
        "Aplicação ainda não está pronta para checagens de saúde.",
      );
      return null;
    }

    const PORT = process.env.PORT || 3001;
    const dest = `http://localhost:${PORT}/api`;
    let result = undefined;
    try {
      result = this.health.check([
        async () => this.httpHealthIndicator.pingCheck("swagger", dest),
      ]);
      this.logger.log(`checkMe [${dest}] OK!`);
    } catch (error) {
      this.logger.error(`Error from checkMe: ${error.message}`);
      throw error;
    }
    return result;
  }

  async isHealthy(destEncoded: string): Promise<HealthIndicatorResult> {
    if (!this.appReadinessService.isAppReady) {
      this.logger.warn(
        "Aplicação ainda não está pronta para checagens de saúde.",
      );
      return null;
    }

    let key = undefined;
    try {
      const dest = decodeURIComponent(destEncoded);
      key = dest
        .replace(/https?:\/\/|www\./g, "")
        .replace(/[^a-zA-Z0-9]/g, "_");
      const response = await firstValueFrom(this.httpService.get(dest));
      if (response.status === 200) {
        this.logger.log(`checkMe [${dest}]: ${JSON.stringify(response)}`);
        return this.getStatus(key, true);
      } else {
        return this.getStatus(key, false, {
          message: `Status code ${response.status}`,
        });
      }
    } catch (error) {
      this.logger.error(`Error from isHealthy: ${error.message}`);
      return this.getStatus(key, false, { message: error.message });
    }
  }

  @HealthCheck()
  async checkEndpointSessionTokenURL() {
    const dest = await this.httpSourceService.getEndpointSessionTokenURL();
    this.logger.debug(`checkEndpointSessionURL [${dest}] checking!`);
    return this.health.check([async () => this.isHealthy(dest)]);
  }

  @HealthCheck()
  async verifyEndpointSessionHealthCheck(): Promise<HealthCheckResult> {
    if (!this.appReadinessService.isAppReady) {
      this.logger.warn(
        "Aplicação ainda não está pronta para checagens de saúde.",
      );
      return null;
    }

    try {
      const dest =
        await this.httpSourceService.getEndpointSessionHealthCheckURL();
      const dbHealth =
        await this.customDatabaseHealthIndicator.isDatabaseHealthy("database");

      return this.health.check([
        async () => this.httpHealthIndicator.pingCheck("session", dest),
        async () => dbHealth,
      ]);
    } catch (error) {
      this.logger.error("Error verifying endpoint session URL:", error);
      return undefined;
    }
  }
}
