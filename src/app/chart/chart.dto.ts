import { IsString, IsNotEmpty, MaxLength, IsOptional, IsNumber, IsUUID, IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IChartQueryDTO, IChartPersistDTO } from "./chart.interface";

/**
 * Data Transfer Object for Chart.
 *
 * Utilizado para transferir dados entre a camada de persistência e a camada de controle,
 * ocultando chaves primárias e datas automáticas, enquanto expõe os external_id e outras
 * informações de negócio relevantes.
 */
export class ChartQueryDTO implements IChartQueryDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  @ApiProperty({
    example: "exemplo",
    description: "Código do país no formato ISO 3166-1 alfa-2. Exemplo: BR para Brasil.",
  })
  country: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  @ApiProperty({
    example: "exemplo",
    description: "Código do estado no formato ISO 3166-2. Exemplo: RJ para Rio de Janeiro.",
  })
  state: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    example: "exemplo",
    description: "Nome da cidade relacionada ao registro.",
  })
  city: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  @ApiProperty({
    example: "exemplo",
    description: "Fonte de pesquisa ou instituição que forneceu os dados. Pode incluir fontes como OCDE, IAC, UNB, entre outras.",
  })
  source: string;
  @IsNotEmpty()
  @ApiProperty({
    example: "exemplo",
    description: "Data referente ao período em que os dados foram registrados.",
  })
  period: any;
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    example: "exemplo",
    description: "Rótulo que descreve o item pesquisado, como fertilizantes, cultura, etc.",
  })
  label: string;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 12345,
    description: "Valor numérico associado ao rótulo, representando a quantidade ou medida específica.",
  })
  value: number;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b",
    description: "Identificador único externo de registros desta tabela. Este campo é obrigatório.",
  })
  external_id: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  @ApiProperty({
    example: "exemplo",
    description: "Tipo de análise referente ao registro, como erosão, GEE, NH3, NPK, orgânicas, pesticidas ou poluição.",
  })
  analysis: string;
}

export class ChartPersistDTO implements IChartPersistDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  @ApiProperty({
    example: "exemplo",
    description: "Código do país no formato ISO 3166-1 alfa-2. Exemplo: BR para Brasil.",
  })
  country: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  @ApiProperty({
    example: "exemplo",
    description: "Código do estado no formato ISO 3166-2. Exemplo: RJ para Rio de Janeiro.",
  })
  state: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    example: "exemplo",
    description: "Nome da cidade relacionada ao registro.",
  })
  city: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  @ApiProperty({
    example: "exemplo",
    description: "Fonte de pesquisa ou instituição que forneceu os dados. Pode incluir fontes como OCDE, IAC, UNB, entre outras.",
  })
  source: string;
  @IsNotEmpty()
  @ApiProperty({
    example: "exemplo",
    description: "Data referente ao período em que os dados foram registrados.",
  })
  period: any;
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    example: "exemplo",
    description: "Rótulo que descreve o item pesquisado, como fertilizantes, cultura, etc.",
  })
  label: string;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 12345,
    description: "Valor numérico associado ao rótulo, representando a quantidade ou medida específica.",
  })
  value: number;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b",
    description: "Identificador único externo de registros desta tabela. Este campo é obrigatório.",
  })
  external_id: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  @ApiProperty({
    example: "exemplo",
    description: "Tipo de análise referente ao registro, como erosão, GEE, NH3, NPK, orgânicas, pesticidas ou poluição.",
  })
  analysis: string;
}
