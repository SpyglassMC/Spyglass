#!/usr/bin/env bash

export SPYGLASSMC_API_SERVER_DIR="/var/lib/api-server"
export SPYGLASSMC_API_SERVER_WEBHOOK_SECRET="{{ api_server_webhook_secret }}"
export SPYGLASSMC_API_SERVER_PORT="{{ api_server_port }}"

/usr/local/bin/spyglassmc-web-api-server
