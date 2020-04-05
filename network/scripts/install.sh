#! /bin/bash

CHAINCODE_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/"
CHAINCODE_NAME="pharmanet"
CHANNEL_NAME="pharmachannel"
DELAY=5

setGlobals(){
  ORG=$1
  PEER=$2
  if [ "$ORG" == 'manufacturer' ]; then
    CORE_PEER_LOCALMSPID="manufacturerMSP"
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.drug-network.com/users/Admin@manufacturer.drug-network.com/msp
    if [ "$PEER" -eq 0 ]; then
      CORE_PEER_ADDRESS=peer0.manufacturer.drug-network.com:7051
    else
      CORE_PEER_ADDRESS=peer1.manufacturer.drug-network.com:8051
    fi
  elif [ "$ORG" == 'distributor' ]; then
    CORE_PEER_LOCALMSPID="distributorMSP"
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/distributor.drug-network.com/users/Admin@distributor.drug-network.com/msp
    if [ "$PEER" -eq 0 ]; then
      CORE_PEER_ADDRESS=peer0.distributor.drug-network.com:9051
    else
      CORE_PEER_ADDRESS=peer1.distributor.drug-network.com:10051
    fi
  elif [ "$ORG" == 'retailer' ]; then
    CORE_PEER_LOCALMSPID="retailerMSP"
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.drug-network.com/users/Admin@retailer.drug-network.com/msp
    if [ "$PEER" -eq 0 ]; then
      CORE_PEER_ADDRESS=peer0.retailer.drug-network.com:13051
    else
      CORE_PEER_ADDRESS=peer1.retailer.drug-network.com:14051
    fi
  elif [ "$ORG" == 'transporter' ]; then
    CORE_PEER_LOCALMSPID="transporterMSP"
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/transporter.drug-network.com/users/Admin@transporter.drug-network.com/msp
    if [ "$PEER" -eq 0 ]; then
      CORE_PEER_ADDRESS=peer0.transporter.drug-network.com:11051
    else
      CORE_PEER_ADDRESS=peer1.transporter.drug-network.com:12051
    fi
  elif [ "$ORG" == 'consumer' ]; then
    CORE_PEER_LOCALMSPID="consumerMSP"
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/consumer.drug-network.com/users/Admin@consumer.drug-network.com/msp
    if [ "$PEER" -eq 0 ]; then
      CORE_PEER_ADDRESS=peer0.consumer.drug-network.com:15051
    else
      CORE_PEER_ADDRESS=peer1.consumer.drug-network.com:16051
    fi
  else
    echo "Not a valid peerOrganization"
  fi
}

# install chaincode

ORGS="manufacturer transporter distributor retailer consumer"

for iG in $ORGS; do
  for p in 0 1; do
    setGlobals $iG $p
    echo "##################################################################################"
    echo "################# INSTALLING CHAINCODE FOR $CORE_PEER_LOCALMSPID ####################"
    echo "##################################################################################"
    echo
    echo "###################### UPDATING PEER $p #########################"
    set -x
    peer chaincode install -n $CHAINCODE_NAME -v 1.0 -l node -p "${CHAINCODE_PATH}"
    res=$?
    set +x
    if [ $res -ne 0 ]; then
      echo "Failed peer update"
    fi
    sleep $DELAY
  done
done

#  instantiate chaincode

setGlobals "manufacturer" 0

echo "##################################################################################"
echo "################# INSTALLING CHAINCODE ON $CORE_PEER_LOCALMSPID ####################"
echo "##################################################################################"

set -x
peer chaincode instantiate -o orderer.drug-network.com:7050 -C $CHANNEL_NAME -n $CHAINCODE_NAME -v 1.0 -c '{"Args":["org.drug-network.pharmanet.common:instantiate"]}' -P "OR ('manufacturerMSP.member','distributorMSP.member','transporterMSP.member','retailerMSP.member','consumerMSP.member')"
res=$?
set +x
if [ $res -ne 0 ]; then
  echo 'FAILED TO instantiate'
fi
