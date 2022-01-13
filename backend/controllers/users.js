const mdbconn = require('../lib/utils/mongo.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
let database = "qa_application";
let collection = "users";

function getUserById(userId) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).aggregate([{ $match: { _id: ObjectId(userId) } }]).toArray();
    });
}

function getUserByEmail(userEmail) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).aggregate([{ $match: { email: userEmail } }]).toArray();
    });
}

function createUser(new_user) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).insertOne(new_user).finally();
    });
}

function updateUserPassword(id, password) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $set: { password: password } } // El cambio que se quiere realizar
        )
    });
}

function updateUserEmail(id, email) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $set: { email: email } } // El cambio que se quiere realizar
        )
    });
}

function updateUserUsername(id, username) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $set: { username: username } } // El cambio que se quiere realizar
        )
    });
}

function addAnswer(id, answer_id) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $push: { answers: ObjectId(answer_id) } } // Se añade al arreglo un id de una rta nuevo
        )
    });
}

function addQuestion(id, question_id) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $push: { questions: ObjectId(question_id) } } // Se añade al arreglo un id de una pregunta nuevo
        )
    });
}

function deleteUser(id) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).deleteOne({ _id: ObjectId(id) })
    });
}

module.exports = [getUserById, getUserByEmail, createUser, updateUserPassword, updateUserEmail, updateUserUsername, addAnswer, addQuestion, deleteUser];