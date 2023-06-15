const express = require('express');
const app = express();
const { ethers } = require('ethers');
const bedrockFactoryABI = require("./abi/bedrockFactory.json")
const bedrockPairABI = require("./abi/bedrockPair.json")
let bedrockFactoryContractAddress = "0x570CE8bfaF5eF9403FE04D51076cA57C2878EBE8";

const providerUrl = 'https://bsc-dataseed.binance.org/';
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

app.get('/pairs', async (req, res) => {
    try {
      // Connect to the PancakeSwap Factory contract
      const factoryContract = new ethers.Contract(bedrockFactoryContractAddress, bedrockFactoryABI, provider);

      // Call the allPairs function to get the total number of pairs
      const pairCount = await factoryContract.allPairsLength();

      const pairsData = [];

      for (let i = 0; i < pairCount; i++) {
        const pairAddress = await factoryContract.allPairs(i);
        const lpTokenContract = new ethers.Contract(pairAddress, bedrockPairABI, provider);
        const token0 = await lpTokenContract.token0();
        const token1 = await lpTokenContract.token1();

        const pairData = {
          ticker_id: `${token0}_${token1}`, // Modify according to your token symbol retrieval method
          base: token0, // Modify according to your token symbol retrieval method
          target: token1, // Modify according to your token symbol retrieval method
          pool_id: pairAddress,
        };

        pairsData.push(pairData);
      }

      res.json(pairsData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Start the server
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });