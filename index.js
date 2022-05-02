const express = require("express");
const app = express();
const port = process.env.PORT || 3030;

app.get("/", (req, res) => {
    res.send("Inventory server is running");
});

app.listen(port, () => {
    console.log("Server Listening.....");
});
