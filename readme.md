## Node Store backend
This is a backend repo for web-store-front web app.


it has following endpoints:

1. GET: `localhost:3000/api/store?id=<store_id>`
2. GET: `localhost:3000/api/store?email=<user_email>`
3. POST: `localhost:3000/api/store`
    3.1. Body: 
    ```
    {
    "store_name":"store 1",
    "store_id":"4123",
    "store_type":"kirana store 123124"
    }
    ``` 


## Project Setup
1. `npm install`
2. start mongo db at `localhost:27017`
    2.1. create mongo db with name of `storeDB`
    2.2. create collection with the name of `store`
3. `node index.js`
