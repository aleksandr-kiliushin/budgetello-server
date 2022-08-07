#!/bin/bash

psql -U postgres -c "DROP DATABASE IF EXISTS personal_app_db WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE personal_app_db WITH TEMPLATE personal_app_testing_template ENCODING 'UTF-8';";
