/*
	URL : /member/review/upload
	Description : 리뷰 작성 & 멤버 평점 조절
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		review_fromNickname : String ,	//	리뷰 from 닉네임
		review_toNickname : String ,	//	리뷰 to 닉네임
		review_title : String ,			//	리뷰 제목
		review_content : String , 		//	리뷰 내용
		review_score : Int , 			//	리뷰 점수
	}
*/

const express = require('express');
const router = express.Router();
const pool = require('../../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

router.post('/', function(req, res) {

	let review_fromNickname = req.body.review_fromNickname ;
	let review_toNickname = req.body.review_toNickname ;
	let review_title = req.body.review_title ;
	let review_content = req.body.review_content ;
	let review_score = req.body.review_score ;

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

			let insertReviewQuery = 'INSERT INTO Review VALUES( ? , ? , ? , ? , ? , ? , ? )' ;
			let queryArr = [ null , review_fromNickname , review_toNickname , review_title , review_content , review_score , uploadtime ] ;

			connection.query( insertReviewQuery , queryArr , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "insertReviewQuery err" );
				} else {
					callback( null , connection );
				}
			}) ;	//	connection query
		} ,

		function( connection , callback ) {

			let selectMemberReviewScore = 'SELECT * FROM Review WHERE review_toNickname = ?' ;

			connection.query( selectMemberReviewScore , review_toNickname , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "selectMemberReviewScore err" );
				} else {

					var sum = 0 ;
					for( var i = 0 ; i < result.length ; i++ ) {
						sum += result[i].review_score ;
					}
					
					let tmpScore = sum / result.length ;
					let resultScore = tmpScore.toFixed(1) ;	//	소수점 이하 2번째자리에서 반올림

					callback( null , connection , resultScore) ;
				}
			}) ;	//	connection query
		} ,

		function( connection , resultScore , callback ) {

			let updateMemberScoreQuery = 'UPDATE Member SET member_score = ? WHERE member_nickname = ?' ;
			let queryArr = [ resultScore , review_toNickname ] ;

			connection.query( updateMemberScoreQuery , queryArr , function( err , result ) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						msg : "internal server err"
					}) ;
					connection.release() ;
					callback( "updateMemberScoreQuery err ")
				} else {
					res.status(201).send({
						status : "success" ,
						message : "successful review upload"
					});
					connection.release() ;
					callback( null , "successful review upload" );
				}
			}) ;	//	connection.query
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