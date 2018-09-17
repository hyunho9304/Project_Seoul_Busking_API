/*
	URL : /reservation/list
	Description : 해당하는 날짜 , 자치구 , 존 에 따른 에약 목록 시작시간 순
	Content-type : x-www-form-urlencoded
	method : GET - query
	query = /?r_date={ 예약 날짜 }&sb_id={ 자치구 index }&sbz_id={ 존 index }
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;
const async = require( 'async' ) ;
const moment = require( 'moment' ) ;

router.get( '/' , function( req , res ) {

	let r_date = req.query.r_date ;
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

			let selectReservationListQuery = 'SELECT * FROM Reservation R , Member M WHERE R.member_nickname = M.member_nickname AND R.r_date = ? AND R.sb_id = ? AND R.sbz_id = ? ORDER BY r_startTime ASC , r_startMin ASC' ;
			let queryArr = [ r_date , sb_id , sbz_id ] ;

			connection.query( selectReservationListQuery , queryArr , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectReservationListQuery err") ;
				} else {

					let list = [] ;

					for( var i = 0 ; i < result.length ; i++ ) {

						let data = {

							r_startTime : result[i].r_startTime ,
							r_startMin : result[i].r_startMin ,
							r_endTime : result[i].r_endTime ,
							r_endMin : result[i].r_endMin ,
							r_category : result[i].r_category ,
							member_profile : result[i].member_profile ,
							member_nickname : result[i].member_nickname
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
				message : "successful get reservation list"
			}) ;
			callback( null , "successful get reservation list") ;
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













