#!/usr/bin/env python3

from db_utils import get_db_connection

def clear_tb_chart():
    try:
        # Conectando ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Apagando os registros da tabela TBChart
        print("Apagando registros da tabela TBChart...")
        cursor.execute("DELETE FROM public.tb_chart")

        # Confirmando a transação
        conn.commit()

        # Verificando se os dados foram apagados
        cursor.execute("SELECT COUNT(*) FROM public.tb_chart")
        count = cursor.fetchone()[0]
        print(f"Total de registros restantes na tabela TBChart: {count}")

    except Exception as error:
        print(f"Erro ao apagar os registros da tabela TBChart: {error}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    clear_tb_chart()
