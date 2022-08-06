#!/bin/bash

# After the database container has started, run this script to initialize database.

# Variant 1:
# From your host machine execute: `echo "bash /app/download-and-prepare-db-templates.sh" | docker exec -i personal-app-database bash;`.

# Variant 2:
# From your host machine execute: `docker exec -it personal-app-database /bin/sh`.
# Inside the database container execute: `bash /app/download-and-prepare-db-templates.sh`.

# Variant 3:
# From your host machine execute: `npm run download-and-prepare-db-templates`.

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
# Fill in the testing database template with the downloaded dump data.
lzop -cd /var/app/dumps/dump.lzo | psql -U postgres personal_app_testing_template;
# Clear all tables in testing database.
psql personal_app_testing_template postgres << EOF
  TRUNCATE
  finance_category,
  finance_category_type,
  finance_record,
  "user"
  CASCADE;
EOF
# Reset tables primary key sequence.
psql personal_app_testing_template postgres << EOF
  ALTER SEQUENCE finance_category_id_seq RESTART WITH 1;
  ALTER SEQUENCE finance_category_type_id_seq RESTART WITH 1;
  ALTER SEQUENCE finance_record_id_seq RESTART WITH 1;
  ALTER SEQUENCE user_id_seq RESTART WITH 1;
EOF
# Registers a couple of users.
psql personal_app_testing_template postgres << EOF
  INSERT INTO "user" (username,        password                                                         )
  VALUES             ('john-doe',      '\$2b\$10\$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i'),
                     ('jessica-stark', '\$2b\$10\$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC');
EOF
# Adds two finance category types.
psql personal_app_testing_template postgres << EOF
  INSERT INTO finance_category_type (name     )
  VALUES                            ('expense'),
                                    ('income' );
EOF
# Adds two finance category types.
psql personal_app_testing_template postgres << EOF
  INSERT INTO finance_category (name,        "typeId")
  VALUES                       ('clothes'  , 1       ),
                               ('education', 1       ),
                               ('gifts'    , 1       ),
                               ('gifts'    , 2       ),
                               ('salary'   , 2       );
EOF

psql -U postgres -c "CREATE DATABASE personal_app_db WITH TEMPLATE personal_app_dev_template ENCODING 'UTF-8';";
