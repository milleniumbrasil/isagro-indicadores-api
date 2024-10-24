-- public.tb_chart definition

-- Drop table

DROP TABLE public.tb_chart;

CREATE TABLE public.tb_chart (
	id serial4 NOT NULL,
	country varchar(2000) NOT NULL,
	state varchar(2) NOT NULL,
	city varchar(50) NOT NULL,
	"source" varchar(4000) NOT NULL,
	"period" date NOT NULL,
	"label" varchar(50) NOT NULL,
	value float8 NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	analysis varchar(4000) NOT NULL,
	"class" varchar(50) NULL,
    nutrient_flow varchar(7) NOT NULL CHECK (nutrient_flow IN ('entrada', 'saída')) DEFAULT 'entrada',
	CONSTRAINT tb_chart_pkey PRIMARY KEY (id)
);

-- Table comment

COMMENT ON TABLE public.tb_chart IS 'Armazena dados relacionados ao projeto IS-AGRO, voltado para a exibição de painéis de informações sobre meio ambiente e agronomia no Brasil. Contém registros sobre diferentes tipos de análises, como erosão, GEE, NH3, NPK, orgânicas, pesticidas e poluição, organizados por localização geográfica e período.';
COMMENT ON COLUMN public.tb_chart.country IS 'Código do país no formato ISO 3166-1 alfa-2. Exemplo: BR para Brasil.';
COMMENT ON COLUMN public.tb_chart.state IS 'Código do estado no formato ISO 3166-2. Exemplo: RJ para Rio de Janeiro.';
COMMENT ON COLUMN public.tb_chart.city IS 'Nome da cidade relacionada ao registro.';
COMMENT ON COLUMN public.tb_chart.source IS 'Fonte de pesquisa ou instituição que forneceu os dados. Pode incluir fontes como OCDE, IAC, UNB, entre outras.';
COMMENT ON COLUMN public.tb_chart.period IS 'Data referente ao período em que os dados foram registrados.';
COMMENT ON COLUMN public.tb_chart.label IS 'Rótulo que descreve o item pesquisado, como "fertilizantes", "cultura", etc.';
COMMENT ON COLUMN public.tb_chart.value IS 'Valor numérico associado ao rótulo, representando a quantidade ou medida específica.';
COMMENT ON COLUMN public.tb_chart.created_at IS 'Data de criação do registro.';
COMMENT ON COLUMN public.tb_chart.updated_at IS 'Data de atualização do registro.';
COMMENT ON COLUMN public.tb_chart.analysis IS 'Tipo de indicador referente ao registro, como erosão, GEE, NH3, NPK, orgânicas, pesticidas ou poluição.';
COMMENT ON COLUMN public.tb_chart.nutrient_flow IS 'Entrada Refere-se ao que é adicionado ao sistema agrícola. Isso pode incluir qualquer substância ou material que enriqueça o solo, as plantas ou o ambiente em torno da área cultivada. Saída: Refere-se ao que é removido do sistema agrícola. Isso pode incluir qualquer material que é retirado do solo, plantas ou do ambiente.';
