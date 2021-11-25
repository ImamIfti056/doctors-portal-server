const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');


// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hm5vc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('doctors_portal');
        const appointmentsCollection = database.collection('appointment');

        //  POST APPOINTMENTS
        app.post('/appointment', async(req,res) => {
          const appointment = req.body;
          const result = await appointmentsCollection.insertOne(appointment);
          res.json(result);
        })

        // GET USER APPOINTMENTS
        app.get('/appointment', async(req, res) => {
          const email = req.query.email;
          const date = new Date(req.query.date).toLocaleDateString();
          console.log(req.query);
          const query = {email: email, date: date};
          console.log(query);
          const cursor = appointmentsCollection.find(query);
          const appointments = await cursor.toArray();
          res.json(appointments);
        })
    }
    finally{

    }
}
run().catch(console.dir)

// checking connection
app.get('/', (req, res) => {
  res.send('Hello Doctors Portal!')
})

app.listen(port, () => {
  console.log(`listening at: ${port}`)
})