export PATH=${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}


CHANNEL_NAME="pharmachannel"

if [ -d "crypto-config" ]; then
  rm -Rf crypto-config
fi

echo "#########################################################"
echo "################### GENERATING CERTS ####################"
echo "#########################################################"

set -x
cryptogen generate --config=./crypto-config.yaml
res=$?
set +x
if [ $res -ne 0 ]; then
  echo 'Failed to generate certs..'
  exit 1
fi
echo

# Setting the fabric config PATH

echo "#################################################################"
echo "################### GENERATING GENESIS BLOCK ####################"
echo "#################################################################"

set -x
configtxgen -profile OrdererGenesis -channelID drug-sys-channel -outputBlock ./channel-artifacts/genesis.block
res=$?
set +x
if [ $res -ne 0 ]; then
  echo "Failed to create the genesis block"
fi
echo

echo "#################################################################"
echo "####### GENERATING CHANNEL CONFIGURATION TX #####################"
echo "#################################################################"

set -x
configtxgen -profile drugChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID "$CHANNEL_NAME"
res=$?
set +x
if [ $res -ne 0 ]; then
  echo "Failed to create the channel tx"
fi
echo

echo "#################################################################"
echo "######### GENERATING ANCHOR PEER UPDATE TX ######################"
echo "#################################################################"

set -x
configtxgen -profile drugChannel -outputAnchorPeersUpdate ./channel-artifacts/manufacturerMSPanchor.tx -channelID "$CHANNEL_NAME" -asOrg manufacturerMSP
res=$?
set +x
if [ $res -ne 0 ]; then
  echo "Update transaction not successful"
fi
echo

echo "#################################################################"
echo "######### GENERATING ANCHOR PEER UPDATE TX ######################"
echo "#################################################################"

set -x
configtxgen -profile drugChannel -outputAnchorPeersUpdate ./channel-artifacts/transporterMSPanchor.tx -channelID "$CHANNEL_NAME" -asOrg transporterMSP
res=$?
set +x
if [ $res -ne 0 ]; then
  echo "Update transaction not successful"
fi
echo

# echo "#################################################################"
# echo "######### GENERATING ANCHOR PEER UPDATE TX ######################"
# echo "#################################################################"
#
# set -x
# configtxgen -profile drugChannel -outputAnchorPeersUpdate ./channel-artifacts/retailerMSPanchor.tx -channelID "$CHANNEL_NAME" -asOrg retailerMSP
# res=$?
# set +x
# if [ res -ne 0 ]; then
#   echo "Update transaction not successful"
# fi
# echo

# echo "#################################################################"
# echo "######### GENERATING ANCHOR PEER UPDATE TX ######################"
# echo "#################################################################"
#
# set -x
# configtxgen -profile drugChannel -outputAnchorPeersUpdate ./channel-artifacts/consumerMSPanchor.tx -channelID "$CHANNEL_NAME" -asOrg consumerMSP
# res=$?
# set +x
# if [ res -ne 0 ]; then
#   echo "Update transaction not successful"
# fi
# echo

echo "#################################################################"
echo "######### GENERATING ANCHOR PEER UPDATE TX ######################"
echo "#################################################################"

set -x
configtxgen -profile drugChannel -outputAnchorPeersUpdate ./channel-artifacts/distributorMSPanchor.tx -channelID "$CHANNEL_NAME" -asOrg distributorMSP
res=$?
set +x
if [ $res -ne 0 ]; then
  echo "Update transaction not successful"
fi
echo
