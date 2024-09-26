import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ChartService } from "./chart.service";
import { EnvironmentModule } from "../config/environment.module";
import { MenuController } from "./menu.controller";
import { SumController } from "./sum.controller";
import { PercentageController } from "./percentage.controller";
import { MobileAverageController } from "./mobile-average.controller";

@Module({
  imports: [
    HttpModule,
    EnvironmentModule, // Importa o EnvironmentModule para usar o EnvironmentService e o DataSourceService
  ],
  providers: [ChartService], // Registra-os como um provedores para ser utilizado por este módulo
  exports: [ChartService], // Exporta o ChartService para que possa ser injetado em outros módulos
  controllers: [SumController, PercentageController, MenuController, MobileAverageController], // Registra os controladores para serem utilizados por este módulo
})
export class ChartModule {}
