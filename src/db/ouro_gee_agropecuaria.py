from datetime import datetime
from db_utils import get_db_connection, read_csv_file, check_record_exists, insert_record, print_test_results

# Mapeamento manual para os códigos de país ISO 3166-1 alfa-2
country_code_mapping = {
    "1": "BR",  # Supondo que 1 representa o Brasil no arquivo CSV
    # Adicione outros mapeamentos se necessário
}

def process_data():
    try:
        # Conectando ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Lendo o arquivo CSV
        data = read_csv_file('src/db/ouro_gee_agropecuaria.csv')

        for row in data:
            # Extraindo os dados do CSV
            country_id = row[0]
            country = country_code_mapping.get(country_id, 'Unknown')
            state = row[1]
            date = datetime.strptime(row[2], '%Y-%m-%d').date()
            label = row[3]
            value = float(row[4])
            source = 'Fonte desconhecida'
            analysis = 'GEE'

            # Verifica se o registro já existe
            if not check_record_exists(cursor, country, state, date, label, analysis):
                # Insere um novo registro
                insert_record(cursor, country, state, '', source, date, label, value, analysis)

        # Confirmando a transação
        conn.commit()

        # Verificando os registros inseridos
        print_test_results(cursor, 'Emissão de CO2e')

    except Exception as error:
        print(f"Erro durante o processamento dos dados: {error}")
    finally:
        # Fecha o cursor e a conexão
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    process_data()
