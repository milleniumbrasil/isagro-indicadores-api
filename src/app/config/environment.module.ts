// src/app/config/environment.module.ts

import { Module } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";
import { DataSourceService } from "./datasource.service";
import { HttpModule } from "@nestjs/axios";
import { HttpSourceService } from "./httpsource.service";
import { AppReadinessService } from "./app.readiness.service";

@Module({
  imports: [HttpModule], // Importa o HttpModule para usar o axios
  providers: [
    AppReadinessService,
    EnvironmentService,
    DataSourceService,
    HttpSourceService,
  ], // Registra EnvironmentService, DataSourceService, HttpSourceService como um provedores para ser utilizado por este módulo
  exports: [
    AppReadinessService,
    DataSourceService,
    EnvironmentService,
    HttpSourceService,
  ], // Exporta EnvironmentService, DataSourceService, HttpSourceService para que possam ser injetados em outros módulos
})
export class EnvironmentModule {}
