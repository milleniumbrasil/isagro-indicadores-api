import { Controller, Get, NotFoundException, BadRequestException, InternalServerErrorException, UseGuards, Query } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
  import { ChartService } from './chart.service';
import { IStackedData } from './IStackedData';

  @ApiTags('chart')
  @Controller('chart')
  export class ChartController {
    constructor(private readonly chartService: ChartService) {}

    @ApiOperation({
      summary: "Busca Charts pelo analysis, country, state e outros parâmetros opcionais.",
      description: "Este endpoint busca Charts na tabela TB_Chart com base nos parâmetros fornecidos. Parâmetros obrigatórios: analysis.",
    })
    @ApiParam({
      name: 'analysis',
      required: true,
      description: 'O tipo de análise que deve ser retornada. Exemplo: erosão, GEE, NH3, etc.',
      example: 'erosão',
      enum: ['erosão', 'GEE', 'NH3', 'NPK', 'orgânicas', 'pesticidas', 'poluição'],
    })
    @ApiParam({
      name: 'country',
      required: false,
      description: 'O país para o qual os dados devem ser retornados. Exemplo: BR para Brasil.',
      example: 'BR',
      enum: ['BR', 'US', 'FR'],
    })
    @ApiParam({
      name: 'state',
      required: false,
      description: 'O estado para o qual os dados devem ser retornados. Exemplo: SP para São Paulo.',
      example: 'SP',
      enum: ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"],
    })
    @ApiQuery({
      name: 'period',
      required: false,
      description: 'O período para o qual os dados devem ser retornados. Exemplo: 1990-1995.',
      example: '1990-1995',
      enum: ['1990-1995', '1992-1994', '1990-2010'],
    })
    @ApiQuery({
      name: 'source',
      required: false,
      description: 'A fonte da qual os dados foram extraídos. Exemplo: OCDE, IAC, UNB, etc.',
      example: 'OCDE',
    })
    @ApiQuery({
      name: 'city',
      required: false,
      description: 'A cidade para a qual os dados devem ser retornados.',
      example: 'Brasília',
    })
    @ApiQuery({
      name: 'label',
      required: false,
      description: 'O rótulo que descreve o item pesquisado, como "fertilizantes", "nitrato", etc.',
      example: 'nitrato',
      enum: ['nitrato', 'fosfato', 'cations', 'anions'],
    })
    @ApiResponse({
      status: 200,
      description: 'Lista de Charts encontrados com base nos parâmetros fornecidos.',
      type: [IStackedData],
    })
    @ApiResponse({ status: 404, description: 'Nenhum Chart encontrado com os parâmetros fornecidos.' })
    @Get('/charts')
    async findCharts(
      @Query('analysis') analysis: string,
      @Query('country') country?: string,
      @Query('state') state?: string,
      @Query('period') period?: string,
      @Query('source') source?: string,
      @Query('city') city?: string,
      @Query('label') label?: string,
    ): Promise<IStackedData[]> {
      try {
        return await this.chartService.findByParams(analysis, country, state, period, source, city, label);
      } catch (error) {
        throw new NotFoundException('Nenhum Chart encontrado');
      }
    }

  }