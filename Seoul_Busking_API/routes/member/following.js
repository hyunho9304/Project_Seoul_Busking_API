/*
	URL : /member/following
	Description : 팔로잉하기 -> member 에서 cnt 조절
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		member_follow_nickname : String ,				//	팔로우 멤버( 현재 멤버 )
		member_following_nickname : String 				//	팔로잉 멤버( 확인 멤버 )
	}
*/
const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.put( '/' , function( req ,res ) {

	let member_follow_nickname = req.body.member_follow_nickname ;
	let member_following_nickname = req.body.member_following_nickname ;

	let uploadtime = moment().format( "YYYYMMDDHHmmss" ) ;

	let task = [

		function( callback ) {
	 		
			pool.getConnection( function( err , connection ) {
				if(err) {
					res.status(500).send( {
						status : "fail" ,
						msg : "internal server err"
					});
					callback( "getConnection err" ) ;
				} else {
					callback( null , connection ) ;
				}
			});	//	getConnection
		},	//	function

		function( connection , callback ) {

			let selectFollowingQuery = 'SELECT * FROM Following WHERE member_follow_nickname = ? AND member_following_nickname = ?' ;
			let queryArr = [ member_follow_nickname , member_following_nickname ] ;

			connection.query( selectFollowingQuery , queryArr , function( err , result ) {
				if( err ) {
					res.status(500).send( {
						status : "fail" ,
						msg : "internal server err"
					});
					connection.release() ;
					callback( "selectFollowingQuery err " + err ) ;
				} else {

					if( result.length == 0 ) {		//	following 하기 & 팔로잉수 팔로워 수 조절
						
						let insertFollowingQuery = 'INSERT INTO Following VALUES( ? , ? , ? , ? )' ;
						let queryArr = [ null , uploadtime , member_follow_nickname , member_following_nickname ] ;

						connection.query( insertFollowingQuery , queryArr , function( err , result2 ) {
							if( err ) {
								res.status(500).send( {
									status : "fail" ,
									msg : "internal server err"
								});
								connection.release() ;
								callback( "insertFollowingQuery err" + err ) ;
							} else {
								//	팔로잉 한 사람 + 1
								let updatefollowingCntQuery = 'UPDATE Member SET member_followingCnt = member_followingCnt + 1 WHERE member_nickname = ?' ;

								connection.query( updatefollowingCntQuery , member_follow_nickname , function( err , result3 ){
									if( err ) {
										res.status(500).send( {
											status : "fail" ,
											msg : "internal server err"
										});
										connection.release() ;
										callback( "updatefollowingCntQuery err" + err ) ;
									} else {
										//	팔로잉 당한 사람 + 1
										let updatefollowCntQuery = 'UPDATE Member SET member_followCnt = member_followCnt + 1 WHERE member_nickname = ?' ;

										connection.query( updatefollowCntQuery , member_following_nickname , function( err , result4 ){
											if( err ) {
												res.status(500).send( {
													status : "fail" ,
													msg : "internal server err"
												});
												connection.release() ;
												callback( "updatefollowCntQuery err" + err ) ;
											} else {
												let num = 1 ;
												connection.release() ;
												callback( null , num ) ;
											}
										}) ;
									}
								}) ;
							}
						});
					}
					else {	//	following 취소하기 & 팔로잉수 팔로워 수 조절

						let DeleteFollowingQuery = 'DELETE FROM Following WHERE member_follow_nickname = ? AND member_following_nickname = ?' ;
						let queryArr = [ member_follow_nickname , member_following_nickname ] ;

						connection.query( DeleteFollowingQuery , queryArr , function( err , result2 ) {
							if( err ) {
								res.status(500).send( {
									status : "fail" ,
									msg : "internal server err"
								});
								connection.release() ;
								callback( "DeleteFollowingQuery err" + err ) ;
							} else {
								//	팔로잉 취소 한 사람 - 1
								let updatefollowingCntQuery = 'UPDATE Member SET member_followingCnt = member_followingCnt - 1 WHERE member_nickname = ?'

								connection.query( updatefollowingCntQuery , member_follow_nickname , function( err , result3 ){
									if( err ) {
										res.status(500).send( {
											status : "fail" ,
											msg : "internal server err"
										});
										connection.release() ;
										callback( "updatefollowingCntQuery err" + err ) ;
									} else {
										//	팔로잉 취소 당한 사람 + 1
										let updatefollowCntQuery = 'UPDATE Member SET member_followCnt = member_followCnt - 1 WHERE member_nickname = ?'

										connection.query( updatefollowCntQuery , member_following_nickname , function( err , result4 ){
											if( err ) {
												res.status(500).send( {
													status : "fail" ,
													msg : "internal server err"
												});
												connection.release() ;
												callback( "updatefollowCntQuery err" + err ) ;
											} else {
												let num = 0 ;
												connection.release() ;
												callback( null , num ) ;
											}
										}) ;
									}
								}) ;
							}
						});
					}
				}
			}) ;
		} ,

		function( result , callback ) {

			res.status(201).send({
				status : "success" ,
				following : result ,
				msg: "successful upload following // successful delete following & adjust followingCnt"
			});
			callback ( null , "successful upload following // successful delete following & adjust followingCnt" ) ;
		}
	];

	async.waterfall(task, function(err, result) {

        let logtime = moment().format('MMMM Do YYYY, h:mm:ss a');

        if (err)
            console.log(' [ ' + logtime + ' ] ' + err);
        else
            console.log(' [ ' + logtime + ' ] ' + result);
    }); //async.waterfall
}) ;

module.exports = router;