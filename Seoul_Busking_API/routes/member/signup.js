/*
	URL : /member/signup
	Description : 회원가입
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		member_type : String ,			/	일반인 : 0 , 공연자 : 1
		member_category : String ,		/	공연 카테고리 종류 , 일반인 경우에는 null
		member_ID : String , 			/	아이디
		member_PW : String ,			/	비밀번호
		member_nickname : String ,		/	닉네임
	}
	중복검사가 모두 완료되었을경우에만 진행 안그럴 경우 id PK 로 인해서 오류 발생
*/

const express = require('express');
const router = express.Router();
const pool = require('../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

const crypto = require('crypto');


router.post('/', function(req, res) {

	let member_type = req.body.member_type ;
	let member_category = req.body.member_category ;
	let member_ID = req.body.member_ID ;
	let member_PW = req.body.member_PW ;
	let member_nickname = req.body.member_nickname ;

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

		function ( connection , callback ) {

			crypto.randomBytes( 32 , function ( err , buffer ) {
				if(err) {
					res.status(500).send({
						stauts : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "cryptoRandomBytes err" ) ;
				} else {

					let salt = buffer.toString( 'base64' ) ;

					crypto.pbkdf2( member_PW , salt , 100000 , 64 , 'sha512' , function( err , hashed ) {
						if( err ) {
							res.status(500).send({
								status : "fail" ,
								message : "internal server err"
							}) ;
							connection.release() ;
							callback( "cryptoPbkdf2 err") ;
						} else {

							let cryptopwd = hashed.toString( 'base64' ) ;

							let insertMemberQuery = 'INSERT INTO Member VALUES( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )' ;
							var tmpIntroduction = "안녕하세요~ " + member_nickname + " 입니다" ;
							let queryArr = [ member_type , member_category , member_ID , cryptopwd , salt , member_nickname , null , null , tmpIntroduction , 0 , 0 , 0 , 13 ] ;

							connection.query( insertMemberQuery , queryArr , function( err , result ) {
								if(err) {
									res.status(500).send({
										status : "fail" ,
										message : "internal server err"
									});
									connection.release() ;
									callback( "insertMemberQuery err" );
								} else {
									res.status(201).send({
										status : "success" ,
										data : {
											member_type : member_type ,
											member_nickname : member_nickname ,
											member_ID : member_ID
										} ,
										message : "successful signup"
									});
									connection.release() ;
									callback( null , "successful signup" );
								}
							}) ;	//	connection query
						}
					}) ;	//	crypto pbkdf2
				}
			});	//	crypto randombytes
		}
	] ;

	async.waterfall(task, function(err, result) {
		
		let logtime = moment().format('MMMM Do YYYY, h:mm:ss a');

		if (err)
			console.log(' [ ' + logtime + ' ] ' + err);
		else
			console.log(' [ ' + logtime + ' ] ' + result);
	}); //async.waterfall
});	//	post

module.exports = router;















