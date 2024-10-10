import csv
import psycopg2
from datetime import datetime

# Configurações de conexão com o banco de dados
DB_HOST = "seu_host"
DB_NAME = "seu_banco"
DB_USER = "seu_usuario"
DB_PASSWORD = "sua_senha"

# Caminho do arquivo CSV
CSV_FILE = "ouro_npk_producao_agricola.csv"

# Função para inserir dados na tabela
def insert_data_to_db():
    # Conexão com o banco de dados
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cursor = conn.cursor()

    with open(CSV_FILE, mode='r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)  # Pula o cabeçalho

        for row in csv_reader:
            state, date, label, nutrient, value = row

            # Dados adicionais necessários
            country = "BR"
            city = ""
            source = "Fonte desconhecida"
            analysis = "NPK"

            # Inserção dos dados
            insert_query = """
            INSERT INTO public.tb_chart (country, state, city, source, period, label, value, analysis)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (country, state, city, source, date, label, int(float(value)), analysis))

    # Commit e fechamento da conexão
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    insert_data_to_db()
