#!/bin/bash
#
# Taken from: https://github.com/timlucmiptev/btc-agents/blob/master/install.sh
# by ~timluc-miptev
#
usage() { printf "Usage: $0 [-w] [-g] URBIT_DESK_DIRECTORY\n(-w: flag to watch and live copy code)\n(-g: install built ui to globber desk)\n" 1>&2; exit 1; }

cdir=$(dirname $0)

if [ $# -eq 0 ]; then
    usage
    exit 2
fi
DESK=${@: -1}
EXCLUDE_FILE="${cdir}"/../config/ignore_files_on_install.txt

while getopts "wg" opt; do
    case ${opt} in
        w) WATCH_MODE="true"
           ;;
        g) GLOBBER="true"
           ;;
        *) usage
           ;;
    esac
done
DESK="${DESK//\~/$HOME}"
if [ -z "$WATCH_MODE" ]; then
    echo "Installed %astrolabe to ${DESK}"
    rm -r $DESK/*
    rsync -r --copy-links --exclude-from=$EXCLUDE_FILE "${cdir}"/../base-desk/* $DESK/
    rsync -r --copy-links --exclude-from=$EXCLUDE_FILE "${cdir}"/../docs-dev-desk/* $DESK/
    rsync -r --copy-links --exclude-from=$EXCLUDE_FILE "${cdir}"/../desk/* $DESK/
    if [ "$GLOBBER" ]; then
        rsync -r --copy-links "${cdir}"/../ui/dist/* $DESK/astrolabe
    fi
else
    echo "Watching for changes to copy to ${DESK}..."
    rm -r $DESK/*
    while [ 0 ]
    do
        sleep 0.8
        rsync -r --copy-links --exclude-from=$EXCLUDE_FILE "${cdir}"/../base-desk/* $DESK/
        rsync -r --copy-links --exclude-from=$EXCLUDE_FILE "${cdir}"/../docs-dev-desk/* $DESK/
        rsync -r --copy-links --exclude-from=$EXCLUDE_FILE "${cdir}"/../desk/* $DESK/
        if [ "$GLOBBER" ]; then
            echo "heheh"
            rsync -r --copy-links "${cdir}"/../ui/dist/* $DESK/astrolabe
        fi
    done
fi
