#!/usr/bin/env bash

NAME=
PORT=

su git
pm2 start bin/www --name "$NAME [$PORT]"
pm2 save

cd /etc/nginx/sites-available
sudo nano "$NAME.api"

sudo ln -nfs "/etc/nginx/sites-available/$NAME.api" "/etc/nginx/sites-enabled/$NAME.api"

sudo nginx -t

sudo nginx -s reload
