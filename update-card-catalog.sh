#!/bin/bash
mkdir -p ./assets
echo "Fetching Oracle bulk data..."
url=$(curl https://api.scryfall.com/bulk-data | jq -r '.data[] | select(.type=="oracle_cards").download_uri')
"$url"
curl -o ./assets/data.json "$url"
echo "Oracle bulk data fetched."
echo "Creating card catalogs for each format..."
jq -s -c 'map(.[] | select(.legalities.standard=="legal") | .name)' ./assets/data.json > ./assets/standard.json
jq -s -c 'map(.[] | select(.legalities.pauper=="legal") | .name)' ./assets/data.json > ./assets/pauper.json
jq -s -c 'map(.[] | select(.legalities.pioneer=="legal") | .name)' ./assets/data.json > ./assets/pioneer.json
jq -s -c 'map(.[] | select(.legalities.modern=="legal") | .name)' ./assets/data.json > ./assets/modern.json
jq -s -c 'map(.[] | select(.legalities.legacy=="legal") | .name)' ./assets/data.json > ./assets/legacy.json
jq -s -c 'map(.[] | select(.legalities.vintage=="legal") | .name)' ./assets/data.json > ./assets/vintage.json
echo "Card catalogs completed."
rm -fv ./assets/data.json