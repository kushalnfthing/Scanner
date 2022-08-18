import axios from "axios";
import { MongoClient } from "mongodb";

//connect to the mongodb host
var url = "mongodb://localhost:27017/";
const client = new MongoClient(url);


//Get details of particular token of the contract
async function getTokenDetails(address, nfts, i) {
  console.log(nfts[i].token_id)
  var link = "https://api.nftport.xyz/v0/nfts/" + address + "/" + nfts[i].token_id
  console.log(link)
  const options = {
    method: 'GET',
    url: link,
    params: { chain: 'ethereum', include: 'all', refresh_metadata: 'true' },
    headers: {
      'Content-Type': 'application/json',
      Authorization: '74aa6344-267c-46ef-aaa5-c7cfbf0eaf5c'
    }
  };
  await axios.request(options).then(function (response) {
    async function run() {
      try {
        await client.connect();
        const database = client.db('Contract_NFTs_10');
        const nftsDetails = database.collection('NFT_Details');
        // insert the response.data into given db collection
        const query = response.data
        const nft = await nftsDetails.insertOne(query);
        console.log(nft);
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
    run().catch(console.dir);

  }).catch(function (error) {
    console.error(error);
  });
}


//Calling the "getTokenDetails" according to the length of nfts.length
async function getEachNFTDetails(address, data) {
  var newData = JSON.parse(data);
  var nfts = newData.nfts;
  for (var i = 0; i < nfts.length; i++) {
    await getTokenDetails(address, nfts, i)
  }
}


//Get the contract details 
function getDetails(_address) {
  const options = {
    method: 'GET',
    url: 'https://api.nftport.xyz/v0/nfts/' + _address,
    params: { chain: 'ethereum', include: 'all', refresh_metadata: 'true' },
    headers: {
      'Content-Type': 'application/json',
      Authorization: '74aa6344-267c-46ef-aaa5-c7cfbf0eaf5c'
    }
  };
  axios.request(options).then(function (response) {
    var data = JSON.stringify(response.data);
    // console.log(_address, data)
    getEachNFTDetails(_address, data);

  }).catch(function (error) {
    console.error(error);
  });
}



//Enter contract address
getDetails('0x2c3fc1d826bc12027d05fbe3aeace0a2453bf9fd')
