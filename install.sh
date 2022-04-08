#!/bin/bash
#
# Taken from: https://github.com/timlucmiptev/btc-agents/blob/master/install.sh
# by ~timluc-miptev
#
usage() { printf "Usage: $0 [-w] URBIT_DESK_DIRECTORY  \n(-w: flag to watch and live copy code)\n" 1>&2; exit 1; }

if [ $# -eq 0 ]; then
    usage
    exit 2
fi
DESK=$1
EXCLUDE_FILE=config/ignore_files_on_install.txt

while getopts "w" opt; do
    case ${opt} in
        w) WATCH_MODE="true"
           DESK=$2
           ;;
        *) usage
           ;;
    esac
done

if [ -z "$WATCH_MODE" ]; then
    echo "Installed %astrolabe"
    rm -r $DESK/*
    rsync -r --copy-links --exclude-from=$EXCLUDE_FILE ./base-desk/* $DESK/
    rsync -r --copy-links --exclude-from=$EXCLUDE_FILE ./docs-dev-desk/* $DESK/
    rsync -r --copy-links --exclude-from=$EXCLUDE_FILE ./desk/* $DESK/

else
    echo "Watching for changes to copy to ${DESK}..."
    rm -r $DESK/*
    while [ 0 ]
    do
        sleep 0.8
        rsync -r --copy-links --exclude-from=$EXCLUDE_FILE ./base-desk/* $DESK/
        rsync -r --copy-links --exclude-from=$EXCLUDE_FILE ./docs-dev-desk/* $DESK/
        rsync -r --copy-links --exclude-from=$EXCLUDE_FILE ./desk/* $DESK/

    done
fi
ls