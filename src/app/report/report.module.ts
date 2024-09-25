import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ReportService } from "./report.service";
import { EnvironmentModule } from "../config/environment.module";
import { ReportController } from "./report.controller";
import { JwtAuthGuardModule } from "../middleware/jwt-auth.guard.module";
import { JwtAuthGuard } from "../middleware/jwt-auth.guard";

@Module({
  imports: [
    HttpModule,
    EnvironmentModule, // Importa o EnvironmentModule para usar o EnvironmentService e o DataSourceService
    JwtAuthGuardModule, // Importa o JwtAuthGuardModule para usar o JwtAuthGuard
  ],
  providers: [ReportService, JwtAuthGuard], // Registra-os como um provedores para ser utilizado por este módulo
  exports: [ReportService], // Exporta o ReportService para que possa ser injetado em outros módulos
  controllers: [ReportController],
})
export class ReportModule {}