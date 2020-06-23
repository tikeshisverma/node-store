const express = require('express');
var cors = require('cors');

const mongo =require('mongodb');


const app = express();
app.use(express.json());
app.use(cors());

// "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe" --dbpath "C:\Program Files\MongoDB\Server\4.2\data"

app.get('/api/store', (req, res)=>{
    let searchParam = {}
    if(req.query.id){
        searchParam = {id: req.query.id}
    } else if(req.query.email){
        searchParam = {email: req.query.email}
    }
    console.log(req.query.id)
    const mongoClient = mongo.MongoClient;
    const url = 'mongodb://localhost'
    mongoClient.connect(url, (err, client)=>{
        if(err){
            console.log(err)
        }
        else{
            const db = client.db('storeDB');
            const collection = db.collection('store')
            collection.find(searchParam).toArray((err, result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.send({result})
                    console.log('dqwfasdf',result)
                }
            })
        }
    })
})
app.post('/api/store' , (req, res) =>{
    console.log(req.body)
    const store ={
        name:req.body.store_name,
        id:req.body.store_id,
        type:req.body.store_type,
        category:req.body.store_category,
        description:req.body.store_discription,
        email:req.body.user_email,
    
    }
    const mongoClient = mongo.MongoClient;
    const url = 'mongodb://localhost'
    mongoClient.connect(url, (err, client)=>{
        if(err){
            console.log(err)
        }
        else{
            //console.log(db)
            const db = client.db('storeDB');
            const collection = db.collection('store')
            collection.insert([store],(err, result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log('dqwfasdf',result)
                }
            })


        }
    })
    console.log("store-->", store)
    res.send(store)
});

app.listen(3000, ()=> console.log('3000'))