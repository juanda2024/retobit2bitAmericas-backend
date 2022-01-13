const mdbconn = require('../lib/utils/mongo.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
let database = "qa_application";
let collection = "answers";

function getAnswer(answerId) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).aggregate([{ $match: { _id: ObjectId(answerId) } }]).toArray();
    });
}

function insertAnswer(new_answer) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).insertOne(new_answer).finally();
    });
}

function changeAnswerDescription(id, detail) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $set: { detail: detail } } // El cambio que se quiere realizar
        )
    });
}

function deleteAnswer(id) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).deleteOne({ _id: ObjectId(id) })
    });
}

module.exports = [getAnswer, insertAnswer, changeAnswerDescription, deleteAnswer];