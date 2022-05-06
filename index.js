const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@inventory.v2xft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get("/", (req, res) => {
    res.send("Inventory server is running");
});

app.put("/additem", async (req, res) => {
    async function run() {
        try {
            await client.connect();
            const products = client.db("inventory").collection("products");
            const query = { name: req.body.name };
            const update = { $set: req.body };
            const options = { upsert: true };
            await products.updateOne(query, update, options);
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);

    res.send({ success: true });
});

app.listen(port, () => {
    console.log("Server Listening.....");
});
