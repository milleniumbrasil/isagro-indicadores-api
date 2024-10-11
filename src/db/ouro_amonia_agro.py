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

        # Abrindo o arquivo CSV
        with open('src/db/ouro_amonia_agro.csv', 'r') as file:
            csv_reader = csv.reader(file)
            next(csv_reader)  # Pula o cabeçalho

            for row in csv_reader:
                country = 'BR'  # Supondo que seja Brasil
                state = row[1]
                date = datetime.strptime(row[2], '%Y-%m-%d').date()
                label = row[3]
                value = float(row[4])
                source = 'Fonte desconhecida'
                analysis = 'NH3'

                # Verifica se o registro já existe
                check_query = """
                SELECT id FROM tb_chart
                WHERE state = %s AND period = %s AND label = %s AND analysis = %s
                """
                cursor.execute(check_query, (state, date, label, analysis))
                result = cursor.fetchone()

                if result:
                    # Atualiza o registro existente
                    update_query = """
                    UPDATE tb_chart
                    SET value = %s, updated_at = NOW()
                    WHERE id = %s
                    """
                    cursor.execute(update_query, (value, result[0]))
                else:
                    # Insere um novo registro
                    insert_query = """
                    INSERT INTO tb_chart (country, state, city, source, period, label, value, created_at, updated_at, analysis)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s)
                    """
                    cursor.execute(insert_query, (country, state, '', source, date, label, value, analysis))

        # Confirma as alterações
        conn.commit()

        # Verifica a quantidade de registros na tabela e exibe alguns exemplos
        cursor.execute("SELECT COUNT(*) FROM tb_chart")
        total_records = cursor.fetchone()[0]
        print(f"\nTotal de registros na tabela tb_chart: {total_records}")

        cursor.execute("SELECT * FROM tb_chart WHERE label = 'Adubos organicos' LIMIT 10")
        records = cursor.fetchall()
        print("\nExibindo os primeiros 10 registros de 'Adubos organicos':")
        for record in records:
            print(record)

    except Exception as error:
        print(f"Erro ao inserir/atualizar os dados: {error}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    upsert_data_to_db()
