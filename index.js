const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

//middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4001;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("HappyHoliday");
    const packages = database.collection("packages");
    const allOrders = database.collection("allOrders");

    //find multiple data from database for service section
    app.get("/packages", async (req, res) => {
      const query = {};
      const cursor = packages.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //find single data from database
    app.get("/packages/:id", async (req, res) => {
      console.log("browser id is", req.params.id);
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packages.findOne(query);
      res.send(result);
    });

    //post user orders

    app.post("/packages", async (req, res) => {
      const bookingInfo = req.body;
      const query = { bookingInfo };
      const result = await allOrders.insertOne(query);
      res.json(result);
    });

    //Post for Adding new tour packages plan
    app.post("/packagess",async(req,res)=>{
     const addingInfo =req.body
    //  const query = {addingInfo}
     const result = await packages.insertOne({addingInfo})
     res.json(result)
    })

    //Find all order
    app.get("/allOrder", async (req, res) => {
      const query = {};
      const cursor = allOrders.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //Remove Order with Delete operation
    app.delete("/allOrder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allOrders.deleteOne(query)
      res.json(result)
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is response from server :)");
});

app.listen(port, () => {
  console.log("listening to this port", port);
});


//---------Thanks----------