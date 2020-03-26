#! /bin/bash

IMAGETAG="latest"

docker-compose down --volume --remove-orphans

echo "#############################################################################"
echo "##################### REMOVING THE CONTAINERS PRESENT #######################"
echo "#############################################################################"
docker rm -f $(docker ps -aq)

echo "#############################################################################"
echo "##################### REMOVING THE VOLUMES BE CAREFUL #######################"
echo "#############################################################################"
docker volume rm -f $(docker volume ls -aq)

echo "#############################################################################"
echo "##################### REMOVING THE CHANNEL ARTIFACTS ########################"
echo "#############################################################################"

cd ./channel-artifacts/
rm *
cd ..

docker run -v "$PWD":/tmp/certificationchannel --rm hyperledger/fabric-tools:"$IMAGETAG" rm -Rf /tmp/certificationchannel/ledgers-backup

 # docker rm -f $(docker ps -aq)

 docker rmi -f $(docker images dev-* -q)
