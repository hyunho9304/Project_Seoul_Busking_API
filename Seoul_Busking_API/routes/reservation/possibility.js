/*
	URL : /reservation/possibility
	Description : 에약 가능 확인
	Content-type : x-www-form-urlencoded
	method : GET - query
	query = /?r_date={ 예약 날짜 }&r_time={ 현재시간 }&sb_id={ 자치구 index }&sbz_id={ 존 index }
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;
const async = require( 'async' ) ;
const moment = require( 'moment' ) ;

router.get( '/' , function( req , res ) {

	let r_date = req.query.r_date ;
	let r_today = req.query.r_today ;
	let r_time = req.query.r_time ;
	let sb_id = req.query.sb_id ;
	let sbz_id = req.query.sbz_id ;

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

			let selectReservationPossibilityQuery = 'SELECT * FROM Reservation WHERE r_date = ? AND sb_id = ? AND sbz_id = ? ORDER BY r_startTime ASC' ;
			let queryArr = [ r_date , sb_id , sbz_id ] ;

			connection.query( selectReservationPossibilityQuery , queryArr , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectReservationPossibilityQuery err") ;
				} else {

					let list = [ 1 , 1 , 1 , 1 , 1 ] ;

					for( var i = 0 ; i < result.length ; i++ ) {

						switch( result[i].r_startTime ) {
							case 17 :
							list[0] = 0 ; break ;
							case 18 :
							list[1] = 0 ; break ;
							case 19 :
							list[2] = 0 ; break ;
							case 20 :
							list[3] = 0 ; break ;
							case 21 :
							list[4] = 0 ; break ;
							default :
							break ;
						}
						switch( result[i].r_endTime ) {
							case 18 :
							list[0] = 0 ; break ;
							case 19 :
							list[1] = 0 ; break ;
							case 20 :
							list[2] = 0 ; break ;
							case 21 :
							list[3] = 0 ; break ;
							case 22 :
							list[4] = 0 ; break ;
							default :
							break ;
						}
					}

					console.log( r_today );
					console.log( r_date );
					
					let timeArr = [ 17 , 18 , 19 , 20 , 21 , 22 ] ;
					for( var i = 0 ; i < timeArr.length ; i ++ ) {
						if( r_time >= timeArr[i] && r_today == r_date )
							list[i] = -1 ;
					}

					connection.release() ;
					callback( null , list ) ;
				}
			}) ;
		} ,

		function( list , callback ) {

			res.status(200).send({
				status : "success" ,
				data : {
					possibility : list
				} ,
				message : "successful get reservation possibility"
			}) ;
			callback( null , "successful get reservation possibility") ;
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













