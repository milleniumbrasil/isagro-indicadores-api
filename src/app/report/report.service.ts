import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DataSourceService } from "../config/datasource.service";
import { ReportEntity } from "@app/entities/report";
import { ReportQueryDTO, ReportPersistDTO } from "./report.dto";


@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(private dataSourceService: DataSourceService) {}

  async create(dto: ReportPersistDTO): Promise<ReportQueryDTO> {
    this.logger.log(`Creating report`);
    const newEntity = new ReportEntity();
    newEntity.country = dto.country;
    newEntity.state = dto.state;
    newEntity.city = dto.city;
    newEntity.source = dto.source;
    newEntity.period = dto.period;
    newEntity.label = dto.label;
    newEntity.value = dto.value;
    newEntity.external_id = dto.external_id;
    newEntity.analysis = dto.analysis;

    

    const savedEntity = await this.dataSourceService
      .getDataSource()
      .getRepository(ReportEntity)
      .save(newEntity);

    return this.toDTO(savedEntity);
  }

  async findByExternalId(external_id: string): Promise<ReportQueryDTO> {
    this.logger.log(`Finding report with External ID: ${external_id}`);
    const entity = await this.dataSourceService
      .getDataSource()
      .getRepository(ReportEntity)
      .findOne({
        where: { external_id }
      });

    if (!entity) {
      throw new NotFoundException("Report not found");
    }

    return this.toDTO(entity);
  }

  async findAll(): Promise<ReportQueryDTO[]> {
    this.logger.log("Finding all reports");
    const entities = await this.dataSourceService
      .getDataSource()
      .getRepository(ReportEntity)
      .find();
    return entities.map((entity: ReportEntity) => this.toDTO(entity));
  }

  async updateByExternalId(external_id: string, dto: ReportPersistDTO): Promise<ReportQueryDTO> {
    this.logger.log(`Updating report with External ID: ${external_id}`);
    let entity = await this.dataSourceService
      .getDataSource()
      .getRepository(ReportEntity)
      .findOne({ where: { external_id } });

    if (!entity) {
      throw new NotFoundException("Report not found");
    }
    entity.country = dto.country;
    entity.state = dto.state;
    entity.city = dto.city;
    entity.source = dto.source;
    entity.period = dto.period;
    entity.label = dto.label;
    entity.value = dto.value;
    entity.external_id = dto.external_id;
    entity.analysis = dto.analysis;

    

    const updatedEntity = await this.dataSourceService
      .getDataSource()
      .getRepository(ReportEntity)
      .save(entity);

    return this.toDTO(updatedEntity);
  }

  async deleteByExternalId(external_id: string): Promise<void> {
    this.logger.log(`Deleting report with External ID: ${external_id}`);
    const entity = await this.dataSourceService
      .getDataSource()
      .getRepository(ReportEntity)
      .findOne({ where: { external_id } });

    if (!entity) {
      throw new NotFoundException("Report not found");
    }

    await this.dataSourceService
      .getDataSource()
      .getRepository(ReportEntity)
      .softDelete({ external_id: entity.external_id });
  }

  private toDTO(entity: ReportEntity): ReportQueryDTO {
    this.logger.log(`Mapping entity to DTO: ${entity.external_id}`);
    const dto = new ReportQueryDTO();
    dto.country = entity.country;
    dto.state = entity.state;
    dto.city = entity.city;
    dto.source = entity.source;
    dto.period = entity.period;
    dto.label = entity.label;
    dto.value = entity.value;
    dto.external_id = entity.external_id;
    dto.analysis = entity.analysis;
    
    dto.external_id = entity.external_id;
    return dto;
  }
  }