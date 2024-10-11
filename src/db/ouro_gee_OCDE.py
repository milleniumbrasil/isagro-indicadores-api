import csv
import psycopg2
from datetime import datetime
import os
import uuid

# Configurações de conexão com o banco de dados
DB_HOST = os.getenv('DATABASE_HOST', 'localhost')
DB_PORT = os.getenv('DATABASE_PORT', '5432')
DB_NAME = os.getenv('DATABASE_NAME', 'postgres')
DB_USER = os.getenv('DATABASE_USER', 'postgres')
DB_PASSWORD = os.getenv('DATABASE_PASSWORD', 'postgres')

# Mapeamento manual para os códigos de país ISO 3166-1 alfa-2
country_code_mapping = {
    "1": "BR",  # Supondo que 1 representa o Brasil no arquivo CSV
    # Adicione outros mapeamentos se necessário
}

def insert_data_to_db():
    try:
        # Conectando ao banco de dados
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()

        # Abrindo o arquivo CSV
        with open('src/db/ouro_gee_agropecuaria.csv', 'r') as file:
            csv_reader = csv.reader(file)
            next(csv_reader)  # Pula o cabeçalho

            for row in csv_reader:
                # Extraindo os dados do CSV
                country_id = row[0]
                country = country_code_mapping.get(country_id, 'Unknown')
                state = row[1]
                date = datetime.strptime(row[2], '%Y-%m-%d').date()
                label = row[3]
                value = float(row[4])
                source = 'Fonte desconhecida'
                analysis = 'GEE'

                # Verifica manualmente se o registro já existe
                check_query = """
                SELECT 1 FROM tb_chart
                WHERE country = %s AND state = %s AND period = %s AND label = %s AND analysis = %s
                """
                cursor.execute(check_query, (country, state, date, label, analysis))
                exists = cursor.fetchone() is not None

                if exists:
                    print(f"Registro já existe para {country}, {state}, {date}, {label}, {analysis}.")
                else:
                    # Insere um novo registro
                    insert_query = """
                    INSERT INTO tb_chart (country, state, city, source, period, label, value, created_at, updated_at, external_id, analysis)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s, %s)
                    """
                    cursor.execute(insert_query, (country, state, '', source, date, label, value, str(uuid.uuid4()), analysis))

        # Confirmando a transação
        conn.commit()

        # Verifica a quantidade de registros na tabela e exibe alguns exemplos
        cursor.execute("SELECT COUNT(*) FROM tb_chart")
        total_records = cursor.fetchone()[0]
        print(f"\nTotal de registros na tabela tb_chart: {total_records}")

        cursor.execute("SELECT * FROM tb_chart WHERE label = 'Emissão de CO2e' LIMIT 10")
        records = cursor.fetchall()
        print("\nExibindo os primeiros 10 registros de 'Emissão de CO2e':")
        for record in records:
            print(record)

    except Exception as error:
        print(f"Erro ao inserir os dados: {error}")
    finally:
        # Fecha o cursor e a conexão
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    insert_data_to_db()
