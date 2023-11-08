const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000


// middle ware
app.use(express.json()) 
app.use(cors())


const uri = `mongodb+srv://${process.env.userNameDB}:${process.env.password}@cluster0.ypipc9x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const usersCollection = client.db("camR").collection("users");
    const categoriesCollection = client.db("camR").collection("Categories");
    const productsCollection = client.db("camR").collection("products");




    // Categories Get Method
    app.get("/categories", async (req, res) => {
        const result = await categoriesCollection.find().toArray();
        res.send(result);
      });




      // User Get Method
      app.get("/users/:uid", async (req, res) => {
        const uid = req.params.uid
        console.log(typeof(uid));
        const query = {
          uid: uid
        }
        const result = await usersCollection.findOne(query);
        console.log(result);
        res.send(result);
      });




    // User Post Method
    app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });


    // user update method
    app.put("/users", async (req, res) => {
        const data = req.body;
        const email = data.email
        const filter = { email: email };
        const options = { upsert: true };
        const updatedUsers = {
          $set: {
            email: email,
            name: data.name,
            photo: data.photo,
            uid: data.uid
          },
        };
        const result = await usersCollection.updateOne(
          filter,
          updatedUsers,
          options
        );
        res.send(result);
      });  




      // Get Products method
      app.get("/products", async (req, res) => {
        const result = await productsCollection.find().toArray();
        res.send(result);
      });



      




    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);












app.get("/", (req, res) => {
    res.send("Why John Snow Know Nothing????")
})

app.listen(port, ()=> {
    console.log(`Winter is Comming ${port}`);
})