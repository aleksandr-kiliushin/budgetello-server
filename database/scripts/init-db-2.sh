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
  groups,
  groups_subjects,
  "user"
  CASCADE;
EOF
# Reset tables primary key sequence.
psql personal_app_db postgres << EOF
  ALTER SEQUENCE finance_category_id_seq RESTART WITH 1;
  ALTER SEQUENCE finance_category_type_id_seq RESTART WITH 1;
  ALTER SEQUENCE finance_record_id_seq RESTART WITH 1;
  ALTER SEQUENCE groups_id_seq RESTART WITH 1;
  ALTER SEQUENCE groups_subjects_id_seq RESTART WITH 1;
  ALTER SEQUENCE user_id_seq RESTART WITH 1;
EOF



# Seed database with testing data.
psql personal_app_db postgres << EOF
  INSERT INTO "user" (username,        password                                      )
  VALUES             ('john-doe',      '8bd309ffba83c3db9a53142b052468007b'          ),
                     ('jessica-stark', '8bd912e2fe84cd93c457142a1d7e77136c3bc954f183');
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
psql personal_app_db postgres << EOF
  INSERT INTO groups_subjects (name      )
  VALUES                      ('finances'),
                              ('habits'  );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO groups (name                 , "subjectId")
  VALUES             ('clever-financiers'  , 1          ),
                     ('beautiful-sportsmen', 2          );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO user_groups_groups ("userId", "groupsId")
  VALUES                         (1       , 1         ),
                                 (1       , 2         ),
                                 (2       , 2         );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO user_administrated_groups_groups ("userId", "groupsId")
  VALUES                                       (1       , 1         ),
                                               (2       , 2         );
EOF



# Create testing database template.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_testing_template WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_testing_template WITH TEMPLATE personal_app_db ENCODING 'UTF-8';";



# Restore DB from dev template.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_db WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_db WITH TEMPLATE personal_app_dev_template ENCODING 'UTF-8';";
