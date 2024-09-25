// src/app/middleware/jwt-auth.guard.module.ts

import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { EnvironmentModule } from "../config/environment.module";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { HttpSourceService } from "../config/httpsource.service";

@Module({
  imports: [
    HttpModule,
    EnvironmentModule, // Importa o EnvironmentModule para usar o EnvironmentService e o DataSourceService
  ],
  providers: [JwtAuthGuard, HttpSourceService], // Registra-os como um provedores para ser utilizado por este módulo
  exports: [JwtAuthGuard], // Exporta-os para que possa serem injetados em outros módulos
})
export class JwtAuthGuardModule {}
