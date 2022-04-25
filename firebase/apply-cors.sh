#!/usr/bin/env bash
set -euo pipefail
shopt -s inherit_errexit
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

site=$(jq -r <"$DIR/../firebase.json" .hosting.site)
echo "Applying CORS rules for $site..."

gsutil cors set "$DIR/cloud_storage_cors.json" "gs://$site.appspot.com"
