const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()

// middleWare
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixvks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
      await client.connect()
      try {
            const productCollection = client.db("assignment-11").collection("products") 

            app.post('/products', async (req, res) => {
                  const newProduct = req.body
                  const result = await productCollection.insertOne(newProduct)
                res.send(result)  
            })
            // delete

            app.delete("/products/:id", async (req, res) => {
                  const id = req.params.id
                  const query = {_id: ObjectId(id) }
                  const result = await productCollection.deleteOne(query)
                  res.send(result)
            })
            // finde one
            app.get('/products/:id', async (req, res) => {
                  const id = req.params.id
                  const query = { _id: ObjectId(id) }
                  const products = await productCollection.findOne(query)
                  res.send(products)
            })
            // update 
            app.put("/products/:id", async (req, res) => {
              const id = req.params.id;
              const updatedInventory = req.body;
              const filter = {_id: ObjectId(id) };
              const options = { upsert: true };
              const updateDoc = {
                $set: {
                  quantity: updatedInventory.quantity,
                },
              };

              const result = await productCollection.updateOne(
                filter,
                updateDoc,
                options
              );
              res.send(result);
            });


            app.get('/products', async (req, res) => {
                  const query = {}
                  const cursor = productCollection.find(query)
                  const products = await cursor.toArray()  
                  res.send(products);
                  
            })  
      }
      finally {
            
      }
}
run().catch(console.dir)


app.get('/', (req, res) => {
      res.send('Running Assignment 11')
})

app.listen(port, () => {
      console.log('lissting port', port)
})