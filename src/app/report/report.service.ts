import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DataSourceService } from "../config/datasource.service";
import { ReportEntity } from "@app/entities/report";
import { ReportQueryDTO } from "./report.dto";

@Injectable()
export class ReportService {

  private readonly logger = new Logger(ReportService.name);

  constructor(private dataSourceService: DataSourceService) {}

  async findByParams(analysis: string, country: string, state: string, period?: string, source?: string, city?: string, label?: string): Promise<ReportQueryDTO[]> {
      this.logger.log(`Finding report with: ${analysis} ${country} ${state} ${period} ${source} ${city} ${label}`);

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
          .getRepository(ReportEntity)
          .find({
              where: whereConditions
          });

      if (!entities) {
          throw new NotFoundException("Report not found");
      }

      return this.toDTO(entities);
  }

private toDTO(entities: ReportEntity[]): ReportQueryDTO[] {
    const result = entities.map(entity => {
      this.logger.log(`Mapping entity to DTO: ${entity.external_id}`);
      const dto = new ReportQueryDTO();
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