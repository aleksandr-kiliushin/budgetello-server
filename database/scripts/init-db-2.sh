#!/bin/bash

# Create dev database template from current personal_app_db state.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_dev_template WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_dev_template WITH TEMPLATE personal_app_db ENCODING 'UTF-8';";



# Clear database tables.
psql personal_app_db postgres << EOF
  TRUNCATE
  budgeting_category,
  budgeting_category_type,
  budgeting_record,
  board,
  board_subject,
  "user",
  user_administrated_boards_board,
  user_boards_board
  CASCADE;
EOF
# Reset tables primary key sequence.
psql personal_app_db postgres << EOF
  ALTER SEQUENCE budgeting_category_id_seq RESTART WITH 1;
  ALTER SEQUENCE budgeting_category_type_id_seq RESTART WITH 1;
  ALTER SEQUENCE budgeting_record_id_seq RESTART WITH 1;
  ALTER SEQUENCE board_id_seq RESTART WITH 1;
  ALTER SEQUENCE board_subject_id_seq RESTART WITH 1;
  ALTER SEQUENCE user_id_seq RESTART WITH 1;
EOF



# Seed database with testing data.
psql personal_app_db postgres << EOF
  INSERT INTO "user" (username,        password                                      )
  VALUES             ('john-doe',      '8bd309ffba83c3db9a53142b052468007b'          ),
                     ('jessica-stark', '8bd912e2fe84cd93c457142a1d7e77136c3bc954f183');
EOF
psql personal_app_db postgres << EOF
  INSERT INTO board_subject (name        )
  VALUES                    ('budgeting' ),
                            ('activities');
EOF
psql personal_app_db postgres << EOF
  INSERT INTO board (name                 , "subjectId")
  VALUES            ('clever-budgetiers'  , 1          ),
                    ('mega-economists'    , 1          ),
                    ('beautiful-sportsmen', 2          ),
                    ('productive-people'  , 2          );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO user_boards_board ("userId", "boardId")
  VALUES                        (1       , 1         ),
                                (2       , 1         ),
                                (2       , 2         ),
                                (2       , 3         ),
                                (1       , 4         ),
                                (2       , 4         );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO user_administrated_boards_board ("userId", "boardId")
  VALUES                                      (1       , 1        ),
                                              (2       , 2        ),
                                              (2       , 3        ),
                                              (1       , 4        );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO budgeting_category_type (name     )
  VALUES                              ('expense'),
                                      ('income' );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO budgeting_category (name       , "typeId", "boardId")
  VALUES                         ('clothes'  , 1       , 1        ),
                                 ('education', 1       , 1        ),
                                 ('gifts'    , 1       , 2        ),
                                 ('gifts'    , 2       , 2        ),
                                 ('salary'   , 2       , 2        );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO budgeting_record (amount, date        , "isTrashed", "categoryId")
  VALUES                       (100   , '2022-08-01', TRUE       ,  1          ),
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
