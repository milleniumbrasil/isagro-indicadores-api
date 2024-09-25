import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DataSourceService } from "../config/datasource.service";
import { ChartEntity } from "../entities/chart";
import { IStackedData } from "./IStackedData";
import { Between } from "typeorm";

@Injectable()
export class ChartService {

    private readonly logger = new Logger(ChartService.name);

    constructor(private dataSourceService: DataSourceService) { }

    protected toStackedData(chart: ChartEntity[]): IStackedData[] {
        return chart.map(item => ({
            period: item.period,
            entry: [item.label, item.value]
        }));
    }

    async findStackedByDates(
        analysis: string,
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
        period: 'annual' | 'biennial' | 'triennial' | 'quadrennial' | 'quintennial' = 'annual',
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding stacked charts for analysis: ${analysis}, period: ${period}, from ${startDate} to ${endDate}`);

        // Montando o objeto where de forma dinâmica
        const whereConditions: any = {
            analysis,
            date: Between(startDate, endDate),
        };

        if (country) {
            whereConditions.country = country;
        }
        if (state) {
            whereConditions.state = state;
        }
        if (city) {
            whereConditions.city = city;
        }
        if (source) {
            whereConditions.source = source;
        }

        // Calculando o agrupamento e percentuais baseado no período solicitado
        let groupBy: string;
        switch (period) {
            case 'biennial':
                groupBy = `FLOOR(EXTRACT(YEAR FROM date) / 2) * 2`; // Agrupamento bianual
                break;
            case 'triennial':
                groupBy = `FLOOR(EXTRACT(YEAR FROM date) / 3) * 3`; // Agrupamento trianual
                break;
            case 'quadrennial':
                groupBy = `FLOOR(EXTRACT(YEAR FROM date) / 4) * 4`; // Agrupamento quadrianuais
                break;
            case 'quintennial':
                groupBy = `FLOOR(EXTRACT(YEAR FROM date) / 5) * 5`; // Agrupamento pentanuais
                break;
            case 'annual':
            default:
                groupBy = `EXTRACT(YEAR FROM date)`; // Agrupamento anual
                break;
        }

        const queryBuilder = this.dataSourceService
            .getDataSource()
            .getRepository(ChartEntity)
            .createQueryBuilder('chart')
            .select([
                `ROUND(AVG(chart.value), 2) AS value`,
                `${groupBy} AS period`,
                'chart.label',
            ])
            .where(whereConditions)
            .groupBy(groupBy)
            .addGroupBy('chart.label');

        const result = await queryBuilder.getRawMany();

        if (!result.length) {
            throw new NotFoundException('Nenhum chart encontrado');
        }

        return result.map(item => ({
            period: item.period,
            entry: [item.label, item.value],
        }));
    }

    async findPercentageByDates(
        analysis: string,
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
        periodType?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Calculating percentages for analysis: ${analysis}, period: ${startDate} to ${endDate}`);

        // Converte as strings de datas para objetos Date
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Realiza o processamento dos dados baseado nas datas e no período fornecido
        // Exemplo simplificado de uma consulta de percentuais baseada em datas

        // Você pode construir a lógica para calcular os percentuais anuais, bianuais, etc.
        // com base nas datas convertidas e ajustar a lógica do repositório abaixo.

        const entities = await this.dataSourceService
            .getDataSource()
            .getRepository(ChartEntity)
            .find({
                where: {
                    analysis,
                    country,
                    state,
                    city,
                    source,
                    // Aqui você aplicaria as datas conforme a lógica que deseja para o cálculo de percentuais
                    // Por exemplo, filtrando os registros entre start e end
                },
            });

        if (!entities || entities.length === 0) {
            throw new NotFoundException('No charts found');
        }

        return this.toStackedData(entities);
    }

}
