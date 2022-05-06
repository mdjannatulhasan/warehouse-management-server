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
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
async function run() {
    try {
        await client.connect();
        const collections = client.db("inventory").collection("Testy");
        // const user = { name: "Hasan", email: "shahmdjhm@gmail.com" };
        // const result = await collections.insertOne(user);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Inventory server is running");
});

app.put("/additem", (req, res) => {
    res.send("product added");
});

app.listen(port, () => {
    console.log("Server Listening.....");
});
