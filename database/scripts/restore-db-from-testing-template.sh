#!/bin/bash

psql -U postgres -c "DROP DATABASE IF EXISTS budgetello_db WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE budgetello_db WITH TEMPLATE budgetello_testing_template ENCODING 'UTF-8';";
