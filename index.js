const express = require('express');
var cors = require('cors');

let mongoose = require('mongoose');
let multer = require('multer');
let GridFsStorage = require('multer-gridfs-storage');
let Grid = require('gridfs-stream');
const mongo =require('mongodb');
var fs = require('fs');
const getFile = require('./getFile')
//mongoose.connect('mongodb://localhost:27017/storeDB');
const conn = mongoose.createConnection('mongodb://localhost:27017/storeDB');
Grid.mongo = mongoose.mongo;
console.log('conn.db-->', conn.db)
var connection = mongoose.connection;
// console.log('connectinos-->', connection)
let gfs = Grid(conn.db, mongoose.mongo)
connection.on('error', console.error.bind(console, 'connection error:'));
let port = 3000;

const app = express();
app.use(express.json());
app.use(cors());


let storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/storeDB',
    // file: (req, file) => {
    //     let date = Date.now();
    //     return {
    //         filename: file.fieldname + '-' + date + '.'
    //     }
    // },
    filename: (req, file, cb) => {
        let date = Date.now();
        // The way you want to store your file in database
        cb(null, file.fieldname + '-' + date + '.'); 
    },
    // Additional Meta-data that you want to store
    metadata: function(req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'store' // Root collection name
});
// Multer configuration for single file uploads
let upload = multer({storage}).single('store_logo');

app.get('/image', (req, res)=>{
    return getFile.getFile(req, res)
})
app.get('/files', (req, res) => {
    let filesData = [];
    let count = 0;
    gfs.collection('store'); // set the collection to look up into

    gfs.files.find({}).toArray((err, files) => {
        // Error checking
        console.log('files-->', files)
        if(!files || files.length === 0){
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        res.send({ title: 'NodeJS file upload tutorial', photolist : files });
        // Loop through all the files and fetch the necessary information
        files.forEach((file) => {
            filesData[count++] = {
                originalname: file.metadata.originalname,
                filename: file.filename,
                contentType: file.contentType
            }
        });
        res.json(filesData);
    });
});

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
            console.log('db from store--->', db)
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