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
	@Get('/analyses')
	async getAvailableAnalyses(): Promise<string[]> {
		return this.chartService.findDistinctAnalyses();
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
		required: true,
		description: 'O tipo de análise para o qual os rótulos devem ser retornados.',
		example: 'erosão',
		enum: ['erosão', 'GEE', 'NH3', 'NPK', 'orgânicas', 'pesticidas', 'poluição'],
	})
	@ApiResponse({ status: 200, description: 'Rótulos válidos para a análise', type: [String] })
	@ApiResponse({ status: 400, description: 'Análise inválida ou não encontrada' })
	@Get('/labels')
	async getValidLabelsByAnalysis(@Query('analysis') analysis: string): Promise<string[]> {
		if (!analysis) {
			throw new BadRequestException('Análise obrigatória.');
		}
		const labels = await this.chartService.findDistinctLabels();
		if (!labels) {
			throw new BadRequestException('Análise inválida ou não encontrada.');
		}
		return labels;
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
