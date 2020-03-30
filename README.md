
# Red Cross ICO + Crowdsale

Generic code to automatically deploy the Red Cross' ICO & Crowdsale.

## Requirements

 - Docker installed
 - Infura Project ID
 - EtherScan API Key

## Setup
Clone this repository

    git clone https://github.com/marcbaque/redcross-ico.git
    cd redcross-ico

Set up .env file

    cp .env.example .env

Fill the required parameters in the .env file

    INFURA_PROJECT_ID=
    NETWORK_ID=
    PRIVATE_KEY=
    ETHERSCAN_API_KEY=
    
    TOKEN_NAME=Test 
    TOKEN_SYMBOL=
    TOKEN_DECIMALS=
    TOKEN_CAP=
    TOKEN_PREFUND_ADDRESS=
    TOKEN_PREFUND_AMOUNT=

Run the deploy script:

    bash scripts/deploy.sh

