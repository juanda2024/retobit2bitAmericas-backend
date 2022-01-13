var express = require('express');
var router = express.Router();
const Joi = require('joi');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var [getAnswer, insertAnswer, changeAnswerDescription, deleteAnswer] = require('../controllers/answers');

const answer_structure = Joi.object({
    user_id: Joi.string()
        .min(24)
        .required(),

    question_id: Joi.string()
        .min(24)
        .required(),

    date: Joi.date()
        .required(),
    
    detail: Joi.string()
        .required()
});

const detail_dto = Joi.object({
    detail: Joi.string()
        .required()
});


/* GET answer with an specific id */
router.get('/:id', async function (req, res, next) {
    const respuesta = await getAnswer(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            return res.status(404).send({ resultado: "The answer was not found. Try with another id" });
        }
        res.status(200).send(result);
    });
});

/* POST answer: with information as a JSON */
router.post('/', async function (req, res, next) {

    const { error } = answer_structure.validate
        ({
            user_id: req.body.user_id,
            question_id: req.body.question_id,
            date: req.body.date,
            detail: req.body.detail
        });

    if (error) {
        return res.status(400).send({ mensaje: error });
    }

    else {
        var new_answer =
        {
            user_id: ObjectId(req.body.user_id),
            question_id: ObjectId(req.body.question_id),
            date: new Date(req.body.date +'T14:56:59.301Z'),
            detail: req.body.detail
        }
        const mensaje = await insertAnswer(new_answer);
        res.status(200).send(mensaje);
    }
});

/* PUT answer: updates the answer with a new description by the given user */
router.put('/detail/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getAnswer(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The answer with that id was not found.");

        }
    });
    if (bool == true) {
        const { error } = detail_dto.validate
            ({
                detail: req.body.detail
            });

        if (error) {
            return res.status(400).send({ mensaje: error });
        }
        else {
            var resultado = await changeAnswerDescription(req.params.id, req.body.detail).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The answer was updated succesfully!" });
                }
            });
        }
    }
});

/* DELETE answer with an specific id */
router.delete('/:id', async function (req, res, next) {
    var eliminado = await deleteAnswer(req.params.id).then((result) => {
        if (result.deletedCount === 1) {
            res.status(200).send({ message: "The answer with the given id was removed." });
        }
        else {
            res.status(404).send({ message: "No answer could be removed. Try again" });
        }
    });;
});

module.exports = router;
