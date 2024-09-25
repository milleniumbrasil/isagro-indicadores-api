// src/app/health/health.module.ts

import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { HttpModule } from "@nestjs/axios";
import { HealthService } from "./health.service";
import { HttpSourceService } from "../config/httpsource.service";
import { EnvironmentModule } from "../config/environment.module";
import { CustomDatabaseHealthIndicator } from "./health.database.indicator";
import { AppReadinessService } from "../config/app.readiness.service";

@Module({
  imports: [TerminusModule, HttpModule, EnvironmentModule],
  providers: [
    AppReadinessService,
    HealthService,
    HttpSourceService,
    CustomDatabaseHealthIndicator,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
