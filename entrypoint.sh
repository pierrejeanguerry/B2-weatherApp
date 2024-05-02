#!/bin/bash
# create or update db
./wait-for-it.sh mariadb:3306 -t 30
symfony console doctrine:migrations:migrate --no-interaction --allow-no-migration
symfony console doctrine:fixture:load --no-interaction

# start symfony
symfony server:start -no-tls