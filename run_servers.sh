#!/bin/bash

# Get the current directory
DIR="$(pwd)"

# Function to run npm install and npm start in a folder
run_commands() {
  folder=$1
  log_file="${folder##*/}_log.txt"  # Extract folder name for the log file
  if [[ ! -d "$folder/node_modules" ]]; then
    (cd "$folder" && npm install) >> "$log_file" 2>&1
    echo "$folder modules installed successfully"
  fi
  (cd "$folder" && npm start) >> "$log_file" 2>&1 &
  echo "$folder started successfully"
}

# Loop through each folder in the current directory
for folder in "$DIR"/*; do
  if [[ -d "$folder" ]]; then
    # Run the commands in a separate thread for each folder
    run_commands "$folder"
  fi
done

# Wait for all threads to finish
wait
