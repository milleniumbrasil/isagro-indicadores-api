import psycopg2

# Mapeamento dos geocódigos para as siglas dos estados brasileiros
geocode_to_state = {
    '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA', '16': 'AP', '17': 'TO',
    '21': 'MA', '22': 'PI', '23': 'CE', '24': 'RN', '25': 'PB', '26': 'PE', '27': 'AL',
    '28': 'SE', '29': 'BA', '31': 'MG', '32': 'ES', '33': 'RJ', '35': 'SP', '41': 'PR',
    '42': 'SC', '43': 'RS', '50': 'MS', '51': 'MT', '52': 'GO', '53': 'DF'
}

def update_states():
    try:
        # Conexão com o banco de dados
        conn = psycopg2.connect(
            host="localhost",  # Ajuste conforme sua configuração
            port="5432",
            database="postgres",
            user="postgres",
            password="postgres"
        )
        cursor = conn.cursor()

        # Atualiza os estados na tabela tb_chart
        for geocode, state in geocode_to_state.items():
            update_query = """
                UPDATE tb_chart
                SET state = %s
                WHERE state = %s
            """
            cursor.execute(update_query, (state, geocode))

        # Confirma as mudanças
        conn.commit()
        print("Estados atualizados com sucesso.")

    except Exception as e:
        print("Erro ao atualizar os estados:", e)

    finally:
        # Fecha a conexão com o banco de dados
        if conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    update_states()
