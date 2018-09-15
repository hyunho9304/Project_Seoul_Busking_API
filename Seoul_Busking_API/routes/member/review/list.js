/*
	URL : /member/review/list
	Description : 멤버 리뷰 리스트
	Content-type : x-www-form-urlencoded
	method : GET - query
	query = /?review_toNickname={ 가지고 오고 싶은 사람 닉네임 }
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.post( '/' , function( req , res ) {

	let review_toNickname = req.body.review_toNickname ;

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

			let selectMemberScoreQuery = 'SELECT * FROM Member WHERE member_nickname = ?' ;

			connection.query( selectMemberScoreQuery , review_toNickname , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectMemberScoreQuery err") ;
				} else {
					callback( null , connection , result ) ;
				}
			}) ;
		} ,

		function( connection , object , callback ) {

			let selectReviewQuery = 'SELECT * FROM Member M , Review R WHERE M.member_nickname = R.review_fromNickname AND R.review_toNickname = ? ORDER BY R.review_uploadtime DESC' ;

			connection.query( selectReviewQuery , review_toNickname , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectReviewQuery err") ;
				} else {

					let list = [] ;
					var scoreCnt = [ 0 , 0 , 0 , 0 , 0 ] ;

					for( var i = 0 ; i < result.length ; i++ ) {

						if( result[i].review_score == 1 )
							scoreCnt[4] += 1
						else if( result[i].review_score == 2 )
							scoreCnt[3] += 1
						else if( result[i].review_score == 3 )
							scoreCnt[2] += 1
						else if( result[i].review_score == 4 )
							scoreCnt[1] += 1
						else
							scoreCnt[0] += 1

						let data = {
							review_title : result[i].review_title ,
							review_uploadtime : moment(result[i].review_uploadtime).format('YYYY. MM. DD') ,
							review_score : result[i].review_score ,
							review_fromNickname : result[i].review_fromNickname ,
							member_profile : result[i].member_profile ,
							review_content : result[i].review_content
						}
						list.push( data )
					}

					connection.release() ;
					callback( null , object[0].member_score , result.length , scoreCnt , list ) ;
				}
			}) ;
		} ,

		function( member_score , totalCnt , scoreCnt , list , callback ) {

			res.status(200).send({
				status : "success" ,
				member_score : member_score ,
				totalCnt : totalCnt ,
				scoreCnt : scoreCnt ,
				data : list ,
				message : "successful get reviewList"
			}) ;
			callback( null , "successful get reviewList") ;
		}
	] ;

	async.waterfall(task, function(err, result) {

        let logtime = moment().format('MMMM Do YYYY, h:mm:ss a');

        if (err)
            console.log(' [ ' + logtime + ' ] ' + err);
        else
            console.log(' [ ' + logtime + ' ] ' + result);
    }); //async.waterfall
}) ;

module.exports = router;













