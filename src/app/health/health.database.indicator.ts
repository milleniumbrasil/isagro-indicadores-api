// src/app/health/health.database.indicator.ts

import { Injectable, Logger } from "@nestjs/common";
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from "@nestjs/terminus";
import { DataSourceService } from "@app/config/datasource.service";

@Injectable()
export class CustomDatabaseHealthIndicator extends HealthIndicator {
  constructor(private dataSourceService: DataSourceService) {
    super();
  }

  async isDatabaseHealthy(key: string): Promise<HealthIndicatorResult> {
    const dataSource = this.dataSourceService.getDataSource();
    try {
      await dataSource.query("SELECT 1");
      return this.getStatus(key, true);
    } catch (error) {
      const result = this.getStatus(key, false, { message: error.message });
      throw new HealthCheckError("Database check failed", result);
    }
  }
}
