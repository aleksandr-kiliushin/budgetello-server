#!/bin/bash

# Loading dump list from remote server to the container.
curl -u :$REMOTE_API_KEY --output /var/app/dumps/dumps.json https://api.elephantsql.com/api/backup?db=$REMOTE_DATABASE_NAME;
# Get the latest date from the dumps array.
DUMP_URL=$(jq 'max_by(.backup_date) | .url' /var/app/dumps/dumps.json -r);
# Downloading the last dump.
curl $DUMP_URL --output /var/app/dumps/dump.lzo

# Create an empty development database template.
psql -U postgres -c "CREATE DATABASE personal_app_dev_template ENCODING 'UTF-8' IS_TEMPLATE true;";
# Fill in the development database template with the downloaded dump data.
lzop -cd /var/app/dumps/dump.lzo | psql -U postgres personal_app_dev_template;

# Create an empty testing database template.
psql -U postgres -c "CREATE DATABASE personal_app_testing_template ENCODING 'UTF-8' IS_TEMPLATE true;";
