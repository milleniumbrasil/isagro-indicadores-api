
import { Controller, Get, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ChartService } from './chart.service';
import { IStackedData } from './IStackedData';

@ApiTags('chart')
@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) { }
  @ApiOperation({
    summary: 'Busca Charts pelo analysis e intervalo de datas.',
    description: 'Este endpoint busca Charts agrupados na tabela TB_Chart com base nas datas fornecidas.',
  })
  @ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
  @ApiResponse({ status: 200, description: 'Lista de Charts encontrados.', type: [IStackedData] })
  @Get('/stacked-charts')
  async findStackedCharts(
    @Query('analysis') analysis: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('country') country?: string,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('source') source?: string,
  ): Promise<IStackedData[]> {
    if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
    return await this.chartService.findStackedByDates(analysis, startDate, endDate, country, state, city, source);
  }

  @ApiOperation({
    summary: "Busca percentuais anuais dos Charts pelo analysis e intervalo de datas.",
    description: "Este endpoint busca percentuais anuais na tabela TB_Chart com base nas datas fornecidas.",
  })
  @ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
  @ApiResponse({ status: 200, description: 'Lista de percentuais anuais.', type: [IStackedData] })
  @Get('/stacked-annual')
  async findAnnualStacked(
    @Query('analysis') analysis: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('country') country?: string,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('source') source?: string,
  ): Promise<IStackedData[]> {
    if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
    return await this.chartService.findStackedByDates(analysis, startDate, endDate, country, state, city, source, 'annual');
  }

  @ApiOperation({
    summary: 'Busca percentuais bianuais dos Charts pelo analysis e intervalo de datas.',
    description: 'Este endpoint busca percentuais bianuais na tabela TB_Chart com base nas datas fornecidas.',
  })
  @ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
  @ApiResponse({ status: 200, description: 'Lista de percentuais bianuais.', type: [IStackedData] })
  @Get('/stacked-biennial')
  async findBiennialStacked(
    @Query('analysis') analysis: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('country') country?: string,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('source') source?: string,
  ): Promise<IStackedData[]> {
    if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
    return await this.chartService.findStackedByDates(analysis, startDate, endDate, country, state, city, source, 'biennial');
  }

  @ApiOperation({
    summary: 'Busca percentuais trianuais dos Charts pelo analysis e intervalo de datas.',
    description: 'Este endpoint busca percentuais trianuais na tabela TB_Chart com base nas datas fornecidas.',
  })
  @ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
  @ApiResponse({ status: 200, description: 'Lista de percentuais trianuais.', type: [IStackedData] })
  @Get('/stacked-triennial')
  async findTriennialStacked(
    @Query('analysis') analysis: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('country') country?: string,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('source') source?: string,
  ): Promise<IStackedData[]> {
    if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
    return await this.chartService.findStackedByDates(analysis, startDate, endDate, country, state, city, source, 'triennial');
  }

  @ApiOperation({
    summary: 'Busca percentuais quadrianuais dos Charts pelo analysis e intervalo de datas.',
    description: 'Este endpoint busca percentuais quadrianuais na tabela TB_Chart com base nas datas fornecidas.',
  })
  @ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
  @ApiResponse({ status: 200, description: 'Lista de percentuais quadrianuais.', type: [IStackedData] })
  @Get('/stacked-quadrennial')
  async findQuadrennialStacked(
    @Query('analysis') analysis: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('country') country?: string,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('source') source?: string,
  ): Promise<IStackedData[]> {
    if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
    return await this.chartService.findStackedByDates(analysis, startDate, endDate, country, state, city, source, 'quadrennial');
  }

  @ApiOperation({
    summary: 'Busca percentuais pentanuais dos Charts pelo analysis e intervalo de datas.',
    description: 'Este endpoint busca percentuais pentanuais na tabela TB_Chart com base nas datas fornecidas.',
  })
  @ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
  @ApiResponse({ status: 200, description: 'Lista de percentuais pentanuais.', type: [IStackedData] })
  @Get('/stacked-quintennial')
  async findQuintennialStacked(
    @Query('analysis') analysis: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('country') country?: string,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('source') source?: string,
  ): Promise<IStackedData[]> {
    if (!analysis || !startDate || !endDate) throw new BadRequestException('Parâmetros obrigatórios: analysis, startDate e endDate');
    return await this.chartService.findStackedByDates(analysis, startDate, endDate, country, state, city, source, 'quintennial');
  }

  @ApiOperation({
    summary: 'Busca percentuais anuais dos Charts pelo analysis e intervalo de datas.',
    description: 'Este endpoint busca percentuais anuais na tabela TB_Chart com base nas datas fornecidas.',
  })
  @ApiQuery({ name: 'analysis', required: true, description: 'Tipo de análise. Exemplo: erosão, GEE, NH3.' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Data inicial no formato YYYY-MM-DD.' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Data final no formato YYYY-MM-DD.' })
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
    return await this.chartService.findPercentageByDates(analysis, startDate, endDate, country, state, city, source, 'annual');
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
    return await this.chartService.findPercentageByDates(analysis, startDate, endDate, country, state, city, source, 'biennial');
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
    return await this.chartService.findPercentageByDates(analysis, startDate, endDate, country, state, city, source, 'triennial');
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
    return await this.chartService.findPercentageByDates(analysis, startDate, endDate, country, state, city, source, 'quadrennial');
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
    return await this.chartService.findPercentageByDates(analysis, startDate, endDate, country, state, city, source, 'quintennial');
  }
}
