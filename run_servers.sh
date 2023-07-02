#!/bin/bash

# Get the current directory
DIR="$(pwd)"

LOG_DIR="$DIR/logs/"

# Check if the folder exists
if [ ! -d "$LOG_DIR" ]; then
  # Create the folder
  mkdir -p "$LOG_DIR"
  echo "Folder for logging created: $LOG_DIR"
fi


# Function to run npm install and npm start in a folder
run_commands() {
  folder=$1
  log_file="$LOG_DIR${folder##*/}_log.txt"  # Regular log file
  error_log_file="$LOG_DIR${folder##*/}_error_log.txt"  # Error log file

  if [[ ! -d "$folder/node_modules" ]]; then
    (cd "$folder" && npm install) >> "$log_file" 2>> "$error_log_file"
    if [ $? -eq 0 ]; then
      echo "$folder modules installed successfully"
    else
      echo "$folder encountered an error during module installation" >> "$error_log_file"
    fi
  fi

  (cd "$folder" && npm start) >> "$log_file" 2>> "$error_log_file" &
  if [ $? -eq 0 ]; then
    echo "$folder started successfully"
  else
    echo "$folder encountered an error during startup" >> "$error_log_file"
  fi
}
# Loop through each folder in the current directory
for folder in "$DIR"/*; do
  if [[ -d "$folder" && "${folder##*/}" != "logs" && "${folder##*/}" != "relatorio" ]]; then
    # Run the commands in a separate thread for each folder
    run_commands "$folder"
  fi
done

echo "All Done"

# Wait for all threads to finish
wait
