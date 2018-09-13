/*
	URL : /member/drop/reservation
	Description : 멤버 예약 삭제
	Content-type : x-www-form-urlencoded
	method : DELETE - Body
	Body = {
		r_id : Int		//	예약 index
	}
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../../config/dbPool' ) ;	
const async = require( 'async' ) ;
const moment = require( 'moment' ) ;

router.delete( '/' , function( req ,res ) {

	let r_id = req.body.r_id ;

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

			let deleteReservationQuery = 'DELETE FROM Reservation WHERE r_id = ?' ;

			connection.query( deleteReservationQuery , r_id , function( err , result ) {
				if( err ) {
					res.status(500).send( {
						status : "fail" ,
						msg : "internal server err"
					});
					connection.release() ;
					callback( "deleteReservationQuery err" + err ) ;
				} else {
					res.status(201).send({
						status : "success" ,
						msg : "successful delete reservation"
					}) ;
					connection.release() ;
					callback( null , "successful delete reservation" ) ;
				}
			}) ;
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