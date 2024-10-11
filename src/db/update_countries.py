import os
from iso3166 import countries
from db_utils import get_db_connection

# Mapeamento manual para os nomes de países que não estão padronizados
country_name_to_iso = {
    "United States": "US",
    "United Kingdom": "GB",
    "China (People's Republic of)": "CN",
    "Russia": "RU",
    "Korea": "KR",
    "Czech Republic": "CZ",
    "Slovak Republic": "SK",
    "Argentina": "AR",
    "Brazil": "BR",
    "Bulgaria": "BG",
    "Croatia": "HR",
    "Cyprus": "CY",
    "India": "IN",
    "Indonesia": "ID",
    "Kazakhstan": "KZ",
    "Malta": "MT",
    "Philippines": "PH",
    "Romania": "RO",
    "South Africa": "ZA",
    "Ukraine": "UA",
    "Viet Nam": "VN"
}

def update_country_codes():
    try:
        # Conectando ao banco de dados usando o utilitário
        conn = get_db_connection()
        cursor = conn.cursor()

        # Consulta para selecionar registros com nomes de países ou valores numéricos
        select_query = """
        SELECT id, country FROM tb_chart
        WHERE LENGTH(country) > 2 OR country ~ '^[0-9]+$'
        """
        cursor.execute(select_query)
        rows = cursor.fetchall()

        # Mapeamento e atualização dos códigos de países
        updated_count = 0
        for row in rows:
            record_id, country_name = row

            # Verifica se o valor de `country` é um número
            if country_name.isdigit():
                # Supondo que o número "1" representa o Brasil
                country_code = "BR"
            else:
                # Tenta obter o código ISO 3166-1 alfa-2 para o país
                country_code = country_name_to_iso.get(country_name.strip())
                if not country_code:
                    try:
                        country_code = countries.get(country_name.strip()).alpha2
                    except KeyError:
                        print(f"País não encontrado: {country_name.strip()}")
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
