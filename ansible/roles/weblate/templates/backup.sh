#!/usr/bin/env bash

. /home/ansible/weblate-backup/env.sh
restic backup /var/lib/docker/volumes/weblate-docker_weblate-data/_data
