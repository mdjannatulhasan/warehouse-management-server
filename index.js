const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@inventory.v2xft.mongodb.net/myFirstDatabase?retryWrites=true`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorised Access" });
    }
    const bearer = authHeader.split(" ")[1];
    jwt.verify(bearer, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden Access" });
        }
        req.decoded = decoded;
        next();
    });
}

async function run() {
    try {
        await client.connect();
        const products = client.db("inventory").collection("products");

        app.get("/", (req, res) => {
            res.send("Inventory server is running");
        });

        app.post("/login", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: "1d",
            });
            res.send({ token });
        });

        app.get("/item/:id", verifyJWT, async (req, res) => {
            const products = client.db("inventory").collection("products");
            const query = { _id: ObjectId(req.params.id) };
            const result = await products.findOne(query);
            res.send(result);
        });
        app.delete("/delete/:id", verifyJWT, async (req, res) => {
            const products = client.db("inventory").collection("products");
            const query = { _id: ObjectId(req.params.id) };
            const result = await products.deleteOne(query);
            res.send(result);
        });
        app.get("/items", async (req, res) => {
            const query = {};
            const cursor = await products.find(query);
            const productsResult = await cursor.toArray();
            res.send(productsResult);
        });
        app.get("/myitems", verifyJWT, async (req, res) => {
            const decodedEmail = req?.decoded?.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = await products.find(query);
                const productsResult = await cursor.toArray();
                res.send(productsResult);
            } else {
                res.status(403).send({ message: "Forbidden Access" });
            }
        });
        app.post("/additem", verifyJWT, async (req, res) => {
            const query = { name: req.body.name };
            const update = { $set: req.body };
            const options = { upsert: true };
            await products.updateOne(query, update, options);

            res.send({ success: true });
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("Server Listening.....");
});
