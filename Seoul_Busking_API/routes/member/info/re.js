/*
	URL : /member/info/re
	Description : memberInfo 업데이트된것 가져오기
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		member_ID : String		//	아이디
	}
*/

const express = require('express');
const router = express.Router();
const pool = require('../../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

router.post('/', function(req, res) {

	let member_ID = req.body.member_ID ;

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

			let selectMemberInfoReQuery = 'SELECT * FROM Member WHERE member_ID = ?' ;
			
			connection.query( selectMemberInfoReQuery , member_ID , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectMemberInfoReQuery err") ;
				} else {
					res.status(201).send({
						status : "success" ,
						data : {
							member_type : result[0].member_type ,
							member_nickname : result[0].member_nickname ,
							member_ID : result[0].member_ID
						} ,
						message : "successful get member info RE"
					}) ;
					connection.release() ;
					callback( null , "successful get member info basic RE" ) ;
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





























