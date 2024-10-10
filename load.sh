#!/bin/bash

# Definindo as variáveis de ambiente para a conexão com o banco de dados
export DATABASE_HOST="localhost"
export DATABASE_PORT="5432"
export DATABASE_NAME="postgres"
export DATABASE_USER="postgres"
export DATABASE_PASSWORD="postgres"

# Verifica se o ambiente virtual já existe
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativa o ambiente virtual
echo "Ativando ambiente virtual..."
source venv/bin/activate

# Instala os pacotes do requirements.txt
echo "Instalando dependências..."
pip install -r requirements.txt

# Executa o script Python
echo "Executando o script Python..."
python3 src/db/ouro_npk_carcaca_bovina.py
python3 src/db/ouro_npk_producao_agricola.py

# Desativa o ambiente virtual
echo "Desativando ambiente virtual..."
deactivate

echo "Processo concluído."
