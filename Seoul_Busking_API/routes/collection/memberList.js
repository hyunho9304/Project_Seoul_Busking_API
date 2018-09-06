/*
	URL : /collection/memberList
	Description : 멤버 전체에 대한 리스트
	Content-type : x-www-form-urlencoded
	method : GET
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.get( '/' , function( req ,res ) { 

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
			//	이름정렬( 한글 먼져 영어 나중 )
			let selectMemberList = 'SELECT * FROM Member ORDER BY if(ASCII(SUBSTRING(member_nickname , 1)) < 128, 9, 1) ASC , member_nickname ASC' ;

			connection.query( selectMemberList , function( err , result ) {
				if( err ) {
					res.status(500).send( {
						status : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "selectMemberList err" ) ;
				} else{
						
					let list = [] ;

					for( var i = 0 ; i < result.length ; i++ ) {

						let data = {

							member_profile : result[i].member_profile ,
							member_nickname : result[i].member_nickname ,
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

			res.status(200).send({
				status : "success" ,
				data : list ,
				message : "successful get memberList"
			});
			callback ( null , "successful get memberList" ) ;
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