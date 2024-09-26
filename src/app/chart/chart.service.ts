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

	public getAvailableSources(): string[] {
		return ['OCDE', 'IAC', 'UNB'];
	}

	public getAvailableAnalyses(): string[] {
		return ['erosão', 'GEE', 'NH3', 'NPK', 'orgânicas', 'pesticidas', 'poluição'];
	}

	public getErosoesValidLabels(): string[] {
		return ['pastagem', 'cultura'];
	}

	public getGEEValidLabels(): string[] {
		return ['tecnologia2', 'tecnologia1', 'tecnologia3', 'tecnologia4'];
	}

	public getNH3ValidLabels(): string[] {
		return ['fertilizantes químicos', 'fertilizantes orgânicos', 'manejo de esterco', 'deposição de extretas', 'queimas de resíduos de culturas'];
	}

	public getNPKValidLabels(): string[] {
		return ['dejetos animais', 'deposição atmosférica', 'fertilizantes minerais', 'fertilizantes orgânicos', 'fixação biológica de nitrogênio', 'resíduos culturais', 'resíduos industriais', 'resíduos urbanos', 'produção carne bovina', 'produção agrícola', 'área agropecuária'];
	}

	public getOrganicasValidLabels(): string[] {
		return ['grão', 'hortaliças', 'fruticultura', 'pastagem'];
	}

	public getPesticidasValidLabels(): string[] {
		return ['herbicidas', 'fungicidas', 'inseticitas', 'outros'];
	}

	public getPoluicoesValidLabels(): string[] {
		return ['nitrato', 'fosfato', 'cations', 'anions'];
	}

	getValidLabelsByAnalysis(analysis: string): string[] {
		switch (analysis.toLowerCase()) {
			case 'erosão':
				return this.getErosoesValidLabels();
			case 'gee':
				return this.getGEEValidLabels();
			case 'nh3':
				return this.getNH3ValidLabels();
			case 'npk':
				return this.getNPKValidLabels();
			case 'orgânicas':
				return this.getOrganicasValidLabels();
			case 'pesticidas':
				return this.getPesticidasValidLabels();
			case 'poluição':
				return this.getPoluicoesValidLabels();
			default:
				return null; // Retorna null para análises não reconhecidas
		}
	}

	private getWhereClause(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string): string {

        let whereClause = `WHERE tb_chart.analysis = '${analysis}'`;

        if (startDate || endDate) {
			if (startDate && endDate) {
				whereClause += ` AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;
			} else if (startDate && !endDate) {
				const today = new Date();
				const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            	whereClause += ` AND tb_chart.period BETWEEN '${startDate}' AND '${formattedDate}'`;
			} else if (!startDate && endDate) {
				whereClause += ` AND tb_chart.period BETWEEN '1900-01-01' AND '${endDate}'`;
			}
        }

        if (label) {
			whereClause += ` AND tb_chart.label = '${label}'`;
        }

        if (country) {
            whereClause += ` AND tb_chart.country = '${country}'`;
        }

        if (state) {
            whereClause += ` AND tb_chart.state = '${state}'`;
        }

        if (city) {
            whereClause += ` AND tb_chart.city = '${city}'`;
        }

        if (source) {
            whereClause += ` AND tb_chart.source = '${source}'`;
        }
		return whereClause;
	}

    async findPercentageAnnual(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding annual percnetage stacked charts for analysis=${analysis}, label=${label}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
            WITH PeriodTotals AS (
				SELECT
					EXTRACT(YEAR FROM tb_chart.period) AS period_group,
					SUM(value) AS total_value_period
				FROM
					tb_chart
            	${whereClause}
				GROUP BY
					EXTRACT(YEAR FROM tb_chart.period)
			)
			SELECT
				X.period_group,
				X.label,
				X.total_value,
				X.total_count,
				PT.total_value_period,
				ROUND((X.total_value::numeric / PT.total_value_period::numeric) * 100, 2) AS percentual
			FROM (
				SELECT
					EXTRACT(YEAR FROM tb_chart.period) AS period_group,
					tb_chart.label,
					SUM(value) AS total_value,
					COUNT(value) AS total_count
				FROM
					tb_chart
            	${whereClause}
				GROUP BY
					EXTRACT(YEAR FROM tb_chart.period), tb_chart.label
				ORDER BY
					period_group ASC, tb_chart.label ASC
			) AS X
			JOIN PeriodTotals PT ON X.period_group = PT.period_group
			ORDER BY
				X.period_group ASC, X.label ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        return result.map((item: any) => ({
            period: item.period_group,
            entry: [item.label, item.percentual],
        }));
    }

    async findPercentageBiennial(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {

        this.logger.log(`Finding biennial percnetage stacked charts for analysis=${analysis}, label=${label}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
					SELECT
						Report.start_period_group,
						Report.end_period_group,
						Report.total_value,
						Report.total_count,
						ROUND((Report.total_value / NULLIF(TotalSum.total_value_all_periods, 0)) * 100, 2) AS percentual_total
					FROM (
						SELECT
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 2) * 2 AS start_period_group,
							(FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 2) * 2) + 1 AS end_period_group,
							SUM(tb_chart.value) AS total_value,
							COUNT(tb_chart.value) AS total_count
						FROM
							tb_chart
            			${whereClause}
						GROUP BY
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 2)
					) AS Report
					CROSS JOIN (
						SELECT
							SUM(CAST(tb_chart.value AS DECIMAL)) AS total_value_all_periods
						FROM
							tb_chart
            			${whereClause}
					) AS TotalSum
					ORDER BY
						Report.start_period_group ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        const stackedData = result.map((item: any) => ({
            period: `${item.start_period_group}-${item.end_period_group}`,
            entry: [analysis, item.percentual_total],
        }));

		return stackedData;
    }

    async findPercentageTriennial(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding triennial percnetage stacked charts for analysis=${analysis}, label=${label}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
					SELECT
						Report.start_period_group,
						Report.end_period_group,
						Report.total_value,
						Report.total_count,
						ROUND((Report.total_value / NULLIF(TotalSum.total_value_all_periods, 0)) * 100, 2) AS percentual_total
					FROM (
						SELECT
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 3) * 3 AS start_period_group,
							(FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 3) * 3) + 2 AS end_period_group,
							SUM(tb_chart.value) AS total_value,
							COUNT(tb_chart.value) AS total_count
						FROM
							tb_chart
            			${whereClause}
						GROUP BY
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 3)
					) AS Report
					CROSS JOIN (
						SELECT
							SUM(CAST(tb_chart.value AS DECIMAL)) AS total_value_all_periods
						FROM
							tb_chart
            			${whereClause}
					) AS TotalSum
					ORDER BY
						Report.start_period_group ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        const stackedData = result.map((item: any) => ({
            period: `${item.start_period_group}-${item.end_period_group}`,
            entry: [analysis, item.percentual_total],
        }));

		return stackedData;
    }

    async findPercentageQuadrennial(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding quadrennial percnetage stacked charts for analysis=${analysis}, label=${label}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
					SELECT
						Report.start_period_group,
						Report.end_period_group,
						Report.total_value,
						Report.total_count,
						ROUND((Report.total_value / NULLIF(TotalSum.total_value_all_periods, 0)) * 100, 2) AS percentual_total
					FROM (
						SELECT
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 4) * 4 AS start_period_group,
							(FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 4) * 4) + 3 AS end_period_group,
							SUM(tb_chart.value) AS total_value,
							COUNT(tb_chart.value) AS total_count
						FROM
							tb_chart
            			${whereClause}
						GROUP BY
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 4)
					) AS Report
					CROSS JOIN (
						SELECT
							SUM(CAST(tb_chart.value AS DECIMAL)) AS total_value_all_periods
						FROM
							tb_chart
            			${whereClause}
					) AS TotalSum
					ORDER BY
						Report.start_period_group ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        const stackedData = result.map((item: any) => ({
            period: `${item.start_period_group}-${item.end_period_group}`,
            entry: [analysis, item.percentual_total],
        }));

		return stackedData;
    }

    async findPercentageQuintennial(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {

        this.logger.log(`Finding quintennial percnetage stacked charts for analysis=${analysis}, label=${label}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
					SELECT
						Report.start_period_group,
						Report.end_period_group,
						Report.total_value,
						Report.total_count,
						ROUND((Report.total_value / NULLIF(TotalSum.total_value_all_periods, 0)) * 100, 2) AS percentual_total
					FROM (
						SELECT
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 5) * 5 AS start_period_group,
							(FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 5) * 5) + 4 AS end_period_group,
							SUM(tb_chart.value) AS total_value,
							COUNT(tb_chart.value) AS total_count
						FROM
							tb_chart
            			${whereClause}
						GROUP BY
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / 5)
					) AS Report
					CROSS JOIN (
						SELECT
							SUM(CAST(tb_chart.value AS DECIMAL)) AS total_value_all_periods
						FROM
							tb_chart
            			${whereClause}
					) AS TotalSum
					ORDER BY
						Report.start_period_group ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        const stackedData = result.map((item: any) => ({
            period: `${item.start_period_group}-${item.end_period_group}`,
            entry: [analysis, item.percentual_total],
        }));

		return stackedData;
    }

    async findPercentage(
        analysis: string,
		range: number,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {

        this.logger.log(`Finding percnetage stacked charts for analysis=${analysis}, range=${range}, label=${label}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
					SELECT
						Report.start_period_group,
						Report.end_period_group,
						Report.total_value,
						Report.total_count,
						ROUND((Report.total_value / NULLIF(TotalSum.total_value_all_periods, 0)) * 100, 2) AS percentual_total
					FROM (
						SELECT
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / ${range}) * ${range} AS start_period_group,
							(FLOOR(EXTRACT(YEAR FROM tb_chart.period) / ${range}) * ${range}) + ${range-1} AS end_period_group,
							SUM(tb_chart.value) AS total_value,
							COUNT(tb_chart.value) AS total_count
						FROM
							tb_chart
            			${whereClause}
						GROUP BY
							FLOOR(EXTRACT(YEAR FROM tb_chart.period) / ${range})
					) AS Report
					CROSS JOIN (
						SELECT
							SUM(CAST(tb_chart.value AS DECIMAL)) AS total_value_all_periods
						FROM
							tb_chart
            			${whereClause}
					) AS TotalSum
					ORDER BY
						Report.start_period_group ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        const stackedData = result.map((item: any) => ({
            period: `${item.start_period_group}-${item.end_period_group}`,
            entry: [analysis, item.percentual_total],
        }));

		return stackedData;
    }

    async findSumAnnual(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding annual stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
            SELECT
                EXTRACT(YEAR FROM period) AS period_group,
                label,
                SUM(value) AS total_value
            FROM
                tb_chart
            ${whereClause}
            GROUP BY
                EXTRACT(YEAR FROM period), label
            ORDER BY
                period_group ASC, label ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        return result.map((item: any) => ({
            period: item.period_group,
            entry: [item.label, item.total_value],
        }));
    }

    async findSumBiennial(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding biennial stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
            SELECT
                FLOOR(EXTRACT(YEAR FROM period) / 2) * 2 AS period_group,
                label,
                SUM(value) AS total_value
            FROM
                tb_chart
            ${whereClause}
            GROUP BY
                FLOOR(EXTRACT(YEAR FROM period) / 2) * 2, label
            ORDER BY
                period_group ASC, label ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        return result.map((item: any) => ({
            period: item.period_group,
            entry: [item.label, item.total_value],
        }));
    }

    async findSumTriennial(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding triennial stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
            SELECT
                FLOOR(EXTRACT(YEAR FROM period) / 3) * 3 AS period_group,
                label,
                SUM(value) AS total_value
            FROM
                tb_chart
            ${whereClause}
            GROUP BY
                FLOOR(EXTRACT(YEAR FROM period) / 3) * 3, label
            ORDER BY
                period_group ASC, label ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        return result.map((item: any) => ({
            period: item.period_group,
            entry: [item.label, item.total_value],
        }));
    }

    async findSumQuadrennial(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding quadrennial stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
            SELECT
                FLOOR(EXTRACT(YEAR FROM period) / 4) * 4 AS period_group,
                label,
                SUM(value) AS total_value
            FROM
                tb_chart
            ${whereClause}
            GROUP BY
                FLOOR(EXTRACT(YEAR FROM period) / 4) * 4, label
            ORDER BY
                period_group ASC, label ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        return result.map((item: any) => ({
            period: item.period_group,
            entry: [item.label, item.total_value],
        }));
    }

    async findSumQuintennial(
        analysis: string,
        label?: string,
        startDate?: string,
        endDate?: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding quintennial stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();
		const whereClause = this.getWhereClause(analysis, label, startDate, endDate, country, state, city, source);

        const query = `
            SELECT
                FLOOR(EXTRACT(YEAR FROM period) / 5) * 5 AS period_group,
                label,
                SUM(value) AS total_value
            FROM
                tb_chart
            ${whereClause}
            GROUP BY
                FLOOR(EXTRACT(YEAR FROM period) / 5) * 5, label
            ORDER BY
                period_group ASC, label ASC;
        `;

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        return result.map((item: any) => ({
            period: item.period_group,
            entry: [item.label, item.total_value],
        }));
    }
}
