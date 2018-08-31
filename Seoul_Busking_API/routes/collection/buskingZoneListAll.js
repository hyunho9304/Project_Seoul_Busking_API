/*
	URL : /collection/buskingZoneListAll
	Description : 존 리스트 전체
	Content-type : x-www-form-urlencoded
	method : GET
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.get( '/' , function( req , res ) {

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

			let selectBuskingZoneListAllQuery = 'SELECT * FROM SeoulBorough SB , SeoulBuskingZone SBZ WHERE SB.sb_id = SBZ.sb_id ORDER BY sbz_id ASC' ;

			connection.query( selectBuskingZoneListAllQuery , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectBuskingZoneListAllQuery err") ;
				} else {

					let list = [] ;

					for( var i = 0 ; i < result.length ; i++ ) {

						let data = {
							sbz_id : result[i].sbz_id ,
							sb_name : result[i].sb_name ,
							sbz_name : result[i].sbz_name ,
							sbz_photo : result[i].sbz_photo ,
							sbz_address : result[i].sbz_address ,
							sbz_longitude : result[i].sbz_longitude ,
							sbz_latitude : result[i].sbz_latitude
						}

						list.push( data ) ;
					}
					connection.release() ;
					callback( null , list ) ;
				}
			}) ;
		} ,

		function( list , callback ) {

			res.status(200).send({
				status : "success" ,
				data : list ,
				message : "successful get buskingZoneListAll"
			}) ;
			callback( null , "successful get buskingZoneListAll") ;
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













