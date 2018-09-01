/*
	URL : /reservation/attempt
	Description : 예약 시도
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		r_date : Int ,				//	예약 날짜
		r_startTime : Int , 		//	예약 시작 시간
		r_endTime : Int , 			//	예약 끝 시간
		r_category : String ,		//	예약 카테고리
		sb_id : Int , 				//	자치구 index
		sbz_id : Int , 				//	버스킹 존 index
		member_nickname : String  	//	멤버 닉네임
	}
*/

const express = require('express');
const router = express.Router();
const pool = require('../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

router.post('/', function(req, res) {

	let r_date = req.body.r_date ;
	let r_startTime = req.body.r_startTime ;
	let r_endTime = req.body.r_endTime ;
	let r_category = req.body.r_category ;
	let sb_id = req.body.sb_id ;
	let sbz_id = req.body.sbz_id ;
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

			let insertReservationQuery = 'INSERT INTO Reservation VALUES( ? , ? , ? , ? , ? , ? , ? , ?)' ;
			let queryArr = [ null , r_date , r_startTime , r_endTime , r_category , sb_id , sbz_id , member_nickname ] ;

			connection.query( insertReservationQuery , queryArr , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "insertReservationQuery err" );
				} else {
					res.status(201).send({
						status : "success" ,
						message : "successful reservation"
					});
					connection.release() ;
					callback( null , "successful reservation" );
				}
			}) ;	//	connection query
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