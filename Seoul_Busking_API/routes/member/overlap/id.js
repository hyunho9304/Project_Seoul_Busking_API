/*
    URL : /member/overlap/id
    Description : 아이디 중복검사
    Content-type : x-www-form-urlencoded
    method : POST - Body
    Body = {
        member_ID : String   //   아이디
    }
*/
const express = require('express');
const router = express.Router();
const pool = require('../../../config/dbPool');
const async = require('async');
const moment = require('moment');

router.post('/', function(req, res) {

    let member_ID = req.body.member_ID;

    let task = [

        function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    res.status(500).send({
                        status: "fail",
                        msg: "internal server err"
                    });
                    callback("internal server err");
                } else {
                    callback(null, connection);
                }
            }); //  pool.getConnection
        }, //   function

        function(connection, callback) {

            let checkIDQuery = 'SELECT * FROM Member WHERE member_ID = ?';

            connection.query( checkIDQuery, member_ID , function(err, result) {
                if (err) {
                    res.status(500).send({
                        status: "fail",
                        msg: "internal server err"
                    });
                    callback("checkIDQuery err");
                } else {
                    if (result.length !== 0) {
                        res.status(401).send({
                            status: "fail",
                            msg: "already ID in DB"
                        });
                        connection.release();
                        callback("already ID in DB");
                    } else {
                        res.status(201).send({
                            status: "success",
                            msg: "No ID duplication"
                        });
                        connection.release();
                        callback("No ID duplication");
                    }
                }
            }); //  connection.query
        } //    function( ID 중복 확인 )
    ];
    
    async.waterfall(task, function(err, result) {

        let logtime = moment().format('MMMM Do YYYY, h:mm:ss a');

        if (err)
            console.log(' [ ' + logtime + ' ] ' + err);
        else
            console.log(' [ ' + logtime + ' ] ' + result);
    }); //async.waterfall
});

module.exports = router;