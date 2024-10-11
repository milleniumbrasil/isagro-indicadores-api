from datetime import datetime
from db_utils import get_db_connection, read_csv_file, check_record_exists, insert_record, print_test_results

def process_data(file_path):
    try:
        # Conectando ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Lendo o arquivo CSV
        data = read_csv_file(file_path)

        for row in data:
            # Extraindo os dados do CSV
            country = row[0]  # Usa o código diretamente do CSV
            state = row[1]
            date = datetime.strptime(row[2], '%Y-%m-%d').date()
            label = row[3]
            value = float(row[4])
            source = 'ISAgro'
            analysis = 'GEE'

            # Verifica se o registro já existe
            if not check_record_exists(cursor, country, state, date, label, analysis):
                # Insere um novo registro
                insert_record(cursor, country, state, '', source, date, label, value, analysis)

        # Confirmando a transação
        conn.commit()

        # Verificando os registros inseridos
        print_test_results(cursor, 'Emissão de CO2e')

        # Mensagem indicando o carregamento completo
        print(f"\nArquivo CSV '{file_path}' carregado com sucesso.")

    except Exception as error:
        print(f"Erro durante o processamento dos dados: {error}")
    finally:
        # Fecha o cursor e a conexão
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    # Passa o caminho do arquivo CSV para processamento
    process_data('src/db/ouro_gee_agropecuaria.csv')