#!/bin/bash

# Create dev database template from current personal_app_db state.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_dev_template WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_dev_template WITH TEMPLATE personal_app_db ENCODING 'UTF-8';";



# Clear database tables.
psql personal_app_db postgres << EOF
  TRUNCATE
  finance_category,
  finance_category_type,
  finance_record,
  "user"
  CASCADE;
EOF
# Reset tables primary key sequence.
psql personal_app_db postgres << EOF
  ALTER SEQUENCE finance_category_id_seq RESTART WITH 1;
  ALTER SEQUENCE finance_category_type_id_seq RESTART WITH 1;
  ALTER SEQUENCE finance_record_id_seq RESTART WITH 1;
  ALTER SEQUENCE user_id_seq RESTART WITH 1;
EOF



# Seed database with testing data.
psql personal_app_db postgres << EOF
  INSERT INTO "user" (username,        password                                                         )
  VALUES             ('john-doe',      '\$2b\$10\$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i'),
                     ('jessica-stark', '\$2b\$10\$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC');
EOF
psql personal_app_db postgres << EOF
  INSERT INTO finance_category_type (name     )
  VALUES                            ('expense'),
                                    ('income' );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO finance_category (name       , "typeId")
  VALUES                       ('clothes'  , 1       ),
                               ('education', 1       ),
                               ('gifts'    , 1       ),
                               ('gifts'    , 2       ),
                               ('salary'   , 2       );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO finance_record (amount, date        , "isTrashed", "categoryId")
  VALUES                     (100   , '2022-08-01', TRUE       ,  1          ),
                             (400   , '2022-08-01', TRUE       ,  2          ),
                             (25    , '2022-08-01', FALSE      ,  2          ),
                             (30    , '2022-08-02', FALSE      ,  3          ),
                             (10    , '2022-08-02', FALSE      ,  3          ),
                             (230   , '2022-08-03', FALSE      ,  4          );
EOF



# Create testing database template.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_testing_template WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_testing_template WITH TEMPLATE personal_app_db ENCODING 'UTF-8';";



# Restore DB from dev template.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_db WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_db WITH TEMPLATE personal_app_dev_template ENCODING 'UTF-8';";
