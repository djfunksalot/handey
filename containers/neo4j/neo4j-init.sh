#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# do not run init script at each container strat but only at the first start
if [ ! -f /tmp/neo4j-import-done.flag ]; then
#    /var/lib/neo4j/bin/neo4j-admin neo4j-admin restore --from=<backup-directory mount as a docker volume under /neo4j-data> [--database=<name>] [--force[=<true|false>]]
    touch /tmp/neo4j-import-done.flag
else
    echo "The import has already been made."
fi
