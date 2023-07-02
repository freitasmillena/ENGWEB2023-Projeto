#!/bin/bash

# Run the generator command
echo "Running DB generator..."
./generator.py 10000 FrontEnd/public/fileStorage data.json
echo "Done"

# Import entries_data.json
echo "Importing entries_data.json to \'recursos\' collection..."
mongoimport -d recursos -c recursos --file entries_data.json --jsonArray
rm -f entries_data.json
echo "Done"

# Import groups_data.json
echo "Importing groups_data.json to \'groups\' collection..."
mongoimport -d recursos -c groups --file groups_data.json --jsonArray
rm -f groups_data.json
echo "Done"

# Import users_data.json
echo "Importing users_data.json to \'users\' collection..."
mongoimport -d authProject -c users --file users_data.json --jsonArray
rm -f users_data.json
echo "Done"

# Import categories_data.json
echo "Importing categories_data.json to \'categorias\' collection..."
mongoimport -d recursos -c categorias --file categories_data.json --jsonArray
rm -f categories_data.json
echo "Done"

# Run the run_servers.sh script
echo "Running Servers..."
./run_servers.sh
echo "Exiting"