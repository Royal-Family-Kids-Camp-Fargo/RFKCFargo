#!/bin/bash

script_dir=$(realpath $(dirname "$0"))

# Source the .env file
if [ -f "$script_dir/../.env" ]; then
  export $(cat "$script_dir/../.env" | xargs)
  echo ".env file sourced successfully"
else
  echo ".env file not found"
fi

# Construct the JDBC URL
jdbc_url="jdbc:postgresql://${DB_HOST}:5432/${DB_NAME}?sslmode=${DB_SSL_MODE}"

# Run Liquibase command in Docker container
case "$1" in
    update)
        docker run --rm --user root -v $script_dir:/liquibase/changelog \
        -e LIQUIBASE_COMMAND_CHANGELOG_FILE=master.xml \
        -e LIQUIBASE_SEARCH_PATH=/liquibase/changelog/changelog \
        liquibase/liquibase \
        --url=$jdbc_url --username=$DB_USER --password=$DB_PASSWORD update 
        ;;
    rollback)
        count=${2:-1}  # Default to 1 if no count is provided
        docker run --rm --user root -v $script_dir:/liquibase/changelog \
        -e LIQUIBASE_COMMAND_CHANGELOG_FILE=master.xml \
        -e LIQUIBASE_SEARCH_PATH=/liquibase/changelog/changelog \
        liquibase/liquibase \
        --url=$jdbc_url --username=$DB_USER --password=$DB_PASSWORD rollback-count $count
        ;;
    sync)
        docker run --rm --user root -v $script_dir:/liquibase/changelog \
        -e LIQUIBASE_COMMAND_CHANGELOG_FILE=master.xml \
        -e LIQUIBASE_SEARCH_PATH=/liquibase/changelog/changelog \
        liquibase/liquibase \
        --url=$jdbc_url --username=$DB_USER --password=$DB_PASSWORD changelogSync
        ;;
    clear)
        docker run --rm --user root -v $script_dir:/liquibase/changelog \
        -e LIQUIBASE_COMMAND_CHANGELOG_FILE=master.xml \
        -e LIQUIBASE_SEARCH_PATH=/liquibase/changelog/changelog \
        liquibase/liquibase \
        --url=$jdbc_url --username=$DB_USER --password=$DB_PASSWORD clearCheckSums
        ;;
    generate)
        latest_file=$(ls -t $script_dir/changelog | head -n 1)
        echo "Latest file in $script_dir/changelog is: $latest_file"
        base_name=$(basename "$latest_file" .xml)
        new_file_name=$((base_name + 1)).xml
        echo "New file name will be: $new_file_name"
        
        docker run --rm --user root -v $script_dir:/liquibase/changelog liquibase/liquibase \
        --url=$jdbc_url --username=$DB_USER --password=$DB_PASSWORD generateChangeLog \
        --changeLogFile=changelog/changelog/$new_file_name
        ;;
    *)
        echo "Invalid command. Use 'update' or 'rollback' or 'generate'"
        ;;
esac

if [ "$NLAPI_DB_NAME" = "production" ]; then
    tenantid=10141
else
    tenantid=10142
fi

# Post to https://api.devii.io/auth with env vars as login and password payload params
auth_response=$(curl -s -X POST https://api.devii.io/auth \
    -H "Content-Type: application/json" \
    -d "{\"login\": \"$DEVII_LOGIN\", \"password\": \"$DEVII_PASSWORD\", \"tenantid\": $tenantid}")

# Save the returned access_token
access_token=$(echo $auth_response | jq -r '.access_token')

# Use the access_token in the next curl
response=$(curl -s -X POST https://api.devii.io/roles_pbac \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $access_token" \
    -d '{
        "variables": {},
        "query": "{\n  Utility {\n    introspect\n    available_schemas_and_tables\n    __typename\n  }\n}"
    }')

# Check if response contains 'data' key and print message
if echo "$response" | jq -e '.data' > /dev/null; then
    echo "Introspection was successful."
fi


# Unset environment variables
if [ -f "$script_dir/../.env" ]; then
  while IFS= read -r line; do
    var_name=$(echo "$line" | cut -d '=' -f 1)
    unset "$var_name"
  done < "$script_dir/../.env"
fi

exit 1