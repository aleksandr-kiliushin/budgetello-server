#!/bin/bash

# Create dev database template from current personal_app_db state.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_dev_template WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_dev_template WITH TEMPLATE personal_app_db ENCODING 'UTF-8';";



# Clear database tables.
psql personal_app_db postgres << EOF
  TRUNCATE
  activity_category,
  activity_category_measurement_type,
  activity_record,
  budget_category,
  budget_category_type,
  budget_record,
  board,
  board_subject,
  currency,
  "user",
  user_administrated_boards_board,
  user_participated_boards_board
  CASCADE;
EOF
# Reset tables primary key sequence.
psql personal_app_db postgres << EOF
  ALTER SEQUENCE activity_category_id_seq RESTART WITH 1;
  ALTER SEQUENCE activity_category_measurement_type_id_seq RESTART WITH 1;
  ALTER SEQUENCE activity_record_id_seq RESTART WITH 1;
  ALTER SEQUENCE budget_category_id_seq RESTART WITH 1;
  ALTER SEQUENCE budget_category_type_id_seq RESTART WITH 1;
  ALTER SEQUENCE budget_record_id_seq RESTART WITH 1;
  ALTER SEQUENCE board_id_seq RESTART WITH 1;
  ALTER SEQUENCE board_subject_id_seq RESTART WITH 1;
  ALTER SEQUENCE user_id_seq RESTART WITH 1;
EOF



# Seed database with testing data.
psql personal_app_db postgres << EOF
  INSERT INTO "user" ("username",      "password"                                    )
  VALUES             ('john-doe',      '8bd309ffba83c3db9a53142b052468007b'          ),
                     ('jessica-stark', '8bd912e2fe84cd93c457142a1d7e77136c3bc954f183');
EOF
psql personal_app_db postgres << EOF
  INSERT INTO currency ("name", "slug", "symbol")
  VALUES               ('GEL' , 'gel' , '₾'     ),
                       ('USD' , 'usd' , '$'     );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO board_subject ("name"      )
  VALUES                    ('budget'    ),
                            ('activities');
EOF
psql personal_app_db postgres << EOF
  INSERT INTO board ("name"               , "subjectId", "defaultCurrencySlug")
  VALUES            ('clever-budgetiers'  , 1          , 'gel'                ),
                    ('mega-economists'    , 1          , 'usd'                ),
                    ('beautiful-sportsmen', 2          , NULL                 ),
                    ('productive-people'  , 2          , NULL                 );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO user_participated_boards_board ("userId", "boardId")
  VALUES                                     (1       , 1        ),
                                             (2       , 1        ),
                                             (2       , 2        ),
                                             (2       , 3        ),
                                             (1       , 4        ),
                                             (2       , 4        );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO user_administrated_boards_board ("userId", "boardId")
  VALUES                                      (1       , 1        ),
                                              (2       , 2        ),
                                              (2       , 3        ),
                                              (1       , 4        );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO budget_category_type ("name"   )
  VALUES                           ('expense'),
                                   ('income' );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO budget_category ("name"     , "typeId", "boardId")
  VALUES                      ('clothes'  , 1       , 1        ),
                              ('education', 1       , 1        ),
                              ('gifts'    , 1       , 2        ),
                              ('gifts'    , 2       , 2        ),
                              ('salary'   , 2       , 2        );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO budget_record ("amount", "authorId", "categoryId", "date"      , "comment"                    , "currencySlug", "isTrashed")
  VALUES                    (100     , 1         , 1           , '2022-08-01', 'I really need it.'          , 'usd'         , TRUE       ),
                            (400     , 2         , 2           , '2022-08-01', 'A gift for John Doe.'       , 'usd'         , TRUE       ),
                            (25      , 1         , 2           , '2022-08-01', ''                           , 'usd'         , FALSE      ),
                            (30      , 2         , 3           , '2022-08-02', ''                           , 'gel'         , FALSE      ),
                            (10.5    , 2         , 3           , '2022-08-02', 'I did not plan to buy that.', 'gel'         , FALSE      ),
                            (230     , 2         , 4           , '2022-08-03', 'I bought it with 40% off.'  , 'gel'         , FALSE      );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO activity_category_measurement_type ("name"        )
  VALUES                                         ('quantitative'),
                                                 ('boolean'     );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO activity_category ("name"     , "boardId", "measurementTypeId", "ownerId", "unit")
  VALUES                        ('running'  , 3        , 1                  , 2        , 'km'  ),
                                ('pushups'  , 3        , 1                  , 2        , 'time'),
                                ('no sweets', 3        , 2                  , 2        , NULL  ),
                                ('sleep'    , 3        , 1                  , 2        , 'hour'),
                                ('reading'  , 4        , 1                  , 1        , 'page'),
                                ('meditate' , 4        , 1                  , 2        , 'min' );
EOF
psql personal_app_db postgres << EOF
  INSERT INTO activity_record ("booleanValue", "comment"              , "date"      , "quantitativeValue", "categoryId")
  VALUES                      (NULL          , ''                     , '2022-08-01', 3.5                , 1           ),
                              (NULL          , ''                     , '2022-08-01', 50                 , 2           ),
                              (true          , 'it was easy today'    , '2022-08-01', NULL               , 3           ),
                              (NULL          , ''                     , '2022-08-02', 7.25               , 4           ),
                              (NULL          , 'Read chapter about DB', '2022-08-02', 6                  , 5           ),
                              (NULL          , 'running in hills'     , '2022-08-03', 4                  , 1           ),
                              (NULL          , ''                     , '2022-08-03', 10                 , 6           );
EOF



# Create testing database template.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_testing_template WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_testing_template WITH TEMPLATE personal_app_db ENCODING 'UTF-8';";



# Restore DB from testing template.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_db WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_db WITH TEMPLATE personal_app_testing_template ENCODING 'UTF-8';";
