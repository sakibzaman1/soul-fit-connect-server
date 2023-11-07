const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikmm0oq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const serviceCollection = client
      .db("soulFitServiceDB")
      .collection("services");
    const mySchedulesCollection = client
      .db("soulFitServiceDB")
      .collection("myschedules");

    // Read data
    // Read services
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // Read my schedules
    app.get("/myschedules", async (req, res) => {
      const cursor = mySchedulesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Create data
    // post service
    app.post("/services", async (req, res) => {
      const newService = req.body;
      console.log(newService);
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

     // update service

     app.put('/services/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedService = req.body;
      const service = {
          $set: {
              serviceName: updatedService.serviceName,
              serviceImage: updatedService.serviceImage,
              providerLocation: updatedService.providerLocation,
              price: updatedService.price,
              serviceArea: updatedService.serviceArea,
              proName: updatedService.proName,
              proImage : updatedService.proImage,
              proEmail : updatedService.proEmail,
              description : updatedService.description
          }
      }
      const result = await serviceCollection.updateOne(filter, service, options)
      res.send(result)

  })

  // Delete data
    // delete service

    app.delete('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.deleteOne(query)
      res.send(result)
  })

    // post my schedules
    app.post("/myschedules", async (req, res) => {
      const myNewService = req.body;
      console.log(myNewService);
      const result = await mySchedulesCollection.insertOne(myNewService);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Soul Server is running");
});

app.listen(port, () => {
  console.log(`Soul server is running on port ${port}`);
});
