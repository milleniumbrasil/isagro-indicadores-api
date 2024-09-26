
import { Controller, Get, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ChartService } from './chart.service';
import { IStackedData } from './IStackedData';

@ApiTags('chart')
@Controller('chart')
export class ChartController {

	constructor(private readonly chartService: ChartService) { }

	@ApiOperation({
		summary: 'Retorna os tipos de análises disponíveis',
		description: 'Este endpoint retorna uma lista de tipos de análises disponíveis.',
	})
	@ApiResponse({ status: 200, description: 'Lista de análises disponíveis', type: [String] })
	@Get('/available-analyses')
	async getAvailableAnalyses(): Promise<string[]> {
		return this.chartService.getAvailableAnalyses();
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
	@Get('/valid-labels')
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

	@ApiOperation({
		summary: "Busca percentuais anuais dos Charts pelo analysis e intervalo de datas.",
		description: "Este endpoint busca percentuais anuais na tabela TB_Chart com base nas datas fornecidas.",
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
	@ApiResponse({ status: 200, description: 'Lista de percentuais anuais.', type: [IStackedData] })
	@Get('/sum-annual')
	async findAnnualSum(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findSumAnnual(analysis, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Busca percentuais bianuais dos Charts pelo analysis e intervalo de datas.',
		description: 'Este endpoint busca percentuais bianuais na tabela TB_Chart com base nas datas fornecidas.',
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
	@ApiResponse({ status: 200, description: 'Lista de percentuais bianuais.', type: [IStackedData] })
	@Get('/sum-biennial')
	async findBiennialSum(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findSumBiennial(analysis, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Busca percentuais trianuais dos Charts pelo analysis e intervalo de datas.',
		description: 'Este endpoint busca percentuais trianuais na tabela TB_Chart com base nas datas fornecidas.',
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
	@ApiResponse({ status: 200, description: 'Lista de percentuais trianuais.', type: [IStackedData] })
	@Get('/sum-triennial')
	async findTriennialSum(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findSumTriennial(analysis, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Busca percentuais quadrianuais dos Charts pelo analysis e intervalo de datas.',
		description: 'Este endpoint busca percentuais quadrianuais na tabela TB_Chart com base nas datas fornecidas.',
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
	@ApiResponse({ status: 200, description: 'Lista de percentuais quadrianuais.', type: [IStackedData] })
	@Get('/sum-quadrennial')
	async findQuadrennialSum(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findSumQuadrennial(analysis, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Busca percentuais pentanuais dos Charts pelo analysis e intervalo de datas.',
		description: 'Este endpoint busca percentuais pentanuais na tabela TB_Chart com base nas datas fornecidas.',
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
	@ApiResponse({ status: 200, description: 'Lista de percentuais pentanuais.', type: [IStackedData] })
	@Get('/sum-quintennial')
	async findQuintennialSum(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findSumQuintennial(analysis, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Busca percentuais anuais dos Charts pelo analysis e intervalo de datas.',
		description: 'Este endpoint busca percentuais anuais na tabela TB_Chart com base nas datas fornecidas.',
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.', example: 'orgânicas', enum: ['erosão', 'GEE', 'NH3', 'NPK', 'orgânicas', 'pesticidas', 'poluição'] })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.', example: '1990-01-01' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.', example: '1995-12-31' })
	@ApiQuery({ name: 'country', required: false, description: 'O país para o qual os dados devem ser retornados. Opções: BR, US, FR, etc.', example: 'BR', enum: ['BR', 'US', 'FR'] })
	@ApiQuery({
		name: 'state',
		required: false,
		description: 'O estado para o qual os dados devem ser retornados. Opções: SP, RJ, MG, etc.',
		example: 'SP',
		enum: [
			'AC', 'MS', 'RS', 'CE', 'RO', 'SC', 'SE', 'AP', 'PB', 'AL', 'PE', 'PR', 'RJ', 'MT',
			'DF', 'AM', 'BA', 'SP', 'ES', 'PI', 'PA', 'RR', 'MA', 'TO', 'GO', 'RN', 'MG'
		],
	})
	@ApiQuery({
		name: 'city',
		required: false,
		description: 'O label para o qual os dados devem ser retornados. Opções: São Paulo, Maceió, Manaus, etc.',
		example: 'São Paulo',
		enum: [
			'Rio Branco',
			'Arapiraca',
			'Maceió',
			'Manaus',
			'Parintins',
			'Macapá',
			'Feira de Santana',
			'Ilhéus',
			'Salvador',
			'Fortaleza',
			'Juazeiro do Norte',
			'Sobral',
			'Brasília',
			'Vila Velha',
			'Vitória',
			'Anápolis',
			'Goiânia',
			'Imperatriz',
			'São Luís',
			'Belo Horizonte',
			'Contagem',
			'Juiz de Fora',
			'Uberlândia',
			'Campo Grande',
			'Dourados',
			'Cuiabá',
			'Rondonópolis',
			'Belém',
			'Marabá',
			'Santarém',
			'Campina Grande',
			'João Pessoa',
			'Caruaru',
			'Olinda',
			'Recife',
			'Parnaíba',
			'Teresina',
			'Curitiba',
			'Londrina',
			'Maringá',
			'Angra dos Reis',
			'Niterói',
			'Rio de Janeiro',
			'Mossoró',
			'Natal',
			'Porto Velho',
			'Boa Vista',
			'Caxias do Sul',
			'Pelotas',
			'Porto Alegre',
			'Blumenau',
			'Florianópolis',
			'Joinville',
			'Aracaju',
			'Campinas',
			'Santos',
			'São Paulo',
			'Palmas',
		],
	})
	@ApiQuery({
		name: 'source',
		required: false,
		description: 'Instituições, organizações ou fontes de pesquisa para o qual os dados devem ser retornados. Opções: OCDE (Organização para a Cooperação e Desenvolvimento Econômico), IAC (Instituto Agronômico de Campinas), UNB (Universidade de Brasília), etc.',
		example: 'IAC',
		enum: ['OCDE', 'IAC', 'UNB'],
	})
	@ApiResponse({ status: 200, description: 'Lista de percentuais anuais.', type: [IStackedData] })
	@Get('/percentage-annual')
	async findAnnualPercentage(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findPercentageAnnual(analysis, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Busca percentuais bianuais dos Charts pelo analysis e intervalo de datas.',
		description: 'Este endpoint busca percentuais bianuais na tabela TB_Chart com base nas datas fornecidas.',
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
	@ApiResponse({ status: 200, description: 'Lista de percentuais bianuais.', type: [IStackedData] })
	@Get('/percentage-biennial')
	async findBiennialPercentage(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findPercentageBiennial(analysis, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Busca percentuais trianuais dos Charts pelo analysis e intervalo de datas.',
		description: 'Este endpoint busca percentuais trianuais na tabela TB_Chart com base nas datas fornecidas.',
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
	@ApiResponse({ status: 200, description: 'Lista de percentuais trianuais.', type: [IStackedData] })
	@Get('/percentage-triennial')
	async findTriennialPercentage(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findPercentageTriennial(analysis, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Busca percentuais quadrianuais dos Charts pelo analysis e intervalo de datas.',
		description: 'Este endpoint busca percentuais quadrianuais na tabela TB_Chart com base nas datas fornecidas.',
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
	@ApiResponse({ status: 200, description: 'Lista de percentuais quadrianuais.', type: [IStackedData] })
	@Get('/percentage-quadrennial')
	async findQuadrennialPercentage(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findPercentageQuadrennial(analysis, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Busca percentuais pentanuais dos Charts pelo analysis e intervalo de datas.',
		description: 'Este endpoint busca percentuais pentanuais na tabela TB_Chart com base nas datas fornecidas.',
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
	@ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
	@ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
	@ApiResponse({ status: 200, description: 'Lista de percentuais pentanuais.', type: [IStackedData] })
	@Get('/percentage-quintennial')
	async findQuintennialPercentage(
		@Query('analysis') analysis: string,
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
		return await this.chartService.findPercentageQuintennial(analysis, startDate, endDate, country, state, city, source);
	}
}
