const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require ('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');
//const { validateRegister } = require('../middleware/users.js'); ??

//http://localhost:3000/api/sign-up
router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    //ist Benutzer in DB?
    db.query(
        `SELECT' id FROM users WHERE LOWER(username) = LOWER(${req.body.username})`,
        (err,result) => {
            if(result.length) { //error, Benutzer der genau so heißt
                return res.status(409).send({
                    message: 'This username is already in use' 
                })
            }else{ //kein Nutzer, in DB speichern
                bcrypt.hash(req.body.password, 10, (err,hash) => {
                    if(err){
                        throw err;
                        return res.status(500).send({
                            message:err,
                        });
                    }else{
                        db.query(`INSERT INTO users (id, username, password, registered) VALUES('${uuid.v4()}', ${db.escape(req.body.username)}, '${hash}', now());`),
                        (err,result) => {
                            if(err){
                                throw err;
                                return res.status(400).send({
                                    message:err,
                                });
                            }
                            return res.status(201).send({
                                message: "Registeres",
                            })
                        }
                    }
                })
            }
        }
    )
});

//http://localhost:3000/api/login
router.post('/login', (req, res, next) => {
    db.query(`SELECT * FROM users WHERE username = ${db.escape(req.body.usernmae)};`,
    (err, result) => {
        if(err) {
            throw err;
            return res.status(400).send({
                message:err,
            });
        }
        if(!result.length) {
            return res.status(400).send({
                message: 'Username or passsword incorrect',
            });
        }
        bcrypt.compare(req.body.password, result[0])['password'], (bErr, bResult) => {
            if(bErr) {
                throw bErr; //PW aus DB
                return res.status(400).send({
                    message: 'Username or passsword incorrect',
                });
            }
            if(bResult){
                //pw match
                const token = jwt.sign({
                    username: result[0].username,
                    userId: result[0].id,
                },
                'SECRETKEY',
                {expiresIn: "30m"}
                );
                db.query(
                    `UPDATE users SET last_login = now() WHERE id = '${result[0].id}';`
                );
                return res.status(200).send({
                    message: 'Logges in',
                    token,
                    user: result[0]
                })
            }
        } 
        return res.status(400).send({
            message: "Username or password incorrect",
        })
    }
    );
});

//http://localhost:3000/api/secret-route
router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send("This is secret-contnent");
});
module.exports = router;





