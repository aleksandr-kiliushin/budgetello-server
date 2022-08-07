#!/bin/bash

psql personal_app_testing_template postgres << EOF
  INSERT INTO "user" (username,        password                                                         )
  VALUES             ('john-doe',      '\$2b\$10\$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i'),
                     ('jessica-stark', '\$2b\$10\$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC');
EOF

psql personal_app_testing_template postgres << EOF
  INSERT INTO finance_category_type (name     )
  VALUES                            ('expense'),
                                    ('income' );
EOF

psql personal_app_testing_template postgres << EOF
  INSERT INTO finance_category (name       , "typeId")
  VALUES                       ('clothes'  , 1       ),
                               ('education', 1       ),
                               ('gifts'    , 1       ),
                               ('gifts'    , 2       ),
                               ('salary'   , 2       );
EOF

psql personal_app_testing_template postgres << EOF
  INSERT INTO finance_record (amount, date        , "isTrashed", "categoryId")
  VALUES                     (100   , '2022-08-01', TRUE       ,  1          ),
                             (400   , '2022-08-01', TRUE       ,  2          ),
                             (25    , '2022-08-01', FALSE      ,  2          ),
                             (30    , '2022-08-02', FALSE      ,  3          ),
                             (10    , '2022-08-02', FALSE      ,  3          ),
                             (230   , '2022-08-03', FALSE      ,  4          );
EOF
