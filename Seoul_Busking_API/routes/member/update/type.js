/*
	URL : /member/update/type
	Description : 멤버 버스커 전환 신청
	Content-type : x-www-form-urlencoded
	method : PUT - Body
	Body = {
		member_ID : String			//	멤버 아이디
		member_category : String 	//	선택한 카테고리
	}
*/

const express = require( 'express' ) ;
const router = express.Router() ;
const pool = require( '../../../config/dbPool' ) ;
const async = require( 'async' ) ;
const moment = require( 'moment' ) ;

router.put( '/' , function( req , res ) {

	let member_ID = req.body.member_ID ;
	let member_category = req.body.member_category ;

	let task = [

		function( callback ) {
			pool.getConnection( function( err , connection ) {
				if( err ){	
					res.status(500).send({
						status : "fail" ,
						msg : "internal server err"
					});
					callback( "internal server err" ) ;
				} else {
					callback( null , connection ) ;
				}
			}) ;	//	pool.getConnection
		} ,	//	function

		function( connection , callback ) {

			let selectMemberQuery = 'SELECT * FROM Member WHERE member_ID = ?' ;

			connection.query( selectMemberQuery , member_ID , function( err , result ) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						msg : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectMemberQuery err ")
				} else {
					callback( null , connection , result );
				}
			}) ;	//	connection.query
		} ,	//	function

		function( connection , object , callback ) {

			let updateMemberTypeQuery = 'UPDATE Member SET member_type = ? , member_category = ? WHERE member_ID = ?' ;
			let queryArr = [ "1" , member_category , member_ID ] ;

			connection.query( updateMemberTypeQuery , queryArr , function( err , result ) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						msg : "internal server err"
					}) ;
					connection.release() ;
					callback( "updateBoroughQuery err ")
				} else {
					res.status(201).send({
						status : "success" ,
						data : {
							member_type : "1" ,
							member_nickname : object[0].member_nickname ,
							member_ID : member_ID
						} ,
						message : "successful updateMemberTypeQuery"
					});
					connection.release() ;
					callback( null , "successful updateMemberTypeQuery" );
				}
			}) ;	//	connection.query
		} ,	//	function
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