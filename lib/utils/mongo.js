const uri = "mongodb://admin:OHrvYqzO8qwFcsXb@cluster0-shard-00-00.i8eqf.mongodb.net:27017,cluster0-shard-00-01.i8eqf.mongodb.net:27017,cluster0-shard-00-02.i8eqf.mongodb.net:27017/qa_application?ssl=true&replicaSet=atlas-hngm8b-shard-0&authSource=admin&retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;

function MongoUtils() {

    const mu = {};

    // Esta función retorna una nueva conexión a MongoDB.
    mu.conn = () => {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        return client.connect();
    };
    return mu;
}
module.exports = MongoUtils();