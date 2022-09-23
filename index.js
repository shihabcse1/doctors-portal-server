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
            const query = {
                treatment: booking.treatment,
                date: booking.date,
                patient: booking.patient,
            };
            const exists = await bookingCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, booking: exists });
            }
            const result = await bookingCollection.insertOne(booking);
            return res.send({ success: true, result });
        });

        app.get("/available", async (req, res) => {
            const date = req.query.date;

            // step 1:  get all services
            const services = await serviceCollection.find().toArray();

            // step 2: get the booking of that day. output: [{}, {}, {}, {}, {}, {}]
            const query = { date: date };
            const bookings = await bookingCollection.find(query).toArray();

            // step 3: for each service
            services.forEach((service) => {
                // step 4: find bookings for that service. output: [{}, {}, {}, {}]
                const serviceBookings = bookings.filter(
                    (book) => book.treatment === service.name
                );
                // step 5: select slots for the service Bookings: ['', '', '', '']
                const bookedSlots = serviceBookings.map((book) => book.slot);
                // step 6: select those slots that are not in bookedSlots
                const available = service.slots.filter(
                    (slot) => !bookedSlots.includes(slot)
                );
                //step 7: set available to slots to make it easier
                service.slots = available;
            });

            res.send(services);
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
