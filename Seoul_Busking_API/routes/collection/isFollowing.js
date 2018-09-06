/*
	URL : /collection/isfollowing
	Description : 팔로우하는지 안하는지
	Content-type : x-www-form-urlencoded
	method : POST - body
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

router.post( '/' , function( req ,res ) {

	let member_follow_nickname = req.body.member_follow_nickname ;
	let member_following_nickname = req.body.member_following_nickname ;

	let task = [

		function( callback ) {

			pool.getConnection( function( err , connection ) {
				if(err) {
					res.status( 500).send( {
						status : "fail" ,
						message : "internal server err"
					});
					callback( "getConnection err") ;
				} else {
					callback( null , connection ) ;
				}
			});
		} ,

		function( connection , callback ) {

			let selectIsfollowingQuery = 'SELECT * FROM Following WHERE member_follow_nickname = ? AND member_following_nickname = ?'
			let queryArr = [ member_follow_nickname , member_following_nickname ] ;

			connection.query( selectIsfollowingQuery , queryArr , function( err , result ) {
				if( err ) {
					res.status(500).send( {
						status : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "selectIsfollowingQuery err" ) ;
				} else{
					
					if( result.length != 0 ) {
						res.status(201).send({
							status : "success" ,
							message : "successful get isfollowing 1"
						});
						connection.release() ;
						callback ( null , "successful get isfollowing 1" ) ;
					} else {
						res.status(401).send({
							status : "success" ,
							message : "successful get isfollowing 0"
						});
						connection.release() ;
						callback ( null , "successful get isfollowing 0" ) ;
					}
				}
			});
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