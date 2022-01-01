#!/bin/bash

# After the DB container has started, run this script to initialize DB.

# Variant 1:
# From your host machine execute: echo "bash /app/init.sh" | docker exec -i finance-db bash;

# Variant 2:
# From your host machine execute: docker exec -it finance-db /bin/sh
# Inside the DB container execute: bash /app/init.sh

# Loading dump list from remote server to the container.
curl -u :$REMOTE_API_KEY --output /var/app/dumps/dumps.json https://api.elephantsql.com/api/backup?db=$REMOTE_DB_NAME;

# Get the latest date from the dumps array.
DUMP_URL=$(jq 'max_by(.backup_date) | .url' /var/app/dumps/dumps.json -r);

# Downloading the last dump.
curl $DUMP_URL --output /var/app/dumps/dump.lzo

# Create a new clear DB for out app.
psql -U postgres -c "CREATE DATABASE finance ENCODING 'UTF-8';";

# Restore DB from the downloaded dump.
lzop -cd /var/app/dumps/dump.lzo | psql -U postgres finance;
