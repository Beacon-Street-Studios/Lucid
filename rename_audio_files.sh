#!/bin/bash

# Directories to process
directories=(
  "audio/HUMANITY/SWELL"
  "audio/HUMANITY/CHIME"
  "audio/HUMANITY/MELODY"
  "audio/HUMANITY/PERCUSSION"
)

# Process each directory
for dir in "${directories[@]}"; do
  echo "Processing directory: $dir"
  
  # Find all files containing "vision" in the name and rename them
  for file in "$dir"/bss_lucid_*_vision_*.wav; do
    if [ -f "$file" ]; then
      new_file="${file/_vision_/_humanity_}"
      echo "Renaming $file to $new_file"
      mv "$file" "$new_file"
    fi
  done
done

echo "Renaming complete!"
