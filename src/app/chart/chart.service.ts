import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DataSourceService } from "../config/datasource.service";
import { ChartEntity } from "../entities/chart";
import { ChartQueryDTO } from "./chart.dto";

@Injectable()
export class ChartService {

  private readonly logger = new Logger(ChartService.name);

  constructor(private dataSourceService: DataSourceService) {}

  async findByParams(analysis: string, country: string, state: string, period?: string, source?: string, city?: string, label?: string): Promise<ChartQueryDTO[]> {
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

      return this.toDTO(entities);
  }

private toDTO(entities: ChartEntity[]): ChartQueryDTO[] {
    const result = entities.map(entity => {
      this.logger.log(`Mapping entity to DTO: ${entity.external_id}`);
      const dto = new ChartQueryDTO();
      dto.country = entity.country;
      dto.state = entity.state;
      dto.city = entity.city;
      dto.source = entity.source;
      dto.period = entity.period;
      dto.label = entity.label;
      dto.value = entity.value;
      dto.analysis = entity.analysis;
      dto.external_id = entity.external_id;
      return dto;
    });
    return result;
  }

}
