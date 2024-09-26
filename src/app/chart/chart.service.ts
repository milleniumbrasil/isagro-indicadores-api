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

    async findPercentageAnnual(
        analysis: string,
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding annual percnetage stacked charts for analysis=${analysis}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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

        const query = `
            SELECT
                EXTRACT(YEAR FROM tb_chart.period) AS period_group,
                label,
                ROUND(AVG(tb_chart.value), 2) AS average_value
            FROM
                tb_chart
            ${whereClause}
            GROUP BY
                EXTRACT(YEAR FROM tb_chart.period), tb_chart.label
            ORDER BY
                period_group ASC, tb_chart.label ASC;
        `;

		this.logger.log(`Query: ${query}`);

        const result = await queryRunner.query(query);
        await queryRunner.release();

        if (!result || result.length === 0) {
            throw new NotFoundException('Nenhum dado encontrado para o período especificado');
        }

        return result.map((item: any) => ({
            period: item.period_group,
            entry: [item.label, item.average_value],
        }));
    }

    async findPercentageBiennial(
        analysis: string,
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {

        this.logger.log(`Finding biennial percnetage stacked charts for analysis=${analysis}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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

        const query = `
            SELECT
                FLOOR(EXTRACT(YEAR FROM period) / 2) * 2 AS period_group,
                label,
                ROUND(AVG(value), 2) AS average_value
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
            entry: [item.label, item.average_value],
        }));
    }

    async findPercentageTriennial(
        analysis: string,
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding triennial percnetage stacked charts for analysis=${analysis}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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

        const query = `
            SELECT
                FLOOR(EXTRACT(YEAR FROM period) / 3) * 3 AS period_group,
                label,
                ROUND(AVG(value), 2) AS average_value
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
            entry: [item.label, item.average_value],
        }));
    }

    async findPercentageQuadrennial(
        analysis: string,
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding quadrennial percnetage stacked charts for analysis=${analysis}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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

        const query = `
            SELECT
                FLOOR(EXTRACT(YEAR FROM period) / 4) * 4 AS period_group,
                label,
                ROUND(AVG(value), 2) AS average_value
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
            entry: [item.label, item.average_value],
        }));
    }

    async findPercentageQuintennial(
        analysis: string,
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {

        this.logger.log(`Finding quintennial percnetage stacked charts for analysis=${analysis}, startDate=${startDate}, endDate=${endDate}, country=${country}, state=${state}, city=${city}, source=${source}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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

        const query = `
            SELECT
                FLOOR(EXTRACT(YEAR FROM period) / 5) * 5 AS period_group,
                label,
                ROUND(AVG(value), 2) AS average_value
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
            entry: [item.label, item.average_value],
        }));
    }


    async findSumAnnual(
        analysis: string,
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding annual stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding biennial stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding triennial stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding quadrennial stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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
        startDate: string,
        endDate: string,
        country?: string,
        state?: string,
        city?: string,
        source?: string,
    ): Promise<IStackedData[]> {
        this.logger.log(`Finding quintennial stacked charts for analysis: ${analysis}, from ${startDate} to ${endDate}`);

        const queryRunner = this.dataSourceService.getDataSource().createQueryRunner();

        let whereClause = `WHERE tb_chart.analysis = '${analysis}' AND tb_chart.period BETWEEN '${startDate}' AND '${endDate}'`;

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
