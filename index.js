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
    // await client.connect();

    // Collections in the database
    const touristSpotCards = client.db('touristSpotsDB').collection('touristSpotCards');
    const addTouristSpot = client.db('touristSpotsDB').collection('addTouristSpot');
    const countryCards = client.db('touristSpotsDB').collection('countryCards');

    // Read all the card data from the database
    app.get('/touristSpotCards', async (req, res) => {
      const cursor = touristSpotCards.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read specifice card data from the database
    app.get('/touristSpotCards/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCards.findOne(query);
      res.send(result);
    });

    // Read the user tourist spot data from database
    app.get('/addTouristSpot', async (req, res) => {
      const { sort } = req.query;
      // console.log(sort);
      let result;

      // Sort data according to ascending or descending order
      try {
        if (sort === 'low' || sort === 'high') {
          const sortOrder = sort === 'low' ? 1 : -1;

          result = await addTouristSpot.find().sort({average_cost: sortOrder}).toArray();
          // console.log(result);
          res.status(200).send(result);

        } else{
          const cursor = addTouristSpot.find();
          result = await cursor.toArray();
          res.send(result);
        }

      } catch (error) {
        // console.log(error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Read specific data via _id from database
    app.get('/addTouristSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addTouristSpot.findOne(query);
      res.send(result);
    });

    // Read specific data via email from database
    app.get('/myTouristSpot/:email', async (req, res) => {
      // const data = req.params;
      // console.log(data)
      const query = { email: req.params.email };
      const uploadedData = addTouristSpot.find(query);
      const result = await uploadedData.toArray();
      res.send(result);
    });

    // Add user tourist spot in the database
    app.post('/addTouristSpot', async (req, res) => {
      const addTourist = req.body;
      // console.log(addTourist);
      const result = await addTouristSpot.insertOne(addTourist);
      res.send(result);
    });

    // Update tourist spot data in the database
    app.patch('/addTouristSpot/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = req.body;
      const doc = {
        $set: {
          tourist_spot_name: updatedDoc.tourist_spot_name,
          img_url: updatedDoc.img_url,
          location: updatedDoc.location,
          country_name: updatedDoc.country_name,
          average_cost: updatedDoc.average_cost,
          total_visitor: updatedDoc.total_visitor,
          season: updatedDoc.season,
          travel_time: updatedDoc.travel_time,
          description: updatedDoc.description,
        }
      };
      const result = await addTouristSpot.updateOne(filter, doc);
      res.send(result);
    });

    // Delete user tourist info from database
    app.delete('/addTouristSpot/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const result = await addTouristSpot.deleteOne(filter);
      res.send(result);
    });

    // Read the country cards from the database
    app.get('/countryCards', async (req, res) => {
      const cursor = countryCards.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read specific tourist cards via county name
    app.get('/touristSpotCards/', async (req, res) => {
      // const country = req.params;
      // console.log(country);
      // const filter = {country_name: country.}
    });

    // Create user in the database
    // app.post('/users', async (req, res) => {
    //   // const 
    // });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. I successfully connected to MongoDB!");
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