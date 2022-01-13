var express = require('express');
var router = express.Router();
const Joi = require('joi');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var [getQuestions, getQuestionsByTittle, getQuestion, insertQuestion, changeQuestionDescription, changeQuestionTittle, addAnswer, updateQuestionSolution, deleteQuestion] = require('../controllers/questions');

const question_structure = Joi.object({
    tittle: Joi.string()
        .required(),

    detail: Joi.string()
        .required(),

    creation_date: Joi.date()
        .required(),
    
    user_id: Joi.string()
        .min(24)
        .required()
});

const tittle_dto = Joi.object({
    tittle: Joi.string()
        .required()
});

const detail_dto = Joi.object({
    detail: Joi.string()
        .required()
});

const solution_dto = Joi.object({
    solution: Joi.string()
        .required()
});

const answer_dto = Joi.object({
    id: Joi.string()
        .required()
});

/* GET all questions */
router.get('/', async function (req, res, next) {
    const questions = await getQuestions().then((result) => {
        if (result == null || result[0] == null) {
            res.status(404).send({ resultado: "No questions where found." })
        }
        else {
            res.status(200).send(result);
        }
    });
});

/* POST questions with an specific tittle */
router.post('/tittle', async function (req, res, next) {

    const { error } =  tittle_dto.validate
        ({
            tittle: req.body.tittle
        });

    if (error) {
        return res.status(400).send({ mensaje: error });
    }

    else {
        var tittleDTO =
        {
            tittle: req.body.tittle
        }
        const mensaje = await getQuestionsByTittle(tittleDTO);
        res.status(200).send(mensaje);
    }
});

/* GET questions with an specific id */
router.get('/id/:id', async function (req, res, next) {
    const respuesta = await getQuestion(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            return res.status(404).send({ resultado: "No question found. Try with another id" });
        }
        res.status(200).send(result);
    });
});

/* POST question: with information as a JSON */
router.post('/', async function (req, res, next) {

    const { error } = question_structure.validate
        ({
            tittle: req.body.tittle,
            detail: req.body.detail,
            creation_date: req.body.creation_date,
            user_id: req.body.user_id
        });

    if (error) {
        return res.status(400).send({ mensaje: error });
    }

    else {
        var new_question =
        {
            tittle: req.body.tittle,
            detail: req.body.detail,
            creation_date: new Date(req.body.creation_date +'T14:56:59.301Z'),
            user_id: ObjectId(req.body.user_id),
            solution: null,
            answers: []
        }
        const mensaje = await insertQuestion(new_question);
        res.status(200).send(mensaje);
    }
});

/* PUT question: updates the question with a new detail given by the user */
router.put('/detail/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getQuestion(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The question with that id was not found.");

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
            var resultado = await changeQuestionDescription(req.params.id, req.body.detail).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The question´s detail was updated succesfully!" });
                }
            });
        }
    }
});

/* PUT question: add´s a question´s answer */
router.put('/addAnswer/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getQuestion(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The question with that id was not found.");

        }
    });
    if (bool == true) {
        const { error } = answer_dto.validate
            ({
                id: req.body.id
            });

        if (error) {
            return res.status(400).send({ mensaje: error });
        }
        else {
            var resultado = await addAnswer(req.params.id, req.body.id).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The question´s answer was added succesfully!" });
                }
            });
        }
    }
});

/* PUT question: updates the question with a new tittle given by the user */
router.put('/tittle/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getQuestion(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The question with that id was not found.");

        }
    });
    if (bool == true) {
        const { error } = tittle_dto.validate
            ({
                tittle: req.body.tittle
            });

        if (error) {
            return res.status(400).send({ mensaje: error });
        }
        else {
            var resultado = await changeQuestionTittle(req.params.id, req.body.tittle).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The question´s tittle was updated succesfully!" });
                }
            });
        }
    }
});

/* PUT question: updates the question´s solution */
router.put('/solution/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getQuestion(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The question with that id was not found.");

        }
    });
    if (bool == true) {
        const { error } = solution_dto.validate
            ({
                solution: req.body.solution
            });

        if (error) {
            return res.status(400).send({ mensaje: error });
        }
        else {
            var resultado = await updateQuestionSolution(req.params.id, req.body.solution).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The question´s solution was created/updated succesfully!" });
                }
            });
        }
    }
});

/* DELETE question with an specific id */
router.delete('/:id', async function (req, res, next) {
    var eliminado = await deleteQuestion(req.params.id).then((result) => {
        if (result.deletedCount === 1) {
            res.status(200).send({ message: "The question with the given id was removed." });
        }
        else {
            res.status(404).send({ message: "No question could be removed. Try again" });
        }
    });;
});

module.exports = router;
