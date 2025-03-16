#!/bin/bash
set -e

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "DIR: $DIR"

# Load environment variables from .env file
if [ -f "$DIR/../.env" ]; then
  # Filter out comments and empty lines before exporting
  export $(grep -v '^#' "$DIR/../.env" | grep -v '^$' | xargs)
  echo ".env file sourced successfully"
else
  echo ".env file not found"
fi

# Set PostgreSQL connection parameters from environment variables
export PGHOST=${DB_HOST}
export PGDATABASE=rfk_central_dev #hardcoding this to prevent accidental seeding of production
export PGUSER=${DB_USER}
export PGPASSWORD=${DB_PASSWORD}
export PGSSLMODE=require

# Run the seed SQL file
echo "Seeding database $PGDATABASE on host $PGHOST..."
# Fix the psql command - remove -W flag and use PGPASSWORD env var
PGPASSWORD=${DB_PASSWORD} psql -h ${PGHOST} -d ${PGDATABASE} -U ${PGUSER} -f "$DIR/seed.sql"

echo "Database seeded successfully!"
