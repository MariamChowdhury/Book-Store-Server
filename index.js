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
  console.log('working from inside');


//adding product from form with image to db
  app.post('/addProduct',(req,res) => {
    const book=req.body;
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


//delete product from db and remove from ui
app.delete('/delete/:id',(req,res) =>{
  bookCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result => {
    res.send(result.deletedCount>0);
  })
})

//


});




app.listen(process.env.PORT || port)