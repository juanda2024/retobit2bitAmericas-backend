const mdbconn = require('../lib/utils/mongo.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
let database = "qa_application";
let collection = "questions";

function getQuestions() {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).find({}).toArray();
    });
}

function getQuestionsByTittle(tittleDTO) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).find({"tittle": new RegExp(tittleDTO.tittle, 'i')}).stream().toArray();
    });
}

function getQuestion(id) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).aggregate([{ $match: { _id: ObjectId(id) } }]).toArray();
    });
}

function insertQuestion(new_question) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).insertOne(new_question).finally();
    });
}

function changeQuestionDescription(id, detail) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $set: { detail: detail } } // El cambio que se quiere realizar
        )
    });
}

function changeQuestionTittle(id, tittle) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $set: { tittle: tittle } } // El cambio que se quiere realizar
        )
    });
}

function addAnswer(id, answer_id) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $push: { answers: ObjectId(answer_id) } } // Se añade al arreglo un id de answer nuevo
        )
    });
}

function updateQuestionSolution(id, solution_id) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).updateOne(
            { _id: ObjectId(id) }, // Filtro al documento que queremos modificar
            { $set: { solution: ObjectId(solution_id) } } // El cambio que se quiere realizar
        )
    });
}

function deleteQuestion(id) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).deleteOne({ _id: ObjectId(id) })
    });
}

module.exports = [getQuestions, getQuestionsByTittle, getQuestion, insertQuestion, changeQuestionDescription, changeQuestionTittle, addAnswer,  updateQuestionSolution,  deleteQuestion];