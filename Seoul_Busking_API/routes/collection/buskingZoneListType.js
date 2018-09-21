/*
	URL : /collection/buskingZoneListType
	Description : 자치구에 따른 존 리스트
	Content-type : x-www-form-urlencoded
	method : GET - query
	query = /?sb_id={ 자치구 index }
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.get( '/' , function( req , res ) {

	let sb_id = req.query.sb_id ;

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

			let selectBuskingZoneListQuery = 'SELECT * FROM SeoulBuskingZone WHERE sb_id = ? AND sbz_type = 1 ORDER BY if(ASCII(SUBSTRING(sbz_name , 1)) < 128, 9, 1) ASC , sbz_name ASC' ;

			connection.query( selectBuskingZoneListQuery , sb_id , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectBuskingZoneListQuery err") ;
				} else {

					let list = [] ;

					for( var i = 0 ; i < result.length ; i++ ) {


						let data = {

							sbz_id : result[i].sbz_id ,
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
				message : "successful get buskingZoneList"
			}) ;
			callback( null , "successful get buskingZoneList") ;
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













