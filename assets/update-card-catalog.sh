#!/bin/bash
url=$(curl https://api.scryfall.com/bulk-data | jq -r '.data[] | select(.type=="oracle_cards").download_uri')
"$url"
curl -o data.json "$url"
jq -s 'map(.[] | select(.legalities.standard=="legal") | .name)' data.json > standard.json
jq -s 'map(.[] | select(.legalities.pauper=="legal") | .name)' data.json > pauper.json
jq -s 'map(.[] | select(.legalities.pioneer=="legal") | .name)' data.json > pioneer.json
jq -s 'map(.[] | select(.legalities.modern=="legal") | .name)' data.json > modern.json
jq -s 'map(.[] | select(.legalities.legacy=="legal") | .name)' data.json > legacy.json
jq -s 'map(.[] | select(.legalities.vintage=="legal") | .name)' data.json > vintage.json
rm -f ./data.json