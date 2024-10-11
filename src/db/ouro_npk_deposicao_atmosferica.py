from datetime import datetime
from db_utils import get_db_connection, read_csv_file, insert_record, print_test_results

def process_data(file_path, src, indicador, success_msg):
    try:
        # Conectando ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Lendo o arquivo CSV
        data = read_csv_file(file_path)

        for row in data:
            # Extraindo os dados do CSV
            state, date_str, label, nutrient, value_str = row
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            country = "BR"
            city = ""
            source = src
            analysis = indicador

            # Conversão para float
            try:
                value = float(value_str)
            except ValueError:
                print(f"Valor inválido encontrado: {value_str}")
                continue

            # Insere um novo registro
            insert_record(cursor, country, state, city, source, date, label, value, analysis)

        # Confirmando a transação
        conn.commit()

        # Verificando os registros inseridos
        print_test_results(cursor, success_msg)

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
    # Parâmetros específicos para o script "ouro_npk_deposicao_atmosferica"
    process_data(
        'src/db/ouro_npk_deposicao_atmosferica.csv',  # Caminho do arquivo CSV
        'ISAgro',  # Fonte
        'NPK',  # Indicador/analysis
        'Deposição Atmosférica'  # Mensagem de sucesso
    )
