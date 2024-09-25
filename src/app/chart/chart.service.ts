import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DataSourceService } from "../config/datasource.service";
import { ChartEntity } from "../entities/chart";
import { IStackedData } from "./IStackedData";

@Injectable()
export class ChartService {

  private readonly logger = new Logger(ChartService.name);

  constructor(private dataSourceService: DataSourceService) {}

  	protected toStackedData(chart: ChartEntity[]): IStackedData[] {
		return chart.map(item => ({
			period: item.period,
			entry: [item.label, item.value]
		}));
	}

  async findPercentageCharts(analysis: string, country: string, state: string, period?: string, source?: string, city?: string, label?: string): Promise<IStackedData[]> {
      this.logger.log(`Finding percentuals chart with: ${analysis} ${country} ${state} ${period} ${source} ${city} ${label}`);

      // Montando o objeto where de forma dinâmica
      const whereConditions: any = {
          analysis,
          country,
          state,
      };

      if (period) {
          whereConditions.period = period;
      }
      if (source) {
          whereConditions.source = source;
      }
      if (city) {
          whereConditions.city = city;
      }
      if (label) {
          whereConditions.label = label;
      }

      // Executando a busca com o repositório
      const entities = await this.dataSourceService
          .getDataSource()
          .getRepository(ChartEntity)
          .find({
              where: whereConditions
          });

      if (!entities) {
          throw new NotFoundException("Chart not found");
      }

      return this.toStackedData(entities);
  }

  async findStackedCharts(analysis: string, country: string, state: string, period?: string, source?: string, city?: string, label?: string): Promise<IStackedData[]> {
      this.logger.log(`Finding chart with: ${analysis} ${country} ${state} ${period} ${source} ${city} ${label}`);

      // Montando o objeto where de forma dinâmica
      const whereConditions: any = {
          analysis,
          country,
          state,
      };

      if (period) {
          whereConditions.period = period;
      }
      if (source) {
          whereConditions.source = source;
      }
      if (city) {
          whereConditions.city = city;
      }
      if (label) {
          whereConditions.label = label;
      }

      // Executando a busca com o repositório
      const entities = await this.dataSourceService
          .getDataSource()
          .getRepository(ChartEntity)
          .find({
              where: whereConditions
          });

      if (!entities) {
          throw new NotFoundException("Chart not found");
      }

      return this.toStackedData(entities);
  }

}
