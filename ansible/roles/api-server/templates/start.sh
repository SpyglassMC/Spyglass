#!/usr/bin/env bash

export NODE_ENV="production"
export SPYGLASSMC_API_SERVER_BUNNY_CDN_API_KEY="{{ api_server_bunny_cdn_api_key }}"
export SPYGLASSMC_API_SERVER_BUNNY_CDN_PULL_ZONE_ID="{{ api_server_bunny_cdn_pull_zone_id }}"
export SPYGLASSMC_API_SERVER_DIR="/var/lib/api-server"
export SPYGLASSMC_API_SERVER_DISCORD_LOG_WEBHOOK="{{ api_server_discord_log_webhook }}"
export SPYGLASSMC_API_SERVER_WEBHOOK_SECRET="{{ api_server_webhook_secret }}"
export SPYGLASSMC_API_SERVER_PORT="{{ api_server_port }}"

/usr/local/bin/spyglassmc-web-api-server
