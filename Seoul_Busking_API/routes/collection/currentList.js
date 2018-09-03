/*
	URL : /collection/currentList
	Description : 현재시간 해당 자치구 공연목록
	Content-type : x-www-form-urlencoded
	method : GET - query
	query = /?r_date={오늘날짜}&r_time={현재시}&sb_id={ 자치구 index }
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.get( '/' , function( req , res ) {

	let r_date = req.query.r_date ;
	let r_time = req.query.r_time ;

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

			let selectBuskingZoneListQuery = 'SELECT * FROM SeoulBuskingZone ORDER BY sb_id ASC' ;

			connection.query( selectBuskingZoneListQuery , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectBuskingZoneListQuery err") ;
				} else {
					callback( null , connection , result ) ;
				}
			}) ;
		} ,

		function( connection , object , callback ) {

			let selectCurrentList = 'SELECT * FROM Reservation R , Member M WHERE R.member_nickname = M.member_nickname AND R.r_date = ? AND R.r_startTime <= ? AND R.r_endTime > ?' ;
			let queryArr = [ r_date , r_time , r_time] ;

			connection.query( selectCurrentList , queryArr , function( err , result ) {
				if( err ) {
					res.status(500).send( {
						status : "fail" ,
						msg : "internal server err"
					});
					connection.release() ;
					callback( "selectCurrentList err" + err ) ;
				} else {
					
					let list = [] ;

					for( var i = 0 ; i < object.length ; i++ ) {
						var index = -1 ;

						let data = {}
						for( var j = 0 ; j < result.length ; j++ ) {

							if( object[i].sbz_id == result[j].sbz_id ) {
								index = 1 ;
								data = {
									sbz_id : result[j].sbz_id ,
									r_startTime : result[j].r_startTime ,
									r_endTime : result[j].r_endTime ,
									r_category : result[i].r_category ,
									member_profile : result[j].member_profile ,
									member_nickname : result[j].member_nickname ,
									member_category : result[i].member_category ,
									member_score : result[j].member_score
								}
							}
						}

						if( index != 1 ) {		//	공연 없음
							data = {
								sbz_id : -1 ,
								r_startTime : -1 ,
								r_endTime : -1 ,
								member_profile : "-1" ,
								member_nickname : "-1" ,
								member_category : "-1" ,
								member_score : -1
							}
						}

						list.push( data )
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
				message : "successful get cuurentList"
			}) ;
			callback( null , "successful get cuurentList") ;
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













