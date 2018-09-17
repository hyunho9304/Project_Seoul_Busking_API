/*
	URL : /member/info/followingReservationList
	Description : 해당 멤버 팔로잉 예약 리스트
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		member_nickname : String		//	닉네임
	}
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.post( '/' , function( req , res ) {

	let member_nickname = req.body.member_nickname ;
	let r_date = req.body.r_date ;

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

			let selectFollowingReservationQuery = 'SELECT * FROM Member M , Reservation R , Following F , SeoulBuskingZone SBZ ' +
												  'WHERE M.member_nickname = R.member_nickname AND R.member_nickname = F.member_following_nickname AND R.sbz_id = SBZ.sbz_id ' +
												  'AND F.member_follow_nickname = ? AND R.r_date >= ? ORDER BY R.r_date ASC , R.r_startTime ASC' ;
			let queryArr = [ member_nickname , r_date ] ;

			connection.query( selectFollowingReservationQuery , queryArr , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectFollowingReservationQuery err") ;
				} else {

					let list = [] ;

					for( var i = 0 ; i < result.length ; i++ ) {

						let data = {

							member_profile : result[i].member_profile ,
							member_nickname : result[i].member_following_nickname ,
							r_category : result[i].r_category ,
							r_date : result[i].r_date ,
							r_startTime : result[i].r_startTime ,
							r_startMin : result[i].r_startMin ,
							r_endTime : result[i].r_endTime ,
							r_endMin : result[i].r_endMin ,
							sbz_name : result[i].sbz_name
						}
						list.push( data ) ;
					}
					connection.release() ;
					callback( null , list ) ;
				}
			}) ;
		} ,

		function( list , callback ) {

			res.status(201).send({
				status : "success" ,
				data : list ,
				message : "successful get followingReservationList"
			}) ;
			callback( null , "successful get followingReservationList") ;
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













