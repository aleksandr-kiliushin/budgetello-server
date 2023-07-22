#!/bin/bash

# Create testing database template.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_db WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_db ENCODING 'UTF-8';";

npm --prefix /var/app run migration:up;

# Seed database with testing data.
psql personal_app_db postgres << EOF
  INSERT INTO "user" ("username",      "password"                                    )
  VALUES             ('john-doe',      '92e2f84ba541757bdc4e1cfcf113aa4b38'          ),
                     ('jessica-stark', '92e8e356e1467b33824a1cfde949b5582fef65e04fb9');
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

# Create testing database template.
psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_testing_template WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_testing_template WITH TEMPLATE personal_app_db ENCODING 'UTF-8';";
