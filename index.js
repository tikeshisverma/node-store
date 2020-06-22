const express = require('express');
var cors = require('cors');

let mongoose = require('mongoose');
let multer = require('multer');
let GridFsStorage = require('multer-gridfs-storage');
let gridfs = require('gridfs-stream');
const mongo =require('mongodb');
var fs = require('fs');

//mongoose.connect('mongodb://localhost:27017/storeDB');
mongoose.connect('mongodb://localhost:27017/storeDB');
mongoose.Promise = global.Promise;

gridfs.mongo = mongoose.mongo;

var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

let port = 3000;

const app = express();
app.use(express.json());
app.use(cors());


let storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/storeDB',
    file: (req, file) => {
        let date = Date.now();
        return {
            bucketName: 'store_logo',
            filename: file.fieldname + '-' + date + '.'
        }
    },
    
    // Additional Meta-data that you want to store
    metadata: function(req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'store' // Root collection name
});
// Multer configuration for single file uploads
let upload = multer({storage}).single('store_logo');

// Route for file upload
app.post('/upload', (req, res) => {
    upload(req,res, (err) => {
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        console.log("tiku", req.file)
        res.json({error_code:0, error_desc: null, file_uploaded: true});
    });
});

app.get('/api/store', (req, res)=>{
    console.log(req.query.id)
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
            collection.find({id:req.query.id}).toArray((err, result)=>{
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
        description:req.body.store_discription
    
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

            // collection.find({}).toArray((err, result)=>{
            //     if(err){
            //         console.log(err)
            //     }
            //     else{
            //         console.log('dqwfasdf',result)
            //     }
            // })
        }
    })
    console.log("store-->", store)
    res.send(store)
});

app.listen(3000, ()=> console.log('3000'))