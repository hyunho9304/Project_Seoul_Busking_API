/*
	URL : /member/signin
	Description : 로그인
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		member_ID : String ,		//	아이디
		member_PW : String  		//	비밀번호
	}
*/

const express = require('express');
const router = express.Router();
const pool = require('../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

const crypto = require('crypto');

router.post('/', function(req, res) {

	let member_ID = req.body.member_ID ;
	let member_PW = req.body.member_PW ;

	let task = [

		function( callback ) {

			pool.getConnection(function(err , connection ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					});
					callback( "getConnection err" );
				} else {
					callback( null , connection ) ;
				}
			});
		} ,

		function( connection , callback ) {

			let checkEmailQuery = 'SELECT * FROM Member WHERE member_ID = ?' ;
			
			connection.query( checkEmailQuery , member_ID , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "checkEmailQuery err") ;
				} else {
					if( result.length == 0 ) {
						res.status(401).send({
							status : "fail" ,
							message : "failed login"
						});
						connection.release() ;
						callback( "failed login") ;
					} else {
						callback( null , connection , result[0] ) ;
					}
				}
			}) ;
		} ,

		function( connection , object , callback ) {

			crypto.pbkdf2( member_PW , object.member_salt , 100000 , 64 , 'sha512' , function(err , hashed ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "crypto pbkdf2 err") ;
				} else {

					let cryptopwd = hashed.toString( 'base64' ) ;

					if( cryptopwd !== object.member_PW ) {
						res.status(401).send({
							status : "fail" ,
							message : "failed login"
						}) ;
						connection.release() ;
						callback( "failed login" ) ;
					} else {
						res.status(201).send({
							status : "success" ,
							data : {
								member_type : object.member_type ,
								member_nickname : object.member_nickname
							} ,
							message : "successful signin"
						}) ;
						connection.release() ;
						callback( null , "successful signin" ) ;
					}
				}
			}) ;
		}
	] ;

	async.waterfall(task, function(err, result) {
		
		let logtime = moment().format('MMMM Do YYYY, h:mm:ss a');

		if (err)
			console.log(' [ ' + logtime + ' ] ' + err);
		else
			console.log(' [ ' + logtime + ' ] ' + result);
	}); //async.waterfall
});

module.exports = router;





























