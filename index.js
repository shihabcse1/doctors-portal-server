const express = require("express"); // importing express
const cors = require("cors"); // importing middleware
const app = express();
require("dotenv").config(); // importing dotenv
const port = process.env.PORT || 5000;

// we are telling middleware to use those
app.use(cors());
app.use(express.json()); // express.json() help to parse the data which we get through body

app.get("/", (req, res) => {
    res.send("Hello Doctor!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
