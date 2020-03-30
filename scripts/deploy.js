require('dotenv').config()

const { verify, getInfuraUrl } = require('./utils');

// Preparing wallet and web3 endpoint (Infura based)
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const provider = new HDWalletProvider(process.env.PRIVATE_KEY, getInfuraUrl());
const web3 = new Web3(provider);
var BigNumber = web3.utils.BN;

// Reading smart contracts to be deployed (Single-file-based)
var fs = require('fs');

const tokenABI = JSON.parse(fs.readFileSync('./abi/Token.abi', 'utf8'));
const tokenBIN  = fs.readFileSync('./bin/Token.bin', 'utf8');
const tokenSourceCode = fs.readFileSync('./contracts/Token.sol', 'utf8');

(async () => {

	const accounts = await web3.eth.getAccounts();

	console.log(`Attempting to deploy from account: ${accounts[0]}`);


    // Deploying ERC20 Token
	const deployedToken = await new web3.eth.Contract(tokenABI)
		.deploy({
			data: '0x' + tokenBIN.toString(),
            arguments: [new BigNumber(10).pow(new BigNumber(process.env.TOKEN_DECIMALS)).mul(new BigNumber(process.env.TOKEN_CAP)), 
                web3.utils.toChecksumAddress(process.env.TOKEN_PREFUND_ADDRESS), 
                new BigNumber(10).pow(new BigNumber(process.env.TOKEN_DECIMALS)).mul(new BigNumber(process.env.TOKEN_PREFUND_AMOUNT)), 
                process.env.TOKEN_NAME, 
                process.env.TOKEN_SYMBOL, 
                process.env.TOKEN_DECIMALS]
        })
        .send({ from: accounts[0] });

    console.log(`Token was deployed at address: ${deployedToken.options.address}`);

    // Verify ERC20 Token contract
    verify(process.env.ETHERSCAN_API_KEY, 
            deployedToken.options.address, 
            tokenSourceCode,
            'Token', 
            web3.eth.abi.encodeParameters(
                ['uint256', 'address', 'uint256', 'string', 'string', 'uint8'],
                    [new BigNumber(10).pow(new BigNumber(process.env.TOKEN_DECIMALS)).mul(new BigNumber(process.env.TOKEN_CAP)), 
                        web3.utils.toChecksumAddress(process.env.TOKEN_PREFUND_ADDRESS), 
                        new BigNumber(10).pow(new BigNumber(process.env.TOKEN_DECIMALS)).mul(new BigNumber(process.env.TOKEN_PREFUND_AMOUNT)), 
                        process.env.TOKEN_NAME, 
                        process.env.TOKEN_SYMBOL, 
                        process.env.TOKEN_DECIMALS]));

    provider.engine.stop();
    
})();