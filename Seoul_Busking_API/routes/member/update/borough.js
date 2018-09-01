/*
	URL : /member/update/borough
	Description : 멤버 대표 자치구 변경
	Content-type : x-www-form-urlencoded
	method : PUT - Body
	Body = {
		sb_id : Int		//	자치구 index
	}
*/

const express = require( 'express' ) ;
const router = express.Router() ;
const pool = require( '../../../config/dbPool' ) ;
const async = require( 'async' ) ;
const moment = require( 'moment' ) ;

router.put( '/' , function( req , res ) {

	let member_nickname = req.body.member_nickname ;
	let sb_id = req.body.sb_id ;

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

			let updateBoroughQuery = 'UPDATE Member SET sb_id = ? WHERE member_nickname = ?' ;
			let queryArr = [ sb_id , member_nickname ] ;

			connection.query( updateBoroughQuery , queryArr , function( err , result ) {
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
						message : "successful updateBoroughQuery"
					});
					connection.release() ;
					callback( null , "successful updateBoroughQuery" );
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