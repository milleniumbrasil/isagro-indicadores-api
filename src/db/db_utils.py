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
    data = []
    try:
        with open(file_path, 'r') as file:
            csv_reader = csv.reader(file)
            next(csv_reader)  # Pular o cabeçalho
            data = [row for row in csv_reader]
        return data
    except Exception as e:
        print(f"Erro ao ler o arquivo CSV: {e}")
        raise

def upsert_data(cursor, query, params):
    """Executa uma operação de inserção ou atualização."""
    try:
        cursor.execute(query, params)
    except Exception as e:
        print(f"Erro ao inserir/atualizar dados: {e}")
        raise

def verify_data(cursor, query, params):
    """Verifica se um registro existe no banco de dados."""
    cursor.execute(query, params)
    return cursor.fetchone() is not None

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
