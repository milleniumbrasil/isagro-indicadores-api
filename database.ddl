
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();

CREATE FUNCTION public.prevent_created_at_update() RETURNS trigger
        LANGUAGE plpgsql
        AS $$
    BEGIN
        IF OLD IS NOT NULL AND NEW.created_at <> OLD.created_at THEN
            RAISE EXCEPTION 'Não é possível atualizar o campo created_at após a criação do registro.';
        END IF;
        RETURN NEW;
    END;
    $$;

    CREATE FUNCTION public.prevent_deleted_at_update() RETURNS trigger
        LANGUAGE plpgsql
        AS $$
    BEGIN
        IF OLD IS NOT NULL AND OLD.created_at IS NOT null THEN
            RAISE EXCEPTION 'Não é possível atualizar o campo deleted_at.';
        END IF;
        RETURN NEW;
    END;
    $$;

    CREATE FUNCTION public.prevent_update() RETURNS trigger
        LANGUAGE plpgsql
        AS $$
    BEGIN
        RAISE EXCEPTION 'Não é possível atualizar o registro. Operação não permitida.';
        RETURN NEW;
    END;
    $$;


CREATE TABLE public.tb_report (
    id serial4 NOT NULL,
    country varchar(2) NOT NULL,
    state varchar(2) NOT NULL,
    city varchar(50) NOT NULL,
    "source" varchar(4000) NOT NULL,
    "period" date NOT NULL,
    "label" varchar(50) NOT NULL,
    value int4 NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, -- Data de criação do registro.
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL, -- Data de atualização do registro.
    external_id uuid DEFAULT uuid_generate_v4() NOT NULL, -- Identificador único externo de registros desta tabela. Este campo é obrigatório.
    analysis varchar(4000) NOT NULL,
    CONSTRAINT tb_report_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX tb_report_external_id_idx ON public.tb_report USING btree (external_id);

-- Table comment

COMMENT ON TABLE public.tb_report IS 'Armazena dados relacionados ao projeto IS-AGRO, voltado para a exibição de painéis de informações sobre meio ambiente e agronomia no Brasil. Contém registros sobre diferentes tipos de análises, como erosão, GEE, NH3, NPK, orgânicas, pesticidas e poluição, organizados por localização geográfica e período.';

-- Column comments

COMMENT ON COLUMN public.tb_report.created_at IS 'Data de criação do registro.';
COMMENT ON COLUMN public.tb_report.updated_at IS 'Data de atualização do registro.';
COMMENT ON COLUMN public.tb_report.external_id IS 'Identificador único externo de registros desta tabela. Este campo é obrigatório.';

-- Table Triggers

create trigger tb_report_fire_update_rules before
update
    on
    public.tb_report for each row execute function prevent_created_at_update();
create trigger tb_report_fire_update_deleted_at_rules before
update
    on
    public.tb_report for each row execute function prevent_deleted_at_update();

COMMENT ON COLUMN public.tb_report.country IS 'Código do país no formato ISO 3166-1 alfa-2. Exemplo: BR para Brasil.';
COMMENT ON COLUMN public.tb_report.state IS 'Código do estado no formato ISO 3166-2. Exemplo: RJ para Rio de Janeiro.';
COMMENT ON COLUMN public.tb_report.city IS 'Nome da cidade relacionada ao registro.';
COMMENT ON COLUMN public.tb_report.source IS 'Fonte de pesquisa ou instituição que forneceu os dados. Pode incluir fontes como OCDE, IAC, UNB, entre outras.';
COMMENT ON COLUMN public.tb_report.period IS 'Data referente ao período em que os dados foram registrados.';
COMMENT ON COLUMN public.tb_report.label IS 'Rótulo que descreve o item pesquisado, como "fertilizantes", "cultura", etc.';
COMMENT ON COLUMN public.tb_report.value IS 'Valor numérico associado ao rótulo, representando a quantidade ou medida específica.';
COMMENT ON COLUMN public.tb_report.created_at IS 'Data de criação do registro.';
COMMENT ON COLUMN public.tb_report.updated_at IS 'Data de atualização do registro.';
COMMENT ON COLUMN public.tb_report.external_id IS 'Identificador único externo de registros desta tabela. Este campo é obrigatório.';
COMMENT ON COLUMN public.tb_report.analysis IS 'Tipo de análise referente ao registro, como erosão, GEE, NH3, NPK, orgânicas, pesticidas ou poluição.';


-- Inserindo registros com a análise "erosão"
INSERT INTO tb_report (country, state, city, period, label, value, source, analysis)
VALUES
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'cultura', 100, 'OCDE', 'erosão'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'cultura', 150, 'IAC', 'erosão'),
('BR', 'DF', 'Brasília', '1990-01-01', 'pastagem', 50, 'UNB', 'erosão'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'pastagem', 10, 'Lombardi', 'erosão'),

