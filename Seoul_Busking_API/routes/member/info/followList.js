/*
	URL : /member/info/followList
	Description : selectMember의 팔로워 리스트
	Content-type : x-www-form-urlencoded
	method : POST - body
	Body = {
		member_selectMemberNickname : String 	//	확인 하고 싶은 닉네임
	}
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.post( '/' , function( req ,res ) { 

	let member_selectMemberNickname = req.body.member_selectMemberNickname ;

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

			let selectFollowingListQuery = 'SELECT * FROM Member M , Following F WHERE M.member_nickname = F.member_follow_nickname AND F.member_following_nickname = ? ORDER BY if(ASCII(SUBSTRING(F.member_follow_nickname , 1)) < 128, 9, 1) ASC , F.member_follow_nickname ASC' ;

			connection.query( selectFollowingListQuery , member_selectMemberNickname , function( err , result ) {
				if( err ) {
					res.status(500).send( {
						status : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "selectFollowingListQuery err" ) ;
				} else{

					let list = [] ;

					for( var i = 0 ; i < result.length ; i++ ) {

						let data = {

							member_profile : result[i].member_profile ,
							member_nickname : result[i].member_follow_nickname ,
							member_category : result[i].member_category
						}
						list.push( data ) ;
					}

					connection.release() ;
					callback( null , list ) ;
				}
			});
		} ,

		function( list , callback ) {

			res.status(201).send({
				status : "success" ,
				data : list ,
				message : "successful get followList"
			});
			callback ( null , "successful get followList" ) ;
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