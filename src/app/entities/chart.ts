
  import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, JoinColumn } from 'typeorm';
import 'reflect-metadata';
import { ApiProperty } from '@nestjs/swagger';


  @Entity('tb_chart')
  export class ChartEntity {

	@PrimaryColumn({ type: 'int', default: "nextval('tb_chart_id_seq'::regclass)" })
	@ApiProperty({ description: "",  })
	id: number;

	@Column({ type: 'varchar', length: 2 })
	@ApiProperty({ description: "Código do país no formato ISO 3166-1 alfa-2. Exemplo: BR para Brasil.",  })
	country: string;

	@Column({ type: 'varchar', length: 2 })
	@ApiProperty({ description: "Código do estado no formato ISO 3166-2. Exemplo: RJ para Rio de Janeiro.",  })
	state: string;

	@Column({ type: 'varchar', length: 50 })
	@ApiProperty({ description: "Nome da cidade relacionada ao registro.",  })
	city: string;

	@Column({ type: 'varchar', length: 4000 })
	@ApiProperty({ description: "Fonte de pesquisa ou instituição que forneceu os dados. Pode incluir fontes como OCDE, IAC, UNB, entre outras.",  })
	source: string;

	@Column({ type: 'date',  })
	@ApiProperty({ description: "Data referente ao período em que os dados foram registrados.",  })
	period: any;

	@Column({ type: 'varchar', length: 50 })
	@ApiProperty({ description: "Rótulo que descreve o item pesquisado, como fertilizantes, cultura, etc.",  })
	label: string;

	@Column({ type: 'int',  })
	@ApiProperty({ description: "Valor numérico associado ao rótulo, representando a quantidade ou medida específica.",  })
	value: number;

	@CreateDateColumn()
	@ApiProperty({ description: "Data de criação do registro.",  })
	created_at: Date;

	@UpdateDateColumn()
	@ApiProperty({ description: "Data de atualização do registro.", nullable: true })
	updated_at: Date;

	@Column({ type: 'varchar', length: 4000 })
	@ApiProperty({ description: "Tipo de análise referente ao registro, como erosão, GEE, NH3, NPK, orgânicas, pesticidas ou poluição.",  })
	analysis: string;

	@Column({ type: 'varchar', length: 7, default: 'entrada' })
	@ApiProperty({ description: "Tipo de transação, pode ser 'entrada' ou 'saída'." })
	transaction_type: string;

}
