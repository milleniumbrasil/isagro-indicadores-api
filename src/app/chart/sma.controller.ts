
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChartService } from './chart.service';
import { IStackedData } from './IStackedData';

@ApiTags(`Cálculos de Média Móvel Simples (SMA)`)
@Controller('sma')
export class SMAController {

	constructor(private readonly chartService: ChartService) { }

	@ApiOperation({
		summary: `Média móvel simples para um período anual`,
		description: `
		Calcula a Média Móvel Simples (SMA) com base em intervalos anuais, suavizando flutuações e identificando tendências ao longo do tempo.

		A Média Móvel Simples (SMA) é uma técnica estatística utilizada para suavizar flutuações em uma série temporal. Ela calcula a média dos dados de um conjunto fixo de períodos consecutivos, proporcionando uma visão clara das tendências ao longo do tempo. Neste caso, o cálculo considera intervalos de análise, como bienal, trienal, quadrenal ou quinquenal, para oferecer uma perspectiva precisa da evolução dos dados ao longo desses períodos.
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
	@ApiResponse({
		status: 200,
		description: 'Retorna a média móvel simples (SMA) calculada para o período especificado, com base nos dados fornecidos. Cada item no array contém o período, rótulo e valor médio correspondente.',
		type: [IStackedData]
	  })
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
		return await this.chartService.findMobileAverageAnnual(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Média móvel simples para um período bienal',
		description: `
		Calcula a Média Móvel Simples (SMA) com base em intervalos bienais, suavizando flutuações e identificando tendências ao longo do tempo.

		A Média Móvel Simples (SMA) é uma técnica estatística utilizada para suavizar flutuações em uma série temporal. Ela calcula a média dos dados de um conjunto fixo de períodos consecutivos, proporcionando uma visão clara das tendências ao longo do tempo. Neste caso, o cálculo considera intervalos de análise, como bienal, trienal, quadrenal ou quinquenal, para oferecer uma perspectiva precisa da evolução dos dados ao longo desses períodos.
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
	@ApiResponse({
		status: 200,
		description: 'Retorna a média móvel simples (SMA) calculada para o período especificado, com base nos dados fornecidos. Cada item no array contém o período, rótulo e valor médio correspondente.',
		type: [IStackedData]
	  })
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
		return await this.chartService.findMobileAverageBiennial(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Média móvel simples para um período trienal',
		description: `
		Calcula a Média Móvel Simples (SMA) com base em intervalos trienais, suavizando flutuações e identificando tendências ao longo do tempo.

		A Média Móvel Simples (SMA) é uma técnica estatística utilizada para suavizar flutuações em uma série temporal. Ela calcula a média dos dados de um conjunto fixo de períodos consecutivos, proporcionando uma visão clara das tendências ao longo do tempo. Neste caso, o cálculo considera intervalos de análise, como bienal, trienal, quadrenal ou quinquenal, para oferecer uma perspectiva precisa da evolução dos dados ao longo desses períodos.
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
	@ApiResponse({
		status: 200,
		description: 'Retorna a média móvel simples (SMA) calculada para o período especificado, com base nos dados fornecidos. Cada item no array contém o período, rótulo e valor médio correspondente.',
		type: [IStackedData]
	  })
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
		return await this.chartService.findMobileAverageTriennial(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Média móvel simples para um período quadrenal',
		description: `
		Calcula a Média Móvel Simples (SMA) com base em intervalos quadrenais, suavizando flutuações e identificando tendências ao longo do tempo.

		A Média Móvel Simples (SMA) é uma técnica estatística utilizada para suavizar flutuações em uma série temporal. Ela calcula a média dos dados de um conjunto fixo de períodos consecutivos, proporcionando uma visão clara das tendências ao longo do tempo. Neste caso, o cálculo considera intervalos de análise, como bienal, trienal, quadrenal ou quinquenal, para oferecer uma perspectiva precisa da evolução dos dados ao longo desses períodos.
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
	@ApiResponse({
		status: 200,
		description: 'Retorna a média móvel simples (SMA) calculada para o período especificado, com base nos dados fornecidos. Cada item no array contém o período, rótulo e valor médio correspondente.',
		type: [IStackedData]
	  })
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
		return await this.chartService.findMobileAverageQuadrennial(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: 'Média móvel simples para um período quinquenal',
		description: `
		Calcula a Média Móvel Simples (SMA) com base em intervalos quinquenais, suavizando flutuações e identificando tendências ao longo do tempo.

		A Média Móvel Simples (SMA) é uma técnica estatística utilizada para suavizar flutuações em uma série temporal. Ela calcula a média dos dados de um conjunto fixo de períodos consecutivos, proporcionando uma visão clara das tendências ao longo do tempo. Neste caso, o cálculo considera intervalos de análise, como bienal, trienal, quadrenal ou quinquenal, para oferecer uma perspectiva precisa da evolução dos dados ao longo desses períodos.
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
	@ApiResponse({
		status: 200,
		description: 'Retorna a média móvel simples (SMA) calculada para o período especificado, com base nos dados fornecidos. Cada item no array contém o período, rótulo e valor médio correspondente.',
		type: [IStackedData]
	  })
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
		return await this.chartService.findMobileAverageQuintennial(analysis, label, startDate, endDate, country, state, city, source);
	}
}
