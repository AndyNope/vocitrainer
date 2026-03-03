#!/bin/bash

# Voci Trainer - Database Setup Script
# This script will create the database and import the schema

echo "========================================="
echo "  Voci Trainer - Database Setup"
echo "========================================="
echo ""

# Database credentials
DB_HOST="localhost"
DB_NAME="vocitrainer"
DB_USER="vocitrainer"
DB_PASS="Pixelgun3d!!"

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if mysql is available
if ! command -v mysql &> /dev/null; then
    echo "❌ Error: mysql command not found"
    echo "   Please install MySQL/MariaDB client"
    exit 1
fi

echo "📦 Importing database schema..."
echo ""

# Import schema
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < database/schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup successful!"
    echo ""
    echo "Next steps:"
    echo "  1. Start your web server (Apache/Nginx)"
    echo "  2. Open setup.html in your browser to test the connection"
    echo "  3. If everything works, open index.html to use the app"
    echo ""
else
    echo ""
    echo "❌ Error: Database import failed"
    echo ""
    echo "Please check:"
    echo "  - MySQL/MariaDB is running"
    echo "  - Database 'vocitrainer' exists"
    echo "  - User 'vocitrainer' has correct permissions"
    echo "  - Password is correct"
    echo ""
    exit 1
fi
