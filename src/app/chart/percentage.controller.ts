
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChartService } from './chart.service';
import { IStackedData } from './IStackedData';

@ApiTags('Percentuais Relativos')
@Controller('percentage')
export class PercentageController {

	constructor(private readonly chartService: ChartService) { }

	@ApiOperation({
		summary: `Percentual de valores anuais`,
		description: `
		Calcula o percentual de valores totais de um ano específico em relação ao valor acumulado de todos os anos no intervalo definido.

		Este endpoint retorna a soma dos valores de cada ano e o percentual que eles representam em relação ao total acumulado de todos os anos no intervalo. Este cálculo é útil para entender a contribuição de cada ano no contexto de um período maior.
		`
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.', example: 'orgânicas', enum: ['erosão', 'GEE', 'NH3', 'NPK', 'orgânicas', 'pesticidas', 'poluição'] })
	@ApiQuery({ name: 'label', required: false, description: 'Rótulo para a análise. Exemplo: Para a análise de orgânicas, os rótulos seriam grão, hortaliças, fruticultura, pastagem.', example: 'pastagem', enum: ['pastagem', 'cultura', 'tecnologia1', 'tecnologia2', 'tecnologia3', 'tecnologia4', 'fertilizantes químicos', 'fertilizantes orgânicos', 'manejo de esterco', 'deposição de extretas', 'queimas de resíduos de culturas', 'dejetos animais', 'deposição atmosférica', 'fertilizantes minerais', 'fixação biológica de nitrogênio', 'resíduos culturais', 'resíduos industriais', 'resíduos urbanos', 'produção carne bovina', 'produção agrícola', 'área agropecuária', 'grão', 'hortaliças', 'fruticultura', 'herbicidas', 'fungicidas', 'inseticitas', 'outros', 'nitrato', 'fosfato', 'cations', 'anions'] })
	@ApiQuery({ name: 'startDate', required: false, description: 'Data inicial no formato YYYY-MM-DD.', example: '1990-01-01' })
	@ApiQuery({ name: 'endDate', required: false, description: 'Data final no formato YYYY-MM-DD.', example: '1995-12-31' })
	@ApiQuery({ name: 'country', required: false, description: 'O país para o qual os dados devem ser retornados. Opções: BR, US, FR, etc.', example: 'BR', enum: ['BR', 'US', 'FR'] })
	@ApiQuery({ name: 'state', required: false, description: 'O estado para o qual os dados devem ser retornados. Opções: SP, RJ, MG, etc.', example: 'SP', enum: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'] })
	@ApiQuery({ name: 'city', required: false, description: 'O label para o qual os dados devem ser retornados. Opções: São Paulo, Maceió, Manaus, etc.', example: 'São Paulo', enum: [	"Angra dos Reis", "Anápolis", "Aracaju", "Arapiraca", "Belo Horizonte", "Belém", "Blumenau", "Boa Vista", "Brasília", "Campina Grande", "Campinas", "Campo Grande", "Caruaru", "Caxias do Sul", "Contagem", "Cuiabá", "Curitiba", "Dourados", "Feira de Santana", "Florianópolis", "Fortaleza", "Goiânia", "Ilhéus", "Imperatriz", "Joinville", "João Pessoa", "Juazeiro do Norte", "Juiz de Fora", "Londrina", "Macapá", "Maceió", "Manaus", "Marabá", "Maringá", "Mossoró", "Natal", "Niterói", "Olinda", "Palmas", "Parintins", "Parnaíba", "Pelotas", "Porto Alegre", "Porto Velho", "Recife", "Rio Branco", "Rio de Janeiro", "Rondonópolis", "Salvador", "Santarém", "Santos", "Sobral", "São Luís", "São Paulo", "Teresina", "Uberlândia", "Vila Velha", "Vitória" ], })
	@ApiQuery({ name: 'source', required: false, description: 'Instituições, organizações ou fontes de pesquisa para o qual os dados devem ser retornados. Opções: OCDE (Organização para a Cooperação e Desenvolvimento Econômico), IAC (Instituto Agronômico de Campinas), UNB (Universidade de Brasília), etc.', example: 'IAC', enum: ['OCDE', 'IAC', 'UNB'],})
	@ApiResponse({ status: 200, description: 'Lista de percentuais anuais.', type: [IStackedData] })
	@Get('/annual')
	async findAnnualPercentage(
		@Query('analysis') analysis: string,
		@Query('label') label?: string,
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis) throw new BadRequestException('Parâmetros obrigatórios: analysis');
		return await this.chartService.findPercentageAnnual(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: `Percentual de valores bienais`,
		description: `
		Calcula o percentual de valores acumulados em períodos bienais em relação ao valor acumulado de todos os anos no intervalo definido.

		Este endpoint retorna a soma dos valores para períodos de dois anos e o percentual que eles representam em relação ao total acumulado. Isso oferece uma perspectiva bienal da contribuição de cada par de anos no contexto de um período maior.
		`
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.', example: 'orgânicas', enum: ['erosão', 'GEE', 'NH3', 'NPK', 'orgânicas', 'pesticidas', 'poluição'] })
	@ApiQuery({ name: 'label', required: false, description: 'Rótulo para a análise. Exemplo: Para a análise de orgânicas, os rótulos seriam grão, hortaliças, fruticultura, pastagem.', example: 'pastagem', enum: ['pastagem', 'cultura', 'tecnologia1', 'tecnologia2', 'tecnologia3', 'tecnologia4', 'fertilizantes químicos', 'fertilizantes orgânicos', 'manejo de esterco', 'deposição de extretas', 'queimas de resíduos de culturas', 'dejetos animais', 'deposição atmosférica', 'fertilizantes minerais', 'fixação biológica de nitrogênio', 'resíduos culturais', 'resíduos industriais', 'resíduos urbanos', 'produção carne bovina', 'produção agrícola', 'área agropecuária', 'grão', 'hortaliças', 'fruticultura', 'herbicidas', 'fungicidas', 'inseticitas', 'outros', 'nitrato', 'fosfato', 'cations', 'anions'] })
	@ApiQuery({ name: 'startDate', required: false, description: 'Data inicial no formato YYYY-MM-DD.', example: '1990-01-01' })
	@ApiQuery({ name: 'endDate', required: false, description: 'Data final no formato YYYY-MM-DD.', example: '1995-12-31' })
	@ApiQuery({ name: 'country', required: false, description: 'O país para o qual os dados devem ser retornados. Opções: BR, US, FR, etc.', example: 'BR', enum: ['BR', 'US', 'FR'] })
	@ApiQuery({ name: 'state', required: false, description: 'O estado para o qual os dados devem ser retornados. Opções: SP, RJ, MG, etc.', example: 'SP', enum: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'] })
	@ApiQuery({ name: 'city', required: false, description: 'O label para o qual os dados devem ser retornados. Opções: São Paulo, Maceió, Manaus, etc.', example: 'São Paulo', enum: [	"Angra dos Reis", "Anápolis", "Aracaju", "Arapiraca", "Belo Horizonte", "Belém", "Blumenau", "Boa Vista", "Brasília", "Campina Grande", "Campinas", "Campo Grande", "Caruaru", "Caxias do Sul", "Contagem", "Cuiabá", "Curitiba", "Dourados", "Feira de Santana", "Florianópolis", "Fortaleza", "Goiânia", "Ilhéus", "Imperatriz", "Joinville", "João Pessoa", "Juazeiro do Norte", "Juiz de Fora", "Londrina", "Macapá", "Maceió", "Manaus", "Marabá", "Maringá", "Mossoró", "Natal", "Niterói", "Olinda", "Palmas", "Parintins", "Parnaíba", "Pelotas", "Porto Alegre", "Porto Velho", "Recife", "Rio Branco", "Rio de Janeiro", "Rondonópolis", "Salvador", "Santarém", "Santos", "Sobral", "São Luís", "São Paulo", "Teresina", "Uberlândia", "Vila Velha", "Vitória" ], })
	@ApiQuery({ name: 'source', required: false, description: 'Instituições, organizações ou fontes de pesquisa para o qual os dados devem ser retornados. Opções: OCDE (Organização para a Cooperação e Desenvolvimento Econômico), IAC (Instituto Agronômico de Campinas), UNB (Universidade de Brasília), etc.', example: 'IAC', enum: ['OCDE', 'IAC', 'UNB'],})
	@ApiResponse({ status: 200, description: 'Lista de percentuais bianuais.', type: [IStackedData] })
	@Get('/biennial')
	async findBiennialPercentage(
		@Query('analysis') analysis: string,
		@Query('label') label?: string,
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis) throw new BadRequestException('Parâmetros obrigatórios: analysis!');
		return await this.chartService.findPercentageBiennial(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: `Percentual de valores trienais`,
		description: `
		Calcula o percentual de valores acumulados em períodos trienais em relação ao valor acumulado de todos os anos no intervalo definido.

		Este endpoint retorna a soma dos valores para períodos de três anos e o percentual que eles representam em relação ao total acumulado. Isso oferece uma perspectiva trienal da contribuição de cada grupo de três anos no contexto de um período maior.
		`
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.', example: 'orgânicas', enum: ['erosão', 'GEE', 'NH3', 'NPK', 'orgânicas', 'pesticidas', 'poluição'] })
	@ApiQuery({ name: 'label', required: false, description: 'Rótulo para a análise. Exemplo: Para a análise de orgânicas, os rótulos seriam grão, hortaliças, fruticultura, pastagem.', example: 'pastagem', enum: ['pastagem', 'cultura', 'tecnologia1', 'tecnologia2', 'tecnologia3', 'tecnologia4', 'fertilizantes químicos', 'fertilizantes orgânicos', 'manejo de esterco', 'deposição de extretas', 'queimas de resíduos de culturas', 'dejetos animais', 'deposição atmosférica', 'fertilizantes minerais', 'fixação biológica de nitrogênio', 'resíduos culturais', 'resíduos industriais', 'resíduos urbanos', 'produção carne bovina', 'produção agrícola', 'área agropecuária', 'grão', 'hortaliças', 'fruticultura', 'herbicidas', 'fungicidas', 'inseticitas', 'outros', 'nitrato', 'fosfato', 'cations', 'anions'] })
	@ApiQuery({ name: 'startDate', required: false, description: 'Data inicial no formato YYYY-MM-DD.', example: '1990-01-01' })
	@ApiQuery({ name: 'endDate', required: false, description: 'Data final no formato YYYY-MM-DD.', example: '1995-12-31' })
	@ApiQuery({ name: 'country', required: false, description: 'O país para o qual os dados devem ser retornados. Opções: BR, US, FR, etc.', example: 'BR', enum: ['BR', 'US', 'FR'] })
	@ApiQuery({ name: 'state', required: false, description: 'O estado para o qual os dados devem ser retornados. Opções: SP, RJ, MG, etc.', example: 'SP', enum: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'] })
	@ApiQuery({ name: 'city', required: false, description: 'O label para o qual os dados devem ser retornados. Opções: São Paulo, Maceió, Manaus, etc.', example: 'São Paulo', enum: [	"Angra dos Reis", "Anápolis", "Aracaju", "Arapiraca", "Belo Horizonte", "Belém", "Blumenau", "Boa Vista", "Brasília", "Campina Grande", "Campinas", "Campo Grande", "Caruaru", "Caxias do Sul", "Contagem", "Cuiabá", "Curitiba", "Dourados", "Feira de Santana", "Florianópolis", "Fortaleza", "Goiânia", "Ilhéus", "Imperatriz", "Joinville", "João Pessoa", "Juazeiro do Norte", "Juiz de Fora", "Londrina", "Macapá", "Maceió", "Manaus", "Marabá", "Maringá", "Mossoró", "Natal", "Niterói", "Olinda", "Palmas", "Parintins", "Parnaíba", "Pelotas", "Porto Alegre", "Porto Velho", "Recife", "Rio Branco", "Rio de Janeiro", "Rondonópolis", "Salvador", "Santarém", "Santos", "Sobral", "São Luís", "São Paulo", "Teresina", "Uberlândia", "Vila Velha", "Vitória" ], })
	@ApiQuery({ name: 'source', required: false, description: 'Instituições, organizações ou fontes de pesquisa para o qual os dados devem ser retornados. Opções: OCDE (Organização para a Cooperação e Desenvolvimento Econômico), IAC (Instituto Agronômico de Campinas), UNB (Universidade de Brasília), etc.', example: 'IAC', enum: ['OCDE', 'IAC', 'UNB'],})
	@ApiResponse({ status: 200, description: 'Lista de percentuais trianuais.', type: [IStackedData] })
	@Get('/triennial')
	async findTriennialPercentage(
		@Query('analysis') analysis: string,
		@Query('label') label?: string,
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis) throw new BadRequestException('Parâmetros obrigatórios: analysis!');
		return await this.chartService.findPercentageTriennial(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: `Percentual de valores quadrenais`,
		description: `
		Calcula o percentual de valores acumulados em períodos de quatro anos em relação ao valor acumulado de todos os anos no intervalo definido.

		Este endpoint retorna a soma dos valores para períodos de quatro anos e o percentual que eles representam em relação ao total acumulado. Isso oferece uma visão quadrenal da evolução dos dados no contexto de um período maior, permitindo identificar tendências ao longo desses períodos de análise.
		`
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.', example: 'orgânicas', enum: ['erosão', 'GEE', 'NH3', 'NPK', 'orgânicas', 'pesticidas', 'poluição'] })
	@ApiQuery({ name: 'label', required: false, description: 'Rótulo para a análise. Exemplo: Para a análise de orgânicas, os rótulos seriam grão, hortaliças, fruticultura, pastagem.', example: 'pastagem', enum: ['pastagem', 'cultura', 'tecnologia1', 'tecnologia2', 'tecnologia3', 'tecnologia4', 'fertilizantes químicos', 'fertilizantes orgânicos', 'manejo de esterco', 'deposição de extretas', 'queimas de resíduos de culturas', 'dejetos animais', 'deposição atmosférica', 'fertilizantes minerais', 'fixação biológica de nitrogênio', 'resíduos culturais', 'resíduos industriais', 'resíduos urbanos', 'produção carne bovina', 'produção agrícola', 'área agropecuária', 'grão', 'hortaliças', 'fruticultura', 'herbicidas', 'fungicidas', 'inseticitas', 'outros', 'nitrato', 'fosfato', 'cations', 'anions'] })
	@ApiQuery({ name: 'startDate', required: false, description: 'Data inicial no formato YYYY-MM-DD.', example: '1990-01-01' })
	@ApiQuery({ name: 'endDate', required: false, description: 'Data final no formato YYYY-MM-DD.', example: '1995-12-31' })
	@ApiQuery({ name: 'country', required: false, description: 'O país para o qual os dados devem ser retornados. Opções: BR, US, FR, etc.', example: 'BR', enum: ['BR', 'US', 'FR'] })
	@ApiQuery({ name: 'state', required: false, description: 'O estado para o qual os dados devem ser retornados. Opções: SP, RJ, MG, etc.', example: 'SP', enum: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'] })
	@ApiQuery({ name: 'city', required: false, description: 'O label para o qual os dados devem ser retornados. Opções: São Paulo, Maceió, Manaus, etc.', example: 'São Paulo', enum: [	"Angra dos Reis", "Anápolis", "Aracaju", "Arapiraca", "Belo Horizonte", "Belém", "Blumenau", "Boa Vista", "Brasília", "Campina Grande", "Campinas", "Campo Grande", "Caruaru", "Caxias do Sul", "Contagem", "Cuiabá", "Curitiba", "Dourados", "Feira de Santana", "Florianópolis", "Fortaleza", "Goiânia", "Ilhéus", "Imperatriz", "Joinville", "João Pessoa", "Juazeiro do Norte", "Juiz de Fora", "Londrina", "Macapá", "Maceió", "Manaus", "Marabá", "Maringá", "Mossoró", "Natal", "Niterói", "Olinda", "Palmas", "Parintins", "Parnaíba", "Pelotas", "Porto Alegre", "Porto Velho", "Recife", "Rio Branco", "Rio de Janeiro", "Rondonópolis", "Salvador", "Santarém", "Santos", "Sobral", "São Luís", "São Paulo", "Teresina", "Uberlândia", "Vila Velha", "Vitória" ], })
	@ApiQuery({ name: 'source', required: false, description: 'Instituições, organizações ou fontes de pesquisa para o qual os dados devem ser retornados. Opções: OCDE (Organização para a Cooperação e Desenvolvimento Econômico), IAC (Instituto Agronômico de Campinas), UNB (Universidade de Brasília), etc.', example: 'IAC', enum: ['OCDE', 'IAC', 'UNB'],})
	@ApiResponse({ status: 200, description: 'Lista de percentuais quadrianuais.', type: [IStackedData] })
	@Get('/quadrennial')
	async findQuadrennialPercentage(
		@Query('analysis') analysis: string,
		@Query('label') label?: string,
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis) throw new BadRequestException('Parâmetros obrigatórios: analysis!');
		return await this.chartService.findPercentageQuadrennial(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: `Percentual de valores quinquenais`,
		description: `
		Calcula o percentual de valores acumulados em períodos quinquenais em relação ao valor acumulado de todos os anos no intervalo definido.

		Este endpoint retorna a soma dos valores para períodos de cinco anos e o percentual que eles representam em relação ao total acumulado. Isso oferece uma visão quinquenal da evolução dos dados no contexto de um período maior.
		`
	})
	@ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.', example: 'orgânicas', enum: ['erosão', 'GEE', 'NH3', 'NPK', 'orgânicas', 'pesticidas', 'poluição'] })
	@ApiQuery({ name: 'label', required: false, description: 'Rótulo para a análise. Exemplo: Para a análise de orgânicas, os rótulos seriam grão, hortaliças, fruticultura, pastagem.', example: 'pastagem', enum: ['pastagem', 'cultura', 'tecnologia1', 'tecnologia2', 'tecnologia3', 'tecnologia4', 'fertilizantes químicos', 'fertilizantes orgânicos', 'manejo de esterco', 'deposição de extretas', 'queimas de resíduos de culturas', 'dejetos animais', 'deposição atmosférica', 'fertilizantes minerais', 'fixação biológica de nitrogênio', 'resíduos culturais', 'resíduos industriais', 'resíduos urbanos', 'produção carne bovina', 'produção agrícola', 'área agropecuária', 'grão', 'hortaliças', 'fruticultura', 'herbicidas', 'fungicidas', 'inseticitas', 'outros', 'nitrato', 'fosfato', 'cations', 'anions'] })
	@ApiQuery({ name: 'startDate', required: false, description: 'Data inicial no formato YYYY-MM-DD.', example: '1990-01-01' })
	@ApiQuery({ name: 'endDate', required: false, description: 'Data final no formato YYYY-MM-DD.', example: '1995-12-31' })
	@ApiQuery({ name: 'country', required: false, description: 'O país para o qual os dados devem ser retornados. Opções: BR, US, FR, etc.', example: 'BR', enum: ['BR', 'US', 'FR'] })
	@ApiQuery({ name: 'state', required: false, description: 'O estado para o qual os dados devem ser retornados. Opções: SP, RJ, MG, etc.', example: 'SP', enum: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'] })
	@ApiQuery({ name: 'city', required: false, description: 'O label para o qual os dados devem ser retornados. Opções: São Paulo, Maceió, Manaus, etc.', example: 'São Paulo', enum: [	"Angra dos Reis", "Anápolis", "Aracaju", "Arapiraca", "Belo Horizonte", "Belém", "Blumenau", "Boa Vista", "Brasília", "Campina Grande", "Campinas", "Campo Grande", "Caruaru", "Caxias do Sul", "Contagem", "Cuiabá", "Curitiba", "Dourados", "Feira de Santana", "Florianópolis", "Fortaleza", "Goiânia", "Ilhéus", "Imperatriz", "Joinville", "João Pessoa", "Juazeiro do Norte", "Juiz de Fora", "Londrina", "Macapá", "Maceió", "Manaus", "Marabá", "Maringá", "Mossoró", "Natal", "Niterói", "Olinda", "Palmas", "Parintins", "Parnaíba", "Pelotas", "Porto Alegre", "Porto Velho", "Recife", "Rio Branco", "Rio de Janeiro", "Rondonópolis", "Salvador", "Santarém", "Santos", "Sobral", "São Luís", "São Paulo", "Teresina", "Uberlândia", "Vila Velha", "Vitória" ], })
	@ApiQuery({ name: 'source', required: false, description: 'Instituições, organizações ou fontes de pesquisa para o qual os dados devem ser retornados. Opções: OCDE (Organização para a Cooperação e Desenvolvimento Econômico), IAC (Instituto Agronômico de Campinas), UNB (Universidade de Brasília), etc.', example: 'IAC', enum: ['OCDE', 'IAC', 'UNB'],})
	@ApiResponse({ status: 200, description: 'Lista de percentuais pentanuais.', type: [IStackedData] })
	@Get('/quintennial')
	async findQuintennialPercentage(
		@Query('analysis') analysis: string,
		@Query('label') label?: string,
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Query('country') country?: string,
		@Query('state') state?: string,
		@Query('city') city?: string,
		@Query('source') source?: string,
	): Promise<IStackedData[]> {
		if (!analysis) throw new BadRequestException('Parâmetros obrigatórios: analysis!');
		return await this.chartService.findPercentageQuintennial(analysis, label, startDate, endDate, country, state, city, source);
	}
}
