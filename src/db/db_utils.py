import psycopg2
import csv
import os

# Configurações de conexão com o banco de dados
DB_HOST = os.getenv('DATABASE_HOST', 'localhost')
DB_PORT = os.getenv('DATABASE_PORT', '5432')
DB_NAME = os.getenv('DATABASE_NAME', 'postgres')
DB_USER = os.getenv('DATABASE_USER', 'postgres')
DB_PASSWORD = os.getenv('DATABASE_PASSWORD', 'postgres')

def get_db_connection():
    """Estabelece uma conexão com o banco de dados."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        raise

def read_csv_file(file_path):
    """Lê um arquivo CSV e retorna os dados em uma lista de listas."""
    try:
        with open(file_path, 'r') as file:
            csv_reader = csv.reader(file)
            next(csv_reader)  # Pula o cabeçalho
            return [row for row in csv_reader]
    except Exception as e:
        print(f"Erro ao ler o arquivo CSV: {e}")
        raise

def check_record_exists(cursor, country, state, period, label, analysis):
    """Verifica se um registro já existe no banco de dados."""
    try:
        query = """
        SELECT 1 FROM tb_chart
        WHERE country = %s AND state = %s AND period = %s AND label = %s AND analysis = %s
        """
        cursor.execute(query, (country, state, period, label, analysis))
        return cursor.fetchone() is not None
    except Exception as e:
        print(f"Erro ao verificar a existência do registro: {e}")
        raise

def insert_record(cursor, country, state, city, source, period, label, value, analysis):
    """Insere um novo registro na tabela tb_chart."""
    try:
        query = """
        INSERT INTO tb_chart (country, state, city, source, period, label, value, created_at, updated_at, analysis)
        VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s)
        """
        cursor.execute(query, (country, state, city, source, period, label, value, analysis))
    except Exception as e:
        print(f"Erro ao inserir o registro: {e}")
        raise

def print_test_results(cursor, label):
    """Realiza uma consulta para verificar os registros inseridos e imprime os resultados."""
    try:
        cursor.execute("SELECT COUNT(*) FROM tb_chart")
        total_records = cursor.fetchone()[0]
        print(f"\nTotal de registros na tabela tb_chart: {total_records}")

        cursor.execute("SELECT * FROM tb_chart WHERE label = %s LIMIT 10", (label,))
        records = cursor.fetchall()
        print(f"\nExibindo os primeiros 10 registros de '{label}':")
        for record in records:
            print(record)
    except Exception as e:
        print(f"Erro ao verificar os resultados: {e}")
        raise
