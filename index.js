const express=require('express')
const bodyParser=require('body-parser');
const cors=require('cors')
const ObjectId=require('mongodb').ObjectID
const MongoClient=require('mongodb').MongoClient;
require('dotenv').config()

const app=express()

app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scyee.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const port =5000;

app.get('/',(req,res) => {

res.send('Book shop server.')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("BookShop").collection("products");
  const orderCollection = client.db("BookShop").collection("orders");
  console.log('working from inside');


//adding product from form with image to db
  app.post('/addProduct',(req,res) => {
    const book=req.body;
    console.log(book);
    bookCollection.insertOne(book)
    
    .then(result => {
    res.send(result.insertedCount>0)

    })
    })


//create an api from db
    app.get('/products',(req,res) =>{
      bookCollection.find()
      .toArray((err,documents)=>{
        res.send(documents)
      })
    })


//delete product from db
app.delete('/delete/:id',(req,res) =>{
  bookCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result => {
    res.send(result.deletedCount>0);
  })
})

//taking data from another form to db
app.post('/addOrder',(req,res) => {
  const order=req.body;
  console.log(order);
  orderCollection.insertOne(order)
  
  .then(result => {
  res.send(result.insertedCount>0)

  })
  })



  //showing all orders of a user with email
  app.post('/ordersByEmail', (req,res) =>{
    const email=req.body;
    orderCollection.find({email: email.email})
    .toArray((err,documents) =>{
      res.send(documents)
    })
  })



//
app.get('/orders',(req,res) =>{
  orderCollection.find()
  .toArray((err,documents)=>{
    res.send(documents)
  })
})




});




app.listen(process.env.PORT || port)