import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ReportService } from "./report.service";
import { EnvironmentModule } from "../config/environment.module";
import { ReportController } from "./report.controller";

@Module({
  imports: [
    HttpModule,
    EnvironmentModule, // Importa o EnvironmentModule para usar o EnvironmentService e o DataSourceService
  ],
  providers: [ReportService], // Registra-os como um provedores para ser utilizado por este módulo
  exports: [ReportService], // Exporta o ReportService para que possa ser injetado em outros módulos
  controllers: [ReportController],
})
export class ReportModule {}