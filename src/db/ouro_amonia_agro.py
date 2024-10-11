from datetime import datetime
from db_utils import get_db_connection, read_csv_file, insert_record, print_test_results

def process_data(file_path):
    try:
        # Conectando ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Lendo o arquivo CSV
        data = read_csv_file(file_path)

        for row in data:
            # Extraindo os dados do CSV
            country = 'BR'  # Supondo que seja Brasil
            state = row[1]
            date = datetime.strptime(row[2], '%Y-%m-%d').date()
            label = row[3]
            value = float(row[4])
            source = 'ISAgro'
            analysis = 'NH3'
			insert_record(cursor, country, state, '', source, date, label, value, analysis)

        # Confirmando a transação
        conn.commit()

        # Verificando os registros inseridos
        print_test_results(cursor, 'Adubos organicos')

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
    process_data('src/db/ouro_amonia_agro.csv')
