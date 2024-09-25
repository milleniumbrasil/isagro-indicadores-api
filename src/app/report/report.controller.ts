import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException, InternalServerErrorException, UseGuards } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { ReportService } from './report.service';
  import { ReportQueryDTO, ReportPersistDTO } from './report.dto';
  import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
  
  @ApiTags('report')
  @Controller('report')
  export class ReportController {
    constructor(private readonly reportService: ReportService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
      summary: "Criação de um novo Report.",
      description: "Este endpoint cria um novo Report no sistema com as informações fornecidas.",
    })
    @ApiResponse({
      status: 201,
      description: 'O Report foi criado com sucesso.',
      type: ReportQueryDTO,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 409, description: 'Report já existe' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async create(@Body() dto: ReportPersistDTO): Promise<ReportQueryDTO> {
      try {
        return await this.reportService.create(dto);
      } catch (error) {
        if (error.code === '23505') {
          throw new BadRequestException('Report já existe');
        }
        throw new InternalServerErrorException('Erro ao criar Report');
      }
    }
  
    @Get(':external_id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
      summary: "Busca um Report pelo External ID.",
      description: "Este endpoint busca um Report no sistema pelo External ID fornecido.",
    })
    @ApiResponse({
      status: 200,
      description: 'O Report foi encontrado.',
      type: ReportQueryDTO,
    })
    @ApiResponse({ status: 404, description: 'Report não encontrado' })
    async findByExternalId(@Param('external_id') external_id: string): Promise<ReportQueryDTO> {
      try {
        return await this.reportService.findByExternalId(external_id);
      } catch (error) {
        throw new NotFoundException('Report não encontrado');
      }
    }
  
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
      summary: "Busca todos os Reports.",
      description: "Este endpoint busca todos os Reports cadastrados no sistema.",
    })
    @ApiResponse({
      status: 200,
      description: 'Lista de Reports.',
      type: [ReportQueryDTO],
    })
    async findAll(): Promise<ReportQueryDTO[]> {
      return await this.reportService.findAll();
    }
  
    @Put(':external_id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
      summary: "Atualiza um Report pelo External ID.",
      description: "Este endpoint atualiza os detalhes de um Report no sistema pelo External ID fornecido.",
    })
    @ApiResponse({
      status: 200,
      description: 'O Report foi atualizado com sucesso.',
      type: ReportQueryDTO,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Report não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async updateByExternalId(@Param('external_id') external_id: string, @Body() dto: ReportPersistDTO): Promise<ReportQueryDTO> {
      try {
        return await this.reportService.updateByExternalId(external_id, dto);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException('Report não encontrado');
        }
        throw new InternalServerErrorException('Erro ao atualizar Report');
      }
    }
  
    @Delete(':external_id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
      summary: "Deleta um Report pelo External ID.",
      description: "Este endpoint deleta um Report no sistema pelo External ID fornecido.",
    })
    @ApiResponse({
      status: 204,
      description: 'O Report foi deletado com sucesso.',
    })
    @ApiResponse({ status: 404, description: 'Report não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async deleteByExternalId(@Param('external_id') external_id: string): Promise<void> {
      try {
        await this.reportService.deleteByExternalId(external_id);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException('Report não encontrado');
        }
        throw new InternalServerErrorException('Erro ao deletar Report');
      }
    }
  }
  