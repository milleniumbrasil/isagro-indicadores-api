import psycopg2
import os
from iso3166 import countries

# Configurações de conexão com o banco de dados
DB_HOST = os.getenv('DATABASE_HOST', 'localhost')
DB_PORT = os.getenv('DATABASE_PORT', '5432')
DB_NAME = os.getenv('DATABASE_NAME', 'postgres')
DB_USER = os.getenv('DATABASE_USER', 'postgres')
DB_PASSWORD = os.getenv('DATABASE_PASSWORD', 'postgres')

# Mapeamento manual para os nomes de países que não estão padronizados
country_name_to_iso = {
    "United States": "US",
    "United Kingdom": "GB",
    "China (People's Republic of)": "CN",
    "Russia": "RU",
    "Korea": "KR",
    "Czech Republic": "CZ",
    "Slovak Republic": "SK"
}

def update_country_codes():
    try:
        # Conectando ao banco de dados
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()

        # Consulta para selecionar registros com nomes de países
        select_query = """
        SELECT id, country FROM tb_chart
        WHERE LENGTH(country) > 2
        """
        cursor.execute(select_query)
        rows = cursor.fetchall()

        # Mapeamento e atualização dos códigos de países
        updated_count = 0
        for row in rows:
            record_id, country_name = row

            # Tenta obter o código ISO 3166-1 alfa-2 para o país
            country_code = country_name_to_iso.get(country_name)
            if not country_code:
                try:
                    country_code = countries.get(country_name).alpha2
                except KeyError:
                    print(f"País não encontrado: {country_name}")
                    continue

            # Atualiza o registro no banco de dados
            update_query = """
            UPDATE tb_chart
            SET country = %s, updated_at = NOW()
            WHERE id = %s
            """
            cursor.execute(update_query, (country_code, record_id))
            updated_count += 1

        # Confirmando a transação
        conn.commit()
        print(f"\nTotal de registros atualizados: {updated_count}")

    except Exception as error:
        print(f"Erro ao atualizar os códigos dos países: {error}")
    finally:
        # Fecha o cursor e a conexão
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    update_country_codes()
