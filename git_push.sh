#!/bin/bash

# Cek apakah ada parameter masuk
if [ $# -eq 0 ]; then
    echo "Usage: $0 <commit_message>"
    exit 1
fi

git add .
git commit -m "$*"
build_output=$(git pull 2>&1)
if echo "$build_output" | grep -qi "CONFLICT"; then
    echo "$bracket"
    echo "# Kode ada yang konflik broo !!"
    echo ""
    echo "$build_output"
    exit 1
fi
git push
