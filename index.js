const express = require("express"); // importing express
const cors = require("cors"); // importing middleware
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config(); // importing dotenv
const port = process.env.PORT || 5000;

// we are telling middleware to use those
app.use(cors());
app.use(express.json()); // express.json() help to parse the data which we get through body

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pitr9if.mongodb.net/?retryWrites=true&w=majority`;

//console.log(uri);

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        //console.log("Database Connected");
        const serviceCollection = client
            .db("doctors_portal")
            .collection("services");
        const bookingCollection = client
            .db("doctors_portal")
            .collection("bookings");

        app.get("/service", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post("/booking", async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello Doctor!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
