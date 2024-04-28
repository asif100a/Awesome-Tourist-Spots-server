require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midddleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.bu1vbif.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Collections in the database
    const touristSpotCards = client.db('touristSpotsDB').collection('touristSpotCards');
    const addTouristSpot = client.db('touristSpotsDB').collection('addTouristSpot');
    const userCollection = client.db('touristSpotsDB');

    // // 
    // app.get('/bannerImg', async(req, res) => {
    //   const cursor = touristBannerImgCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    // Read all the card data from the database
    app.get('/touristSpotCards', async(req, res) => {
      const cursor = touristSpotCards.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read specifice card data from the database
    app.get('/touristSpotCards/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await touristSpotCards.findOne(query);
      res.send(result);
    }); 

    // Add user tourist spot in the database
    app.post('/addTouristSpot', async(req, res) => {
      const addTourist = req.body;
      console.log(addTourist);
      const result = await addTouristSpot.insertOne(addTourist);
      res.send(result);
    });

    // Create user in the database
    // app.post('/users', async (req, res) => {
    //   // const 
    // });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. I successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Check server side 
app.get('/', (req, res) => {
  res.send('Assignment 10 server side is running');
});

app.listen(port, () => {
  console.log(`Assignment server is running on port: ${port}`);
});