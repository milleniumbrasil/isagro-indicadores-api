
import { Controller, Get, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ChartService } from './chart.service';
import { IStackedData } from './IStackedData';

@ApiTags('Soma Agregada')
@Controller('sum')
export class SumController {

	constructor(private readonly chartService: ChartService) { }

	@ApiOperation({
		summary: `Soma valores agrupados para um período anual`,
		description: `
Calcula a soma com base em intervalos anuais.

A soma dos valores é uma técnica estatística utilizada para agregar informações em uma série temporal. Nesta consulta, os dados são filtrados com base em critérios como tipo de análise, rótulo, e período de tempo, agrupados por ano e rótulo. Isso oferece uma visão agregada dos dados ao longo do tempo, permitindo analisar a evolução dos valores totais dentro de cada ano.
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
		description: 'Retorna a soma total dos valores agrupados para o período de anos especificado, com base nos dados fornecidos.',
		type: [IStackedData]
	  })
	@Get('/annual')
	async findAnnualSum(
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
		return await this.chartService.findSumAnnual(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: `Soma valores agrupados para um período bienal`,
		description: `
Calcula a soma com base em intervalos bienais.

A soma dos valores é uma técnica estatística utilizada para agregar informações em uma série temporal. Nesta consulta, os dados são filtrados com base em critérios como tipo de análise, rótulo, e período de tempo, agrupados por ano e rótulo. Isso oferece uma visão agregada dos dados ao longo do tempo, permitindo analisar a evolução dos valores totais dentro de cada período de anos.
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
		description: 'Retorna a soma total dos valores agrupados para o período de anos especificado, com base nos dados fornecidos.',
		type: [IStackedData]
	  })
	@Get('/biennial')
	async findBiennialSum(
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
		return await this.chartService.findSumBiennial(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: `Soma valores agrupados para um período trienal`,
		description: `
Calcula a soma com base em intervalos trienais.

A soma dos valores é uma técnica estatística utilizada para agregar informações em uma série temporal. Nesta consulta, os dados são filtrados com base em critérios como tipo de análise, rótulo, e período de tempo, agrupados por ano e rótulo. Isso oferece uma visão agregada dos dados ao longo do tempo, permitindo analisar a evolução dos valores totais dentro de cada período de anos.
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
		description: 'Retorna a soma total dos valores agrupados para o período de anos especificado, com base nos dados fornecidos.',
		type: [IStackedData]
	  })
	@Get('/triennial')
	async findTriennialSum(
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
		return await this.chartService.findSumTriennial(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: `Soma valores agrupados para um período quadrenal`,
		description: `
Calcula a soma com base em intervalos quadrenais.

A soma dos valores é uma técnica estatística utilizada para agregar informações em uma série temporal. Nesta consulta, os dados são filtrados com base em critérios como tipo de análise, rótulo, e período de tempo, agrupados por ano e rótulo. Isso oferece uma visão agregada dos dados ao longo do tempo, permitindo analisar a evolução dos valores totais dentro de cada período de anos.
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
		description: 'Retorna a soma total dos valores agrupados para o período de anos especificado, com base nos dados fornecidos.',
		type: [IStackedData]
	  })
	@Get('/quadrennial')
	async findQuadrennialSum(
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
		return await this.chartService.findSumQuadrennial(analysis, label, startDate, endDate, country, state, city, source);
	}

	@ApiOperation({
		summary: `Soma valores agrupados para um período quinquenal`,
		description: `
Calcula a soma com base em intervalos quinquenais.

A soma dos valores é uma técnica estatística utilizada para agregar informações em uma série temporal. Nesta consulta, os dados são filtrados com base em critérios como tipo de análise, rótulo, e período de tempo, agrupados por ano e rótulo. Isso oferece uma visão agregada dos dados ao longo do tempo, permitindo analisar a evolução dos valores totais dentro de cada período de anos.
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
		description: 'Retorna a soma total dos valores agrupados para o período de anos especificado, com base nos dados fornecidos.',
		type: [IStackedData]
	  })
	@Get('/quintennial')
	async findQuintennialSum(
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
		return await this.chartService.findSumQuintennial(analysis, label, startDate, endDate, country, state, city, source);
	}
}
