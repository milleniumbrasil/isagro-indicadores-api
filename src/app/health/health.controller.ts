// src/app/health/health.controller.ts

import { Controller, Get, Logger } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  HealthCheck,
  HealthCheckResult,
  HealthIndicatorResult,
} from "@nestjs/terminus";
import { HealthService } from "./health.service";
import { AppReadinessService } from "../config/app.readiness.service";

@Controller("health")
@ApiTags("Health Check")
export class HealthController {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private health: HealthService,
    private appReadinessService: AppReadinessService,
  ) {}

  @ApiOperation({
    summary: "Verifica se o Swagger está UP.",
    description: `# Swagger verifying`,
  })
  @ApiResponse({
    status: 200,
    description: "Swagger disponível",
  })
  @ApiResponse({ status: 500, description: "Falha interna do servidor." })
  @Get()
  @HealthCheck()
  async check(): Promise<HealthIndicatorResult> {
    if (!this.appReadinessService.isAppReady) {
      this.logger.warn(
        "Aplicação ainda não está pronta para checagens de saúde.",
      );
      return null;
    }
    return this.health.checkMe();
  }

  @ApiOperation({ summary: "Verifica se o endpoint de sessão está UP." })
  @ApiResponse({
    status: 200,
    description: "Swagger está disponível.",
    schema: {
      example: {
        status: "ok",
        info: {
          database: {
            status: "up",
          },
          session: {
            status: "up",
          },
        },
        error: {},
        details: {
          database: {
            status: "up",
          },
          session: {
            status: "up",
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: "Um ou mais serviços estão indisponíveis.",
    schema: {
      example: {
        status: "error",
        info: {
          database: {
            status: "up",
          },
        },
        error: {},
        details: {
          database: {
            status: "up",
          },
        },
      },
    },
  })
  @Get("/session")
  @HealthCheck()
  async verifyEndpointSessionURL(): Promise<HealthCheckResult> {
    if (!this.appReadinessService.isAppReady) {
      this.logger.warn(
        "Aplicação ainda não está pronta para checagens de saúde.",
      );
      return null;
    }
    return this.health.verifyEndpointSessionHealthCheck();
  }
}
