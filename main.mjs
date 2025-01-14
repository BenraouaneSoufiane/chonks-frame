import https from 'https';
import fs from 'fs';
import express from 'express';
import axios from 'axios';
import { cachedDataVersionTag } from 'v8';
var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('crt.pem'),
    ca: fs.readFileSync('bundle.pem')
};
const app = express();
// Change this based on your astro.config.mjs, `base` option.
// They should match. The default value is "/".
const base = '/';
app.use(base, express.static('dist/client/'));
app.use(express.json());

const newOne = async function(){
    const random = Math.floor(Math.random() * 83300) + 1;
    console.log(random);

    const ALCHEMY_BASE_URL = `https://base-mainnet.g.alchemy.com/v2/BdptFAC-8nMGC0SjwY38mJ9A_b-A7Enj`;
    const contractAddress = "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9";
    const url = `${ALCHEMY_BASE_URL}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${random}&refreshCache=false`;
    var nftData = '';
    try {
        const response = await axios.get(url, {
            headers: {
                accept: "application/json",
            },
        });
        nftData = response.data.media[0].gateway;
        console.log(nftData);
        return [random,nftData];
    } catch (error) {
        console.error("Error fetching NFT metadata:", error);
        throw new Error("Failed to fetch NFT metadata");
    }
}
app.get('/chonk',async(req,res)=>{ 
    const r =  await newOne();
    res.send(`<!DOCTYPE html><html><head>
      <title>Chonk NFTs</title>
      <meta property="og:image" content="${r[1]}" />
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${r[1]}" />
      <meta name="fc:frame:button:1" content="#${r[0]}"/>
      <meta name="fc:frame:button:1:action" content="link"/>
      <meta name="fc:frame:button:1:target" content="https://opensea.io/assets/base/0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9/${r[0]}"/>
      <meta name="fc:frame:button:2" content="#?"/>
      <meta name="fc:frame:button:2:action" content="post"/>
      <meta name="fc:frame:button:2:target" content="https://frames.cryptocheckout.co/chonk/other"/>
      
      </head></html>`);
  });
  app.post('/chonk/other',async(req,res)=>{ 

    const r =  await newOne();

    res.send(`<!DOCTYPE html><html><head>
        <title>Chonk NFTs</title>
        <meta property="og:image" content="${r[1]}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${r[1]}" />
        <meta name="fc:frame:button:1" content="#${r[0]}"/>
        <meta name="fc:frame:button:1:action" content="link"/>
        <meta name="fc:frame:button:1:target" content="https://opensea.io/assets/base/0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9/${r[0]}"/>
        <meta name="fc:frame:button:2" content="#?"/>
        <meta name="fc:frame:button:2:action" content="post"/>
        <meta name="fc:frame:button:2:target" content="https://frames.cryptocheckout.co/chonk/other"/>
        
        </head></html>`);
  });
//app.listen(80);
var server = https.createServer(options,app);
server.listen(443);