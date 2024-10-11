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

def upsert_data_to_db():
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

        # Caminho para o arquivo CSV
        csv_file_path = "src/db/ouro_area_agricola_OCDE.csv"

        # Leitura do arquivo CSV
        with open(csv_file_path, mode='r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                # Extraindo os dados do CSV
                country = row['country']
                date = datetime.strptime(row['date'], '%Y-%m-%d').date()
                label = row['label']
                value = float(row['value'])

                # Definindo valores adicionais
                state = ''
                city = ''
                source = 'Fonte OCDE'
                analysis = 'Área Agrícola'
                external_id = str(uuid.uuid4())

                # Verificando se o registro já existe
                check_query = """
                SELECT id FROM tb_chart
                WHERE country = %s AND period = %s AND label = %s
                """
                cursor.execute(check_query, (country, date, label))
                result = cursor.fetchone()

                if result:
                    # Atualizando o registro existente
                    update_query = """
                    UPDATE tb_chart
                    SET value = %s, updated_at = NOW()
                    WHERE id = %s
                    """
                    cursor.execute(update_query, (value, result[0]))
                else:
                    # Inserindo um novo registro
                    insert_query = """
                    INSERT INTO tb_chart (country, state, city, source, period, label, value, created_at, updated_at, external_id, analysis)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s, %s)
                    """
                    cursor.execute(insert_query, (country, state, city, source, date, label, value, external_id, analysis))

        # Confirmando a transação
        conn.commit()

        # Verifica a quantidade de registros na tabela e exibe alguns exemplos
        cursor.execute("SELECT COUNT(*) FROM tb_chart")
        total_records = cursor.fetchone()[0]
        print(f"\nTotal de registros na tabela tb_chart: {total_records}")

        # Exibe os 10 primeiros registros inseridos/atualizados para a análise "Área Agrícola"
        cursor.execute("""
        SELECT * FROM tb_chart
        WHERE analysis = 'Área Agrícola'
        ORDER BY updated_at DESC
        LIMIT 10
        """)
        records = cursor.fetchall()
        print("\nExibindo os primeiros 10 registros de 'Área Agrícola':")
        for record in records:
            print(record)

    except Exception as error:
        print(f"Erro ao inserir/atualizar os dados: {error}")
    finally:
        # Fecha o cursor e a conexão
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    upsert_data_to_db()
