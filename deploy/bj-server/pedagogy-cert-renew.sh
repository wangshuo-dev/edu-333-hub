#!/bin/sh
set -eu

source_dir=/etc/letsencrypt/live/pedagogy.learnword.site
target_dir=/opt/1panel/apps/openresty/openresty/conf/ssl
container=1Panel-openresty-u0OK

install -m 0644 "$source_dir/fullchain.pem" "$target_dir/pedagogy-fullchain.pem"
install -m 0600 "$source_dir/privkey.pem" "$target_dir/pedagogy-privkey.pem"
docker exec "$container" openresty -t
docker exec "$container" openresty -s reload
