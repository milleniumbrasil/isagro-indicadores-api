import os
import csv
import psycopg2
from datetime import datetime

# Configurações de conexão com o banco de dados
DB_HOST = os.getenv('DATABASE_HOST', 'localhost')
DB_PORT = os.getenv('DATABASE_PORT', '5432')
DB_NAME = os.getenv('DATABASE_NAME', 'postgres')
DB_USER = os.getenv('DATABASE_USER', 'postgres')
DB_PASSWORD = os.getenv('DATABASE_PASSWORD', 'postgres')

# Caminho do arquivo CSV
CSV_FILE = "src/db/ouro_npk_producao_agricola.csv"

# Função para inserir dados na tabela
def insert_data_to_db():
    # Conexão com o banco de dados
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
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

    # Verifica se os dados foram inseridos
    cursor.execute("SELECT COUNT(*) FROM public.tb_chart")
    count = cursor.fetchone()[0]
    print(f"\nTotal de registros na tabela tb_chart: {count}")

    # Consulta todos os registros para exibir
    cursor.execute("SELECT * FROM public.tb_chart LIMIT 10")
    rows = cursor.fetchall()

    # Exibe os primeiros 10 resultados
    print("\nExibindo os primeiros 10 registros inseridos:")
    for row in rows:
        print(row)

    # Fecha o cursor e a conexão
    cursor.close()
    conn.close()

if __name__ == "__main__":
    insert_data_to_db()
