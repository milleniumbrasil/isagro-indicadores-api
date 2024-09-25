import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ChartService } from "./chart.service";
import { EnvironmentModule } from "../config/environment.module";
import { ChartController } from "./chart.controller";

@Module({
  imports: [
    HttpModule,
    EnvironmentModule, // Importa o EnvironmentModule para usar o EnvironmentService e o DataSourceService
  ],
  providers: [ChartService], // Registra-os como um provedores para ser utilizado por este módulo
  exports: [ChartService], // Exporta o ChartService para que possa ser injetado em outros módulos
  controllers: [ChartController],
})
export class ChartModule {}
