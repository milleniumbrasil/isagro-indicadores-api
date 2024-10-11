import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChartService } from './chart.service';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
	constructor(private readonly chartService: ChartService) {}

	@ApiOperation({
		summary: 'Retorna os tipos de análises disponíveis',
		description: 'Este endpoint retorna uma lista de tipos de análises disponíveis.',
	})
	@ApiResponse({ status: 200, description: 'Lista de análises disponíveis', type: [String] })
	@Get('/analysis')
	async getAvailableanalysis(): Promise<string[]> {
		return this.chartService.findDistinctanalysis();
	}

	@ApiOperation({
		summary: 'Retorna as instituições, organizações ou fontes de pesquisa para o qual os dados devem ser retornados.',
		description: 'Este endpoint retorna uma lista de instituições, organizações ou fontes de pesquisa disponíveis.',
	})
	@ApiResponse({ status: 200, description: 'Lista de fontes de pesquisa disponíveis', type: [String] })
	@Get('/sources')
	async getAvailableSources(): Promise<string[]> {
		return this.chartService.findDistinctSources();
	}

	@ApiOperation({
		summary: 'Retorna rótulos válidos para uma análise específica',
		description: 'Esse endpoint retorna os rótulos válidos com base no tipo de análise passada como parâmetro.',
	})
	@ApiQuery({
		name: 'analysis',
		required: false,
		description: 'O tipo de análise para o qual os rótulos devem ser retornados.',
		example: 'GEE',
		enum: ["Área Agrícola", "GEE", "NH3", "NPK"],
	})
	@ApiResponse({ status: 200, description: 'Rótulos válidos para a análise', type: [String] })
	@ApiResponse({ status: 400, description: 'Análise inválida ou não encontrada' })
	@Get('/labels')
	async getLabels(@Query('analysis') analysis?: string): Promise<string[]> {
		if (analysis) {
			const labels = await this.chartService.findDistinctLabelsByAnalysis(analysis);
			if (!labels || labels.length === 0) {
				throw new BadRequestException('Nenhum rótulo encontrado para a análise especificada.');
			}
			return labels;
		} else {
			const allLabels = await this.chartService.findDistinctLabels();
			if (!allLabels || allLabels.length === 0) {
				throw new BadRequestException('Nenhum rótulo encontrado.');
			}
			return allLabels;
		}
	}

	@ApiOperation({
		summary: 'Retorna os países disponíveis',
		description: 'Este endpoint retorna uma lista de países disponíveis.',
	})
	@ApiResponse({ status: 200, description: 'Lista de países disponíveis', type: [String] })
	@Get('/countries')
	async getAvailableCountries(): Promise<string[]> {
		return this.chartService.findDistinctCountries();
	}

	@ApiOperation({
		summary: 'Retorna os estados disponíveis',
		description: 'Este endpoint retorna uma lista de estados disponíveis.',
	})
	@ApiResponse({ status: 200, description: 'Lista de estados disponíveis', type: [String] })
	@Get('/states')
	async getAvailableStates(): Promise<string[]> {
		return this.chartService.findDistinctStates();
	}

	@ApiOperation({
		summary: 'Retorna as cidades disponíveis',
		description: 'Este endpoint retorna uma lista de cidades disponíveis.',
	})
	@ApiResponse({ status: 200, description: 'Lista de cidades disponíveis', type: [String] })
	@Get('/cities')
	async getAvailableCities(): Promise<string[]> {
		return this.chartService.findDistinctCities();
	}
}
