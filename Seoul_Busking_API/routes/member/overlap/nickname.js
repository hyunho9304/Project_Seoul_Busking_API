/*
    URL : /member/overlap/nickname
    Description : 닉네임 중복검사
    Content-type : x-www-form-urlencoded
    method : POST - Body
    Body = {
        member_nickname : String   //   닉네임
    }
*/
const express = require('express');
const router = express.Router();
const pool = require('../../../config/dbPool');
const async = require('async');
const moment = require('moment');

router.post('/', function(req, res) {

    let member_nickname = req.body.member_nickname ;

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

            let checkNicknameQuery = 'SELECT * FROM Member WHERE member_nickname = ?';

            connection.query( checkNicknameQuery, member_nickname , function(err, result) {
                if (err) {
                    res.status(500).send({
                        status: "fail",
                        msg: "internal server err"
                    });
                    callback("checkNicknameQuery err");
                } else {
                    if (result.length !== 0) {
                        res.status(401).send({
                            status: "fail",
                            msg: "already nickname in DB"
                        });
                        connection.release();
                        callback("already nickname in DB");
                    } else {
                        res.status(201).send({
                            status: "success",
                            msg: "No nickname duplication"
                        });
                        connection.release();
                        callback("No nickname duplication");
                    }
                }
            }); //  connection.query
        } //    function( nickname 중복 확인 )
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