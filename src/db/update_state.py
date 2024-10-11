from db_utils import get_db_connection
import csv

def load_geocode_mapping(filename):
    """Carrega o mapeamento de geocódigos para estados a partir de um arquivo CSV."""
    geocode_to_state = {}
    with open(filename, 'r') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)  # Pular o cabeçalho

        for row in csv_reader:
            geocode = row[0].strip()
            state = row[1].strip()
            geocode_to_state[geocode] = state
    return geocode_to_state

def update_states(filename):
    try:
        # Conexão com o banco de dados usando o utilitário
        conn = get_db_connection()
        cursor = conn.cursor()

        # Carregar o mapeamento dos geocódigos
        geocode_to_state = load_geocode_mapping(filename)

        # Atualiza os estados na tabela tb_chart
        for geocode, state in geocode_to_state.items():
            update_query = """
                UPDATE tb_chart
                SET state = %s
                WHERE state = %s
            """
            cursor.execute(update_query, (state, geocode))

        # Corrige os estados restantes com código 1 e 34, se existirem
        manual_corrections = {'1': 'DF', '34': 'SP'}
        for old_code, new_state in manual_corrections.items():
            cursor.execute("UPDATE tb_chart SET state = %s WHERE state = %s", (new_state, old_code))

        # Confirma as mudanças
        conn.commit()
        print("Estados atualizados com sucesso.")

        # Verificação dos estados que ainda estão numéricos ou inválidos
        check_query = """
            SELECT DISTINCT state
            FROM tb_chart
            WHERE state ~ '^[0-9]+$' OR state IS NULL
        """
        cursor.execute(check_query)
        invalid_states = cursor.fetchall()

        if invalid_states:
            print("Estados ainda numéricos ou inválidos encontrados:")
            for state in invalid_states:
                print(state[0])
        else:
            print("Nenhum estado numérico ou inválido encontrado.")

    except Exception as e:
        print("Erro ao atualizar os estados:", e)

    finally:
        # Fecha a conexão com o banco de dados
        if conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    update_states('src/db/ouro_ibge_geocodigo.csv')
