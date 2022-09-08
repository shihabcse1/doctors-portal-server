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

        app.get("/service", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        //   // query for movies that have a runtime less than 15 minutes
        //   const query = { runtime: { $lt: 15 } };
        //   const options = {
        //     // sort returned documents in ascending order by title (A->Z)
        //     sort: { title: 1 },
        //     // Include only the `title` and `imdb` fields in each returned document
        //     projection: { _id: 0, title: 1, imdb: 1 },
        //   };
        //   const cursor = movies.find(query, options);
        //   // print a message if no documents were found
        //   if ((await cursor.count()) === 0) {
        //     console.log("No documents found!");
        //   }
        //   // replace console.dir with your callback to access individual elements
        //   await cursor.forEach(console.dir);
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
