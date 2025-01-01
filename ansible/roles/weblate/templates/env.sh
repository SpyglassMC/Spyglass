#!/usr/bin/env bash

export AWS_ACCESS_KEY_ID="{{ weblate_backup_s3_id }}"
export AWS_SECRET_ACCESS_KEY="{{ weblate_backup_s3_secret }}"
export RESTIC_PASSWORD="{{ weblate_backup_password }}"
export RESTIC_REPOSITORY="s3:{{ weblate_backup_s3_endpoint }}"
