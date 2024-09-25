// src/app/chart/IStackedData.ts

import { ApiProperty } from "@nestjs/swagger";

export class IStackedData {
	@ApiProperty({
		description: "O período de tempo representado",
		example: "1990",
	})
	period: string;

	@ApiProperty({
		description: "Entrada contendo um rótulo e o valor associado",
		example: ["rótulo", 100],
	})
	entry: [label: string, value: number]
}
