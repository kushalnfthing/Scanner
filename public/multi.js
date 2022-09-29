import axios from "axios";
import  {MongoClient} from "mongodb";

var url = "mongodb://localhost:27017/";
const client = new MongoClient(url);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let obj = new Array;
let total = new Array;
let sales = 0;
let sales_usd = 0;
let transfers = 0;
let totalSale = 0;
let totalSaleUSD = 0;
//get NFT transaction object
async function fetch(address, token_id, tkn_tx) {

    var link = 'https://api.nftport.xyz/v0/transactions/nfts/' + address + '/' + token_id;
    //API instance
    const options = {
        method: 'GET',
        url: link,
        params: {
            chain: 'ethereum',
            type: 'all'
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '74aa6344-267c-46ef-aaa5-c7cfbf0eaf5c'
        }
    };
    await axios.request(options).then(response => {
        var tx_data = response.data
        MultiCont (tx_data, token_id, tkn_tx)

    }).catch(function (error) {
        console.error(error);
    });
}
//Update the database
async function updateDB(data){
    
    async function run() {
        try {
            await client.connect();
            const database = client.db('NFT_Txs-26');
            const nftsDetails = database.collection('NFTs Details token_txs');
            // Query for a movie that has the title 'Back to the Future'

            const query = data
            const nft = await nftsDetails.insertOne(query);
            console.log(nft);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
    run().catch(console.dir);

}

async function MultiCont(tx_details){
for (let i = 0; i < tx_details.transactions.length; i++) {
    var tx = tx_details.transactions[i]
    let tx_data = {};
    if (tx.type == 'transfer' || tx.type == 'mint' || tx.type == 'sale') {

        tx_data = ({"type":tx.type, "transfer_from": tx.transfer_from, "transfer_to":tx.transfer_to, "transaction_date":tx.transaction_date, "marketplace":tx.marketplace})
        if(tx.type == 'sale'){
            tx_data = ({"type":tx.type, "transfer_from": tx.transfer_from, "transfer_to":tx.transfer_to, "transaction_date":tx.transaction_date, "sale_details":tx.price_details, "marketplace":tx.marketplace})
            sales+=1;
            sales_usd+=1;
            totalSale += tx.price_details.price
            totalSaleUSD+=tx.price_details.price_usd
            console.log(totalSale);

        }
        if(tx.type == 'transfer'){
            transfers+=1;
            console.log(transfers)
        }
        total.push(tx_data);
        // console.log(tx_data)
    }
    await wait(4000)

}
}

//Get Each token transactions
async function getEachTokenTx(address, data) {
    var newData = JSON.parse(data);
    var nfts = newData.nfts;
    for (var i = 0; i < nfts.length; i++) {
        var token_id = nfts[i].token_id
        await fetch(address, token_id, total);
        await wait(10000)
        var total_transaction = {"total_transactions_type":total.length, "total_transfers":transfers, "total_sales":sales, "total_sales(USD)":sales_usd, "total_sale_value": totalSale + " ETH", "total_sale_value(USD)": totalSaleUSD + " USD", "avg_sale": totalSale/sales, "avg_sale(USD)": totalSaleUSD/sales_usd};
        var tkn_data = {"contract":address,"token_id":token_id,"transactions":total, "total_transactions": total_transaction}
        sales = 0;
        totalSaleUSD = 0;
        sales_usd = 0;
        transfers = 0;
        totalSale = 0;

        updateDB(tkn_data)
        obj.push(tkn_data)
        console.log(tkn_data, obj.length)
        total = []
        await wait(100000)
    }
  }

//Get the contract details 
async function getContractDetails(address) {
    const options = {
        method: 'GET',
        url: 'https://api.nftport.xyz/v0/nfts/' + address,
        params: { 
            chain: 'ethereum', 
            include: 'all', 
            refresh_metadata: 'true' 
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '74aa6344-267c-46ef-aaa5-c7cfbf0eaf5c'
        }
    };
     await axios.request(options).then(response => {
        var data = JSON.stringify(response.data)
        getEachTokenTx(address, data)

    }).catch(function (error) {
        console.error(error);
    });
}


var address = new Array

//pass the array of contract address to "address" array
address = ["0x2c3fc1d826bc12027d05fbe3aeace0a2453bf9fd", "0x57a204aa1042f6e66dd7730813f4024114d74f37"];


//Delay loop 200000 msec
const loop = async () => {
  for (const add of address) {
    
    await getContractDetails(add);
    await wait(5000000);
  }
}

loop()


