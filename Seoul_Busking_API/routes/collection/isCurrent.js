/*
	URL : /collection/currentList
	Description : 현재시간 공연목록
	Content-type : x-www-form-urlencoded
	method : GET - query
	query = /?r_date={오늘날짜}&r_time={현재시}&r_min={현재분}
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.post( '/' , function( req , res ) {

	let year = moment().format( "YYYY" ) ;
	let month = moment().format( "MM" ) ;
	let day = moment().format( "DD" ) ;
	let hour = moment().format( "HH" ) ;
	let min = moment().format( "mm" ) ;
	let datetime = year + month + day ;

	let sbz_id = req.body.sbz_id ;

	let r_date = datetime ;
	let r_time = hour ;
	let r_min = min ;

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

			let selectCurrentList = 'SELECT * FROM Reservation R , Member M WHERE R.member_nickname = M.member_nickname AND R.r_date = ? AND R.r_startTime <= ? AND R.r_endTime >= ? AND R.sbz_id = ? ORDER BY R.r_startTime DESC , R.r_startMin DESC' ;
			let queryArr = [ r_date , r_time , r_time , sbz_id ] ;

			connection.query( selectCurrentList , queryArr , function( err , result ) {
				if( err ) {
					res.status(500).send( {
						status : "fail" ,
						message : "internal server err"
					});
					connection.release() ;
					callback( "selectCurrentList err" + err ) ;
				} else {

					var index = -1 ;
					for( var i = 0 ; i < result.length ; i++ ) {
						if( r_time == result[i].r_startTime ) {
							if( r_min >= result[i].r_startMin ) {
								if( r_time == result[i].r_endTime ) {
									if( r_min <= result[i].r_endMin ) {
										index = i ;
										break ;
									}
								} else {
									index = i ;
									break ;
								}
							}
						} else if( r_time > result[i].r_startTime && r_time < result[i].r_endTime ) {
							index = i ;
							break ;
						} else if( r_time == result[i].r_endTime ) {
							if( r_min <= result[i].r_endMin ) {
								index = i ;
								break ;
							}
						}
					}

					if( index != -1 ) {
						res.status(201).send({
							status : "success" ,
							data : {
								sbz_id : result[index].sbz_id ,
	 							r_startTime : result[index].r_startTime ,
	 							r_startMin : result[index].r_startMin ,
								r_endTime : result[index].r_endTime ,
								r_endMin : result[index].r_endMin ,
								r_category : result[index].r_category ,
								member_profile : result[index].member_profile ,
								member_nickname : result[index].member_nickname ,
								member_score : result[index].member_score
							} ,
							message : "is current"
						}) ;
						connection.release() ;
						callback( null , "is current" ) ;
					} else {
						res.status(401).send({
							status : "success" ,
							data : {
							} ,
							message : "no current"
						}) ;
						connection.release() ;
						callback( "no current" ) ;
					}
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













