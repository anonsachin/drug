#!/usr/bin/env bash

IMAGETAG="latest"

IMAGE_TAG=$IMAGETAG docker-compose -f docker-compose.yml up -d

docker ps -a

sleep 1
echo "Waiting for all the containers to set up"
sleep 15

echo "#############################################################################"
echo "###################### CREATING CHANNEL AND JOINING #########################"
echo "#############################################################################"

docker exec cli scripts/requirements.sh

echo "#############################################################################"
echo "########################## UPDATING ANCHORPEERS #############################"
echo "#############################################################################"

docker exec cli scripts/update.sh
