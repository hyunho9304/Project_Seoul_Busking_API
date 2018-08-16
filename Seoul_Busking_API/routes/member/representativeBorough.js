/*
	URL : /member/representativeBorough
	Description : 멤버 대표 자치구 index 가져오기
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		member_nickname : String		//	닉네임
	}
*/

const express = require('express');
const router = express.Router();
const pool = require('../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

const crypto = require('crypto');

router.post('/', function(req, res) {

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

		function( connection , callback ) {

			let checkRepresentativeBoroughQuery = 'SELECT * FROM Member M , SeoulBorough SB WHERE M.sb_id = SB.sb_id AND member_nickname = ?' ;
			
			connection.query( checkRepresentativeBoroughQuery , member_nickname , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "checkRepresentativeBoroughQuery err") ;
				} else {
					res.status(201).send({
						status : "success" ,
						data : {
							sb_id : result[0].sb_id ,
							sb_name : result[0].sb_name
						} ,
						message : "successful get member representativeBorough"
					}) ;
					connection.release() ;
					callback( null , "successful get member representativeBorough" ) ;
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





























