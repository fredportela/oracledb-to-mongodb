const oracledb = require('oracledb');
const mongodb = require('mongodb');
const dbconfig = require('./dbconfig');

oracledb.fetchAsString = [ oracledb.CLOB ]; //convert clob type to string
oracledb.outFormat = oracledb.OBJECT;
oracledb.maxRows = 1000; //allow get 1000 rows per time

oracledb.getConnection(dbconfig.config).then((conn) => {
    const mongoClient = mongodb.MongoClient
    const con = mongoClient.connect('mongodb://localhost:27017/schema_name')

    con.then((con) => con.collection('collection_name').deleteMany({}) )

    return conn.queryStream(`SELECT * FROM table_oracle`).on('data', data => {
        
        con.then((db) => {
            
            db.collection('collection_name').insert(data)
            
            .catch((e) => {
                console.log("Error: " +  e.message)
                process.exit(1)
            });
        
        })
        .catch((e) => {
            console.log("Error: " +  e.message)
            process.exit(1)
        });
            
        
        
    })
})