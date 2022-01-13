var express = require('express');
var router = express.Router();
const Joi = require('joi');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var [getUserById, getUserByEmail, createUser, updateUserPassword, updateUserEmail, updateUserUsername, addAnswer, addQuestion, deleteUser] = require('../controllers/users');

const user_structure = Joi.object({
    email: Joi.string()
        .required(),

    password: Joi.string()
        .required(),

    username: Joi.string()
        .required()
});

const password_dto = Joi.object({
    password: Joi.string()
        .required()
});

const email_dto = Joi.object({
    email: Joi.string()
        .required()
});

const username_dto = Joi.object({
    username: Joi.string()
        .required()
});

const newAnswer_dto = Joi.object({
    id: Joi.string()
        .required()
});

const newQuestion_dto = Joi.object({
    id: Joi.string()
        .required()
});

/* GET user with an specific id */
router.get('/id/:id', async function (req, res, next) {
    const respuesta = await getUserById(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            return res.status(404).send({ resultado: "No user found. Try with another id" });
        }
        res.status(200).send(result);
    });
});

/* GET user with an specific email */
router.get('/email/:email', async function (req, res, next) {
    const respuesta = await getUserByEmail(req.params.email).then((result) => {
        if (result === null || result[0] == null) {
            return res.status(404).send({ resultado: "No user found. Try with another email" });
        }
        res.status(200).send(result);
    });
});

/* POST user: with information as a JSON */
router.post('/', async function (req, res, next) {

    const { error } = user_structure.validate
        ({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        });

    if (error) {
        return res.status(400).send({ mensaje: error });
    }

    else {
        var new_user =
        {
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            answers: [],
            questions: []
        }
        const mensaje = await createUser(new_user);
        res.status(200).send(mensaje);
    }
});

/* PUT user: updates the user´s password hash */
router.put('/password/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getUserById(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The user with the given id was not found.");

        }
    });
    if (bool == true) {
        const { error } = password_dto.validate
            ({
                password: req.body.password
            });

        if (error) {
            return res.status(400).send({ mensaje: error });
        }
        else {
            var resultado = await updateUserPassword(req.params.id, req.body.password).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The user´s password was updated succesfully!" });
                }
            });
        }
    }
});

/* PUT user: updates the user´s email */
router.put('/email/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getUserById(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The user with the given id was not found.");

        }
    });
    if (bool == true) {
        const { error } = email_dto.validate
            ({
                email: req.body.email
            });

        if (error) {
            return res.status(400).send({ mensaje: error });
        }
        else {
            var resultado = await updateUserEmail(req.params.id, req.body.email).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The user´s email was updated succesfully!" });
                }
            });
        }
    }
});

/* PUT user: updates the user´s username */
router.put('/username/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getUserById(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The user with the given id was not found.");

        }
    });
    if (bool == true) {
        const { error } = username_dto.validate
            ({
                username: req.body.username
            });

        if (error) {
            return res.status(400).send({ mensaje: error });
        }
        else {
            var resultado = await updateUserUsername(req.params.id, req.body.username).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The user´s username was updated succesfully!" });
                }
            });
        }
    }
});

/* PUT user: add´s a user answer */
router.put('/addAnswer/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getUserById(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The user with that id was not found.");

        }
    });
    if (bool == true) {
        const { error } = newAnswer_dto.validate
            ({
                id: req.body.id
            });

        if (error) {
            return res.status(400).send({ mensaje: error });
        }
        else {
            var resultado = await addAnswer(req.params.id, req.body.id).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The user`s answer was added succesfully!" });
                }
            });
        }
    }
});

/* PUT user: add´s a user question */
router.put('/addQuestion/:id', async function (req, res, next) {
    var bool = true;
    var verificacion = await getUserById(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            bool = false;
            return res.status(404).send("The user with that id was not found.");

        }
    });
    if (bool == true) {
        const { error } = newQuestion_dto.validate
            ({
                id: req.body.id
            });

        if (error) {
            return res.status(400).send({ mensaje: error });
        }
        else {
            var resultado = await addQuestion(req.params.id, req.body.id).then((result) => {
                if (result[0] !== 0) {
                    res.status(200).send({ message: "The user`s question was added succesfully!" });
                }
            });
        }
    }
});

/* DELETE user with an specific id */
router.delete('/:id', async function (req, res, next) {
    var eliminado = await deleteUser(req.params.id).then((result) => {
        if (result.deletedCount === 1) {
            res.status(200).send({ message: "The user with the given id was removed." });
        }
        else {
            res.status(404).send({ message: "No user could be deleted. Try again" });
        }
    });;
});

module.exports = router;
