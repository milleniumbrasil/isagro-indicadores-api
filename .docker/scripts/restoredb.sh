#!/bin/bash
set -e

if [[ -r $PGBACKUP_FILE ]]
then
    export PGUSER="$POSTGRES_USER"

    dropdb -e -f --if-exists $POSTGRES_DB
    createdb -e $POSTGRES_DB
    pg_restore -d $POSTGRES_DB -Fc -v "$PGBACKUP_FILE"

else
    echo "Skipping database restoration..."
fi