('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'cultura', 110, 'OCDE', 'erosão'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'cultura', 160, 'IAC', 'erosão'),
('BR', 'DF', 'Brasília', '1990-01-01', 'pastagem', 60, 'UNB', 'erosão'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'pastagem', 20, 'Lombardi', 'erosão'),

('BR', 'RJ', 'Rio de Janeiro', '1991-01-01', 'cultura', 250, 'OCDE', 'erosão'),
('BR', 'SP', 'São Paulo', '1991-01-01', 'cultura', 350, 'IAC', 'erosão'),
('BR', 'DF', 'Brasília', '1991-01-01', 'pastagem', 200, 'UNB', 'erosão'),
('BR', 'PR', 'Curitiba', '1991-01-01', 'pastagem', 100, 'Lombardi', 'erosão'),

('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'cultura', 400, 'OCDE', 'erosão'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'cultura', 500, 'IAC', 'erosão'),
('BR', 'DF', 'Brasília', '1992-01-01', 'pastagem', 450, 'UNB', 'erosão'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'pastagem', 250, 'Lombardi', 'erosão'),

('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'cultura', 410, 'OCDE', 'erosão'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'cultura', 510, 'IAC', 'erosão'),
('BR', 'DF', 'Brasília', '1992-01-01', 'pastagem', 460, 'UNB', 'erosão'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'pastagem', 260, 'Lombardi', 'erosão'),

('BR', 'RJ', 'Rio de Janeiro', '1993-01-01', 'cultura', 800, 'OCDE', 'erosão'),
('BR', 'SP', 'São Paulo', '1993-01-01', 'cultura', 750, 'IAC', 'erosão'),
('BR', 'DF', 'Brasília', '1993-01-01', 'pastagem', 800, 'UNB', 'erosão'),
('BR', 'PR', 'Curitiba', '1993-01-01', 'pastagem', 450, 'Lombardi', 'erosão'),

('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'cultura', 900, 'OCDE', 'erosão'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'cultura', 900, 'IAC', 'erosão'),
('BR', 'DF', 'Brasília', '1994-01-01', 'pastagem', 1100, 'UNB', 'erosão'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'pastagem', 900, 'Lombardi', 'erosão'),

('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'cultura', 910, 'OCDE', 'erosão'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'cultura', 910, 'IAC', 'erosão'),
('BR', 'DF', 'Brasília', '1994-01-01', 'pastagem', 1110, 'UNB', 'erosão'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'pastagem', 910, 'Lombardi', 'erosão'),

('BR', 'RJ', 'Rio de Janeiro', '1995-01-01', 'cultura', 1200, 'OCDE', 'erosão'),
('BR', 'SP', 'São Paulo', '1995-01-01', 'cultura', 1300, 'IAC', 'erosão'),
('BR', 'DF', 'Brasília', '1995-01-01', 'pastagem', 1450, 'UNB', 'erosão'),
('BR', 'PR', 'Curitiba', '1995-01-01', 'pastagem', 9000, 'Lombardi', 'erosão');

-- Inserindo registros com a análise "GEE"
INSERT INTO tb_report (country, state, city, period, label, value, source, analysis)
VALUES
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'tecnologia1', 100, 'OCDE', 'GEE'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'tecnologia4', 150, 'IAC', 'GEE'),
('BR', 'DF', 'Brasília', '1990-01-01', 'tecnologia3', 50, 'UNB', 'GEE'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'tecnologia2', 10, 'Lombardi', 'GEE'),

('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'tecnologia1', 110, 'OCDE', 'GEE'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'tecnologia4', 160, 'IAC', 'GEE'),
('BR', 'DF', 'Brasília', '1990-01-01', 'tecnologia3', 60, 'UNB', 'GEE'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'tecnologia2', 20, 'Lombardi', 'GEE'),

('BR', 'RJ', 'Rio de Janeiro', '1991-01-01', 'tecnologia1', 250, 'OCDE', 'GEE'),
('BR', 'SP', 'São Paulo', '1991-01-01', 'tecnologia4', 350, 'IAC', 'GEE'),
('BR', 'DF', 'Brasília', '1991-01-01', 'tecnologia3', 200, 'UNB', 'GEE'),
('BR', 'PR', 'Curitiba', '1991-01-01', 'tecnologia2', 100, 'Lombardi', 'GEE'),

('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'tecnologia1', 400, 'OCDE', 'GEE'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'tecnologia4', 500, 'IAC', 'GEE'),
('BR', 'DF', 'Brasília', '1992-01-01', 'tecnologia3', 450, 'UNB', 'GEE'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'tecnologia2', 250, 'Lombardi', 'GEE'),

('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'tecnologia1', 410, 'OCDE', 'GEE'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'tecnologia4', 510, 'IAC', 'GEE'),
('BR', 'DF', 'Brasília', '1992-01-01', 'tecnologia3', 460, 'UNB', 'GEE'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'tecnologia2', 260, 'Lombardi', 'GEE'),

('BR', 'RJ', 'Rio de Janeiro', '1993-01-01', 'tecnologia1', 800, 'OCDE', 'GEE'),
('BR', 'SP', 'São Paulo', '1993-01-01', 'tecnologia4', 750, 'IAC', 'GEE'),
('BR', 'DF', 'Brasília', '1993-01-01', 'tecnologia3', 800, 'UNB', 'GEE'),
('BR', 'PR', 'Curitiba', '1993-01-01', 'tecnologia2', 450, 'Lombardi', 'GEE'),

('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'tecnologia1', 900, 'OCDE', 'GEE'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'tecnologia4', 900, 'IAC', 'GEE'),
('BR', 'DF', 'Brasília', '1994-01-01', 'tecnologia3', 1100, 'UNB', 'GEE'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'tecnologia2', 900, 'Lombardi', 'GEE'),

('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'tecnologia1', 910, 'OCDE', 'GEE'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'tecnologia4', 910, 'IAC', 'GEE'),
('BR', 'DF', 'Brasília', '1994-01-01', 'tecnologia3', 1110, 'UNB', 'GEE'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'tecnologia2', 910, 'Lombardi', 'GEE'),

('BR', 'RJ', 'Rio de Janeiro', '1995-01-01', 'tecnologia1', 1200, 'OCDE', 'GEE'),
('BR', 'SP', 'São Paulo', '1995-01-01', 'tecnologia4', 1300, 'IAC', 'GEE'),
('BR', 'DF', 'Brasília', '1995-01-01', 'tecnologia3', 1450, 'UNB', 'GEE'),
('BR', 'PR', 'Curitiba', '1995-01-01', 'tecnologia2', 9000, 'Lombardi', 'GEE');

-- Inserindo registros com a análise "NH3"
INSERT INTO tb_report (country, state, city, period, label, value, source, analysis)
VALUES
-- Dados de 1990
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'fertilizantes químicos', 100, 'OCDE', 'NH3'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'fertilizantes orgânicos', 150, 'IAC', 'NH3'),
('BR', 'DF', 'Brasília', '1990-01-01', 'manejo de esterco', 50, 'UNB', 'NH3'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'deposição de extretas', 10, 'Lombardi', 'NH3'),

-- Dados de 1991
('BR', 'RJ', 'Rio de Janeiro', '1991-01-01', 'fertilizantes químicos', 200, 'OCDE', 'NH3'),
('BR', 'SP', 'São Paulo', '1991-01-01', 'fertilizantes orgânicos', 250, 'IAC', 'NH3'),
('BR', 'DF', 'Brasília', '1991-01-01', 'manejo de esterco', 150, 'UNB', 'NH3'),
('BR', 'PR', 'Curitiba', '1991-01-01', 'deposição de extretas', 110, 'Lombardi', 'NH3'),

-- Dados de 1992
('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'fertilizantes químicos', 300, 'OCDE', 'NH3'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'fertilizantes orgânicos', 350, 'IAC', 'NH3'),
('BR', 'DF', 'Brasília', '1992-01-01', 'manejo de esterco', 250, 'UNB', 'NH3'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'deposição de extretas', 210, 'Lombardi', 'NH3'),

-- Dados de 1993
('BR', 'RJ', 'Rio de Janeiro', '1993-01-01', 'fertilizantes químicos', 400, 'OCDE', 'NH3'),
('BR', 'SP', 'São Paulo', '1993-01-01', 'fertilizantes orgânicos', 450, 'IAC', 'NH3'),
('BR', 'DF', 'Brasília', '1993-01-01', 'manejo de esterco', 350, 'UNB', 'NH3'),
('BR', 'PR', 'Curitiba', '1993-01-01', 'deposição de extretas', 310, 'Lombardi', 'NH3'),

-- Dados de 1994
('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'fertilizantes químicos', 900, 'OCDE', 'NH3'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'fertilizantes orgânicos', 900, 'IAC', 'NH3'),
('BR', 'DF', 'Brasília', '1994-01-01', 'manejo de esterco', 1100, 'UNB', 'NH3'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'deposição de extretas', 900, 'Lombardi', 'NH3'),

-- Dados de 1995
('BR', 'RJ', 'Rio de Janeiro', '1995-01-01', 'fertilizantes químicos', 1200, 'OCDE', 'NH3'),
('BR', 'SP', 'São Paulo', '1995-01-01', 'fertilizantes orgânicos', 1300, 'IAC', 'NH3'),
('BR', 'DF', 'Brasília', '1995-01-01', 'manejo de esterco', 1450, 'UNB', 'NH3'),
('BR', 'PR', 'Curitiba', '1995-01-01', 'deposição de extretas', 9000, 'Lombardi', 'NH3');

-- Inserindo registros com a análise "NPK"
INSERT INTO tb_report (country, state, city, period, label, value, source, analysis)
VALUES
-- Dados de 1990
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'dejetos animais', 100, 'OCDE', 'NPK'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'deposição atmosférica', 150, 'IAC', 'NPK'),
('BR', 'DF', 'Brasília', '1990-01-01', 'fertilizantes minerais', 50, 'UNB', 'NPK'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'fertilizantes orgânicos', 10, 'Lombardi', 'NPK'),
('BR', 'SC', 'Florianópolis', '1990-01-01', 'fixação biológica de nitrogênio', 60, 'OCDE', 'NPK'),
('BR', 'MG', 'Belo Horizonte', '1990-01-01', 'resíduos culturais', 70, 'OCDE', 'NPK'),
('BR', 'BA', 'Salvador', '1990-01-01', 'resíduos industriais', 80, 'OCDE', 'NPK'),
('BR', 'RS', 'Porto Alegre', '1990-01-01', 'resíduos urbanos', 90, 'OCDE', 'NPK'),
('BR', 'MT', 'Cuiabá', '1990-01-01', 'produção carne bovina', 95, 'OCDE', 'NPK'),
('BR', 'MS', 'Campo Grande', '1990-01-01', 'produção agrícola', 100, 'OCDE', 'NPK'),
('BR', 'GO', 'Goiânia', '1990-01-01', 'área agropecuária', 105, 'OCDE', 'NPK'),

-- Dados de 1991
('BR', 'RJ', 'Rio de Janeiro', '1991-01-01', 'dejetos animais', 200, 'OCDE', 'NPK'),
('BR', 'SP', 'São Paulo', '1991-01-01', 'deposição atmosférica', 250, 'IAC', 'NPK'),
('BR', 'DF', 'Brasília', '1991-01-01', 'fertilizantes minerais', 150, 'UNB', 'NPK'),
('BR', 'PR', 'Curitiba', '1991-01-01', 'fertilizantes orgânicos', 110, 'Lombardi', 'NPK'),
('BR', 'SC', 'Florianópolis', '1991-01-01', 'fixação biológica de nitrogênio', 160, 'OCDE', 'NPK'),
('BR', 'MG', 'Belo Horizonte', '1991-01-01', 'resíduos culturais', 170, 'OCDE', 'NPK'),
('BR', 'BA', 'Salvador', '1991-01-01', 'resíduos industriais', 180, 'OCDE', 'NPK'),
('BR', 'RS', 'Porto Alegre', '1991-01-01', 'resíduos urbanos', 190, 'OCDE', 'NPK'),
('BR', 'MT', 'Cuiabá', '1991-01-01', 'produção carne bovina', 195, 'OCDE', 'NPK'),
('BR', 'MS', 'Campo Grande', '1991-01-01', 'produção agrícola', 200, 'OCDE', 'NPK'),
('BR', 'GO', 'Goiânia', '1991-01-01', 'área agropecuária', 205, 'OCDE', 'NPK'),

-- Dados de 1992
('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'dejetos animais', 300, 'OCDE', 'NPK'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'deposição atmosférica', 350, 'IAC', 'NPK'),
('BR', 'DF', 'Brasília', '1992-01-01', 'fertilizantes minerais', 250, 'UNB', 'NPK'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'fertilizantes orgânicos', 210, 'Lombardi', 'NPK'),
('BR', 'SC', 'Florianópolis', '1992-01-01', 'fixação biológica de nitrogênio', 260, 'OCDE', 'NPK'),
('BR', 'MG', 'Belo Horizonte', '1992-01-01', 'resíduos culturais', 270, 'OCDE', 'NPK'),
('BR', 'BA', 'Salvador', '1992-01-01', 'resíduos industriais', 280, 'OCDE', 'NPK'),
('BR', 'RS', 'Porto Alegre', '1992-01-01', 'resíduos urbanos', 290, 'OCDE', 'NPK'),
('BR', 'MT', 'Cuiabá', '1992-01-01', 'produção carne bovina', 295, 'OCDE', 'NPK'),
('BR', 'MS', 'Campo Grande', '1992-01-01', 'produção agrícola', 300, 'OCDE', 'NPK'),
('BR', 'GO', 'Goiânia', '1992-01-01', 'área agropecuária', 305, 'OCDE', 'NPK'),

-- Dados de 1993
('BR', 'RJ', 'Rio de Janeiro', '1993-01-01', 'dejetos animais', 400, 'OCDE', 'NPK'),
('BR', 'SP', 'São Paulo', '1993-01-01', 'deposição atmosférica', 450, 'IAC', 'NPK'),
('BR', 'DF', 'Brasília', '1993-01-01', 'fertilizantes minerais', 350, 'UNB', 'NPK'),
('BR', 'PR', 'Curitiba', '1993-01-01', 'fertilizantes orgânicos', 310, 'Lombardi', 'NPK'),
('BR', 'SC', 'Florianópolis', '1993-01-01', 'fixação biológica de nitrogênio', 360, 'OCDE', 'NPK'),
('BR', 'MG', 'Belo Horizonte', '1993-01-01', 'resíduos culturais', 370, 'OCDE', 'NPK'),
('BR', 'BA', 'Salvador', '1993-01-01', 'resíduos industriais', 380, 'OCDE', 'NPK'),
('BR', 'RS', 'Porto Alegre', '1993-01-01', 'resíduos urbanos', 390, 'OCDE', 'NPK'),
('BR', 'MT', 'Cuiabá', '1993-01-01', 'produção carne bovina', 395, 'OCDE', 'NPK'),
('BR', 'MS', 'Campo Grande', '1993-01-01', 'produção agrícola', 400, 'OCDE', 'NPK'),
('BR', 'GO', 'Goiânia', '1993-01-01', 'área agropecuária', 405, 'OCDE', 'NPK'),

-- Dados de 1994
('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'dejetos animais', 900, 'OCDE', 'NPK'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'deposição atmosférica', 900, 'IAC', 'NPK'),
('BR', 'DF', 'Brasília', '1994-01-01', 'fertilizantes minerais', 1100, 'UNB', 'NPK'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'fertilizantes orgânicos', 900, 'Lombardi', 'NPK'),
('BR', 'SC', 'Florianópolis', '1994-01-01', 'fixação biológica de nitrogênio', 1000, 'OCDE', 'NPK'),
('BR', 'MG', 'Belo Horizonte', '1994-01-01', 'resíduos culturais', 1050, 'OCDE', 'NPK'),
('BR', 'BA', 'Salvador', '1994-01-01', 'resíduos industriais', 1100, 'OCDE', 'NPK'),
('BR', 'RS', 'Porto Alegre', '1994-01-01', 'resíduos urbanos', 1150, 'OCDE', 'NPK'),
('BR', 'MT', 'Cuiabá', '1994-01-01', 'produção carne bovina', 1200, 'OCDE', 'NPK'),
('BR', 'MS', 'Campo Grande', '1994-01-01', 'produção agrícola', 1250, 'OCDE', 'NPK'),
('BR', 'GO', 'Goiânia', '1994-01-01', 'área agropecuária', 1300, 'OCDE', 'NPK'),

-- Dados de 1995
('BR', 'RJ', 'Rio de Janeiro', '1995-01-01', 'dejetos animais', 1200, 'OCDE', 'NPK'),
('BR', 'SP', 'São Paulo', '1995-01-01', 'deposição atmosférica', 1300, 'IAC', 'NPK'),
('BR', 'DF', 'Brasília', '1995-01-01', 'fertilizantes minerais', 1450, 'UNB', 'NPK'),
('BR', 'PR', 'Curitiba', '1995-01-01', 'fertilizantes orgânicos', 9000, 'Lombardi', 'NPK'),
('BR', 'SC', 'Florianópolis', '1995-01-01', 'fixação biológica de nitrogênio', 1500, 'OCDE', 'NPK'),
('BR', 'MG', 'Belo Horizonte', '1995-01-01', 'resíduos culturais', 1600, 'OCDE', 'NPK'),
('BR', 'BA', 'Salvador', '1995-01-01', 'resíduos industriais', 1700, 'OCDE', 'NPK'),
('BR', 'RS', 'Porto Alegre', '1995-01-01', 'resíduos urbanos', 1800, 'OCDE', 'NPK'),
('BR', 'MT', 'Cuiabá', '1995-01-01', 'produção carne bovina', 1900, 'OCDE', 'NPK'),
('BR', 'MS', 'Campo Grande', '1995-01-01', 'produção agrícola', 2000, 'OCDE', 'NPK'),
('BR', 'GO', 'Goiânia', '1995-01-01', 'área agropecuária', 2100, 'OCDE', 'NPK');

-- Inserindo registros com a análise "orgânicas"
INSERT INTO tb_report (country, state, city, period, label, value, source, analysis)
VALUES
-- Dados de 1990
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'grão', 100, 'OCDE', 'orgânicas'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'hortaliças', 150, 'IAC', 'orgânicas'),
('BR', 'DF', 'Brasília', '1990-01-01', 'fruticultura', 50, 'UNB', 'orgânicas'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'pastagem', 10, 'Lombardi', 'orgânicas'),

-- Dados de 1990 (continuação)
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'grão', 110, 'OCDE', 'orgânicas'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'hortaliças', 160, 'IAC', 'orgânicas'),
('BR', 'DF', 'Brasília', '1990-01-01', 'fruticultura', 60, 'UNB', 'orgânicas'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'pastagem', 20, 'Lombardi', 'orgânicas'),

-- Dados de 1991
('BR', 'RJ', 'Rio de Janeiro', '1991-01-01', 'grão', 250, 'OCDE', 'orgânicas'),
('BR', 'SP', 'São Paulo', '1991-01-01', 'hortaliças', 350, 'IAC', 'orgânicas'),
('BR', 'DF', 'Brasília', '1991-01-01', 'fruticultura', 200, 'UNB', 'orgânicas'),
('BR', 'PR', 'Curitiba', '1991-01-01', 'pastagem', 100, 'Lombardi', 'orgânicas'),

-- Dados de 1992
('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'grão', 400, 'OCDE', 'orgânicas'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'hortaliças', 500, 'IAC', 'orgânicas'),
('BR', 'DF', 'Brasília', '1992-01-01', 'fruticultura', 450, 'UNB', 'orgânicas'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'pastagem', 250, 'Lombardi', 'orgânicas'),

-- Dados de 1992 (continuação)
('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'grão', 410, 'OCDE', 'orgânicas'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'hortaliças', 510, 'IAC', 'orgânicas'),
('BR', 'DF', 'Brasília', '1992-01-01', 'fruticultura', 460, 'UNB', 'orgânicas'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'pastagem', 260, 'Lombardi', 'orgânicas'),

-- Dados de 1993
('BR', 'RJ', 'Rio de Janeiro', '1993-01-01', 'grão', 800, 'OCDE', 'orgânicas'),
('BR', 'SP', 'São Paulo', '1993-01-01', 'hortaliças', 750, 'IAC', 'orgânicas'),
('BR', 'DF', 'Brasília', '1993-01-01', 'fruticultura', 800, 'UNB', 'orgânicas'),
('BR', 'PR', 'Curitiba', '1993-01-01', 'pastagem', 450, 'Lombardi', 'orgânicas'),

-- Dados de 1994
('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'grão', 900, 'OCDE', 'orgânicas'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'hortaliças', 900, 'IAC', 'orgânicas'),
('BR', 'DF', 'Brasília', '1994-01-01', 'fruticultura', 1100, 'UNB', 'orgânicas'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'pastagem', 900, 'Lombardi', 'orgânicas'),

-- Dados de 1994 (continuação)
('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'grão', 910, 'OCDE', 'orgânicas'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'hortaliças', 910, 'IAC', 'orgânicas'),
('BR', 'DF', 'Brasília', '1994-01-01', 'fruticultura', 1110, 'UNB', 'orgânicas'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'pastagem', 910, 'Lombardi', 'orgânicas'),

-- Dados de 1995
('BR', 'RJ', 'Rio de Janeiro', '1995-01-01', 'grão', 1200, 'OCDE', 'orgânicas'),
('BR', 'SP', 'São Paulo', '1995-01-01', 'hortaliças', 1300, 'IAC', 'orgânicas'),
('BR', 'DF', 'Brasília', '1995-01-01', 'fruticultura', 1450, 'UNB', 'orgânicas'),
('BR', 'PR', 'Curitiba', '1995-01-01', 'pastagem', 9000, 'Lombardi', 'orgânicas');

-- Inserindo registros com a análise "pesticidas"
INSERT INTO tb_report (country, state, city, period, label, value, source, analysis)
VALUES
-- Dados de 1990
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'fungicidas', 100, 'OCDE', 'pesticidas'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'outros', 150, 'IAC', 'pesticidas'),
('BR', 'DF', 'Brasília', '1990-01-01', 'inseticitas', 50, 'UNB', 'pesticidas'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'herbicidas', 10, 'Lombardi', 'pesticidas'),

-- Dados de 1990 (continuação)
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'fungicidas', 110, 'OCDE', 'pesticidas'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'outros', 160, 'IAC', 'pesticidas'),
('BR', 'DF', 'Brasília', '1990-01-01', 'inseticitas', 60, 'UNB', 'pesticidas'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'herbicidas', 20, 'Lombardi', 'pesticidas'),

-- Dados de 1991
('BR', 'RJ', 'Rio de Janeiro', '1991-01-01', 'fungicidas', 250, 'OCDE', 'pesticidas'),
('BR', 'SP', 'São Paulo', '1991-01-01', 'outros', 350, 'IAC', 'pesticidas'),
('BR', 'DF', 'Brasília', '1991-01-01', 'inseticitas', 200, 'UNB', 'pesticidas'),
('BR', 'PR', 'Curitiba', '1991-01-01', 'herbicidas', 100, 'Lombardi', 'pesticidas'),

-- Dados de 1992
('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'fungicidas', 400, 'OCDE', 'pesticidas'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'outros', 500, 'IAC', 'pesticidas'),
('BR', 'DF', 'Brasília', '1992-01-01', 'inseticitas', 450, 'UNB', 'pesticidas'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'herbicidas', 250, 'Lombardi', 'pesticidas'),

-- Dados de 1992 (continuação)
('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'fungicidas', 410, 'OCDE', 'pesticidas'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'outros', 510, 'IAC', 'pesticidas'),
('BR', 'DF', 'Brasília', '1992-01-01', 'inseticitas', 460, 'UNB', 'pesticidas'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'herbicidas', 260, 'Lombardi', 'pesticidas'),

-- Dados de 1993
('BR', 'RJ', 'Rio de Janeiro', '1993-01-01', 'fungicidas', 800, 'OCDE', 'pesticidas'),
('BR', 'SP', 'São Paulo', '1993-01-01', 'outros', 750, 'IAC', 'pesticidas'),
('BR', 'DF', 'Brasília', '1993-01-01', 'inseticitas', 800, 'UNB', 'pesticidas'),
('BR', 'PR', 'Curitiba', '1993-01-01', 'herbicidas', 450, 'Lombardi', 'pesticidas'),

-- Dados de 1994
('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'fungicidas', 900, 'OCDE', 'pesticidas'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'outros', 900, 'IAC', 'pesticidas'),
('BR', 'DF', 'Brasília', '1994-01-01', 'inseticitas', 1100, 'UNB', 'pesticidas'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'herbicidas', 900, 'Lombardi', 'pesticidas'),

-- Dados de 1994 (continuação)
('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'fungicidas', 910, 'OCDE', 'pesticidas'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'outros', 910, 'IAC', 'pesticidas'),
('BR', 'DF', 'Brasília', '1994-01-01', 'inseticitas', 1110, 'UNB', 'pesticidas'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'herbicidas', 910, 'Lombardi', 'pesticidas'),

-- Dados de 1995
('BR', 'RJ', 'Rio de Janeiro', '1995-01-01', 'fungicidas', 1200, 'OCDE', 'pesticidas'),
('BR', 'SP', 'São Paulo', '1995-01-01', 'outros', 1300, 'IAC', 'pesticidas'),
('BR', 'DF', 'Brasília', '1995-01-01', 'inseticitas', 1450, 'UNB', 'pesticidas'),
('BR', 'PR', 'Curitiba', '1995-01-01', 'herbicidas', 9000, 'Lombardi', 'pesticidas');

-- Inserindo registros com a análise "poluição"
INSERT INTO tb_report (country, state, city, period, label, value, source, analysis)
VALUES
-- Dados de 1990
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'fosfato', 100, 'OCDE', 'poluição'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'anions', 150, 'IAC', 'poluição'),
('BR', 'DF', 'Brasília', '1990-01-01', 'cations', 50, 'UNB', 'poluição'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'nitrato', 10, 'Lombardi', 'poluição'),

-- Dados de 1990 (continuação)
('BR', 'RJ', 'Rio de Janeiro', '1990-01-01', 'fosfato', 110, 'OCDE', 'poluição'),
('BR', 'SP', 'São Paulo', '1990-01-01', 'anions', 160, 'IAC', 'poluição'),
('BR', 'DF', 'Brasília', '1990-01-01', 'cations', 60, 'UNB', 'poluição'),
('BR', 'PR', 'Curitiba', '1990-01-01', 'nitrato', 20, 'Lombardi', 'poluição'),

-- Dados de 1991
('BR', 'RJ', 'Rio de Janeiro', '1991-01-01', 'fosfato', 250, 'OCDE', 'poluição'),
('BR', 'SP', 'São Paulo', '1991-01-01', 'anions', 350, 'IAC', 'poluição'),
('BR', 'DF', 'Brasília', '1991-01-01', 'cations', 200, 'UNB', 'poluição'),
('BR', 'PR', 'Curitiba', '1991-01-01', 'nitrato', 100, 'Lombardi', 'poluição'),

-- Dados de 1992
('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'fosfato', 400, 'OCDE', 'poluição'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'anions', 500, 'IAC', 'poluição'),
('BR', 'DF', 'Brasília', '1992-01-01', 'cations', 450, 'UNB', 'poluição'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'nitrato', 250, 'Lombardi', 'poluição'),

-- Dados de 1992 (continuação)
('BR', 'RJ', 'Rio de Janeiro', '1992-01-01', 'fosfato', 410, 'OCDE', 'poluição'),
('BR', 'SP', 'São Paulo', '1992-01-01', 'anions', 510, 'IAC', 'poluição'),
('BR', 'DF', 'Brasília', '1992-01-01', 'cations', 460, 'UNB', 'poluição'),
('BR', 'PR', 'Curitiba', '1992-01-01', 'nitrato', 260, 'Lombardi', 'poluição'),

-- Dados de 1993
('BR', 'RJ', 'Rio de Janeiro', '1993-01-01', 'fosfato', 800, 'OCDE', 'poluição'),
('BR', 'SP', 'São Paulo', '1993-01-01', 'anions', 750, 'IAC', 'poluição'),
('BR', 'DF', 'Brasília', '1993-01-01', 'cations', 800, 'UNB', 'poluição'),
('BR', 'PR', 'Curitiba', '1993-01-01', 'nitrato', 450, 'Lombardi', 'poluição'),

-- Dados de 1994
('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'fosfato', 900, 'OCDE', 'poluição'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'anions', 900, 'IAC', 'poluição'),
('BR', 'DF', 'Brasília', '1994-01-01', 'cations', 1100, 'UNB', 'poluição'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'nitrato', 900, 'Lombardi', 'poluição'),

-- Dados de 1994 (continuação)
('BR', 'RJ', 'Rio de Janeiro', '1994-01-01', 'fosfato', 910, 'OCDE', 'poluição'),
('BR', 'SP', 'São Paulo', '1994-01-01', 'anions', 910, 'IAC', 'poluição'),
('BR', 'DF', 'Brasília', '1994-01-01', 'cations', 1110, 'UNB', 'poluição'),
('BR', 'PR', 'Curitiba', '1994-01-01', 'nitrato', 910, 'Lombardi', 'poluição'),

-- Dados de 1995
('BR', 'RJ', 'Rio de Janeiro', '1995-01-01', 'fosfato', 1200, 'OCDE', 'poluição'),
('BR', 'SP', 'São Paulo', '1995-01-01', 'anions', 1300, 'IAC', 'poluição'),
('BR', 'DF', 'Brasília', '1995-01-01', 'cations', 1450, 'UNB', 'poluição'),
('BR', 'PR', 'Curitiba', '1995-01-01', 'nitrato', 9000, 'Lombardi', 'poluição');