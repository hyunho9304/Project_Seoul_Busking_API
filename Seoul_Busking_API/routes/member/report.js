/*
	URL : /member/report
	Description : 리뷰 작성 & 멤버 평점 조절
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		report_fromNickname : String ,	//	신고 from 닉네임
		report_toNickname : String ,	//	신고 to 닉네임
		report_title : String ,			//	신고 제목
		report_content : String , 		//	신고 내용
	}
*/

const express = require('express');
const router = express.Router();
const pool = require('../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

router.post('/', function(req, res) {

	let report_fromNickname = req.body.report_fromNickname ;
	let report_toNickname = req.body.report_toNickname ;
	let report_title = req.body.report_title ;
	let report_content = req.body.report_content ;

	let uploadtime = moment().format( "YYYYMMDDHHmmss" ) ;

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

			let insertReportQuery = 'INSERT INTO Report VALUES( ? , ? , ? , ? , ? , ? )' ;
			let queryArr = [ null , report_fromNickname , report_toNickname , report_title , report_content , uploadtime ] ;

			connection.query( insertReportQuery , queryArr , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "insertReportQuery err" );
				} else {
					res.status(201).send({
						status : "success" ,
						message : "successful report upload"
					});
					connection.release() ;
					callback( null , "successful report upload" );
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