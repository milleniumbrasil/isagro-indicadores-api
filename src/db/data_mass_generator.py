#!/usr/bin/env python3

from datetime import datetime
from db_utils import get_db_connection, insert_record, print_test_results
import random

def generate_data_for_indicator(indicator, num_records):
    try:
        # Conectando ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Definir valores básicos
        states = ['DF', 'SP', 'MG', 'RJ', 'RS']
        labels_by_indicator = {
            'NPK': ['Fertilizantes Sintéticos', 'Fertilizantes Orgânicos', 'Fixação biológica de N'],
            'GEE': ['Emissão de Gases', 'Deposição Atmosférica'],
            'NH3': ['Manejo de dejetos', 'Adubos orgânicos'],
        }
        source = 'ISAgro'

        for _ in range(num_records):
            state = random.choice(states)
            label = random.choice(labels_by_indicator.get(indicator, ['Desconhecido']))
            value = round(random.uniform(100, 10000), 2)
            date = datetime.strptime(f'{random.randint(2010, 2023)}-{random.randint(1, 12)}-01', '%Y-%m-%d').date()

            # Insere um novo registro fictício
            insert_record(cursor, 'BR', state, '', source, date, label, value, indicator)

        # Confirmando a transação
        conn.commit()

        # Verificando os registros inseridos
        print_test_results(cursor, f"Gerado {num_records} registros para o indicador {indicator}")

    except Exception as error:
        print(f"Erro durante a geração de dados: {error}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Uso: python data_mass_generator.py <indicador> <numero_de_registros>")
        sys.exit(1)

    indicador = sys.argv[1]
    num_records = int(sys.argv[2])

    generate_data_for_indicator(indicador, num_records)
