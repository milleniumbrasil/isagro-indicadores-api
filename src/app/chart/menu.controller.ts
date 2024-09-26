
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ChartService } from './chart.service';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {

	constructor(private readonly chartService: ChartService) { }

	@ApiOperation({
		summary: 'Retorna os tipos de análises disponíveis',
		description: 'Este endpoint retorna uma lista de tipos de análises disponíveis.',
	})
	@ApiResponse({ status: 200, description: 'Lista de análises disponíveis', type: [String] })
	@Get('/analyses')
	async getAvailableAnalyses(): Promise<string[]> {
		return this.chartService.getAvailableAnalyses();
	}

	@ApiOperation({
		summary: 'Retorna as instituições, organizações ou fontes de pesquisa para o qual os dados devem ser retornados.',
		description: 'Este endpoint retorna uma lista de as instituições, organizações ou fontes de pesquisa, disponíveis. Opções: OCDE (Organização para a Cooperação e Desenvolvimento Econômico), IAC (Instituto Agronômico de Campinas), UNB (Universidade de Brasília), etc.',
	})
	@ApiResponse({ status: 200, description: 'Lista de as instituições, organizações ou fontes de pesquisa, disponíveis', type: [String] })
	@Get('/sources')
	async getAvailableSources(): Promise<string[]> {
		return this.chartService.getAvailableSources();
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
			throw new BadRequestException(`Análise ${analysis} obrigatória.`);
		}
		const labels = this.chartService.getValidLabelsByAnalysis(analysis);
		if (!labels) {
			throw new BadRequestException('Análise inválida ou não encontrada');
		}
		return labels;
	}
}
