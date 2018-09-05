/*
	URL : /collection/rankingList
	Description : 해당되는 장르에 별점 or 팔로우 순으로 랭킹
	Content-type : x-www-form-urlencoded
	method : POST - body
	Body = {
		select1 : String ,				//	선택1
		select2 : String 				//	선택2
	}
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.post( '/' , function( req ,res ) {

	let select1 = req.body.select1 ;
	let select2 = req.body.select2 ;

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

			let selectMemberRanking = '' ;

			if( select1 === "전체" ) {

				if( select2 === "팔로우 순" ) {


				} else {	//	전체 별점 순

					selectMemberRanking = 'SELECT * FROM Member WHERE member_type = 1 ORDER BY member_score DESC'

					connection.query( selectMemberRanking ,  function( err , result ) {
						if( err ) {
							res.status(500).send( {
								status : "fail" ,
								message : "internal server err"
							});
							connection.release() ;
							callback( "selectMemberRanking err" ) ;
						} else{
							
							let list = [] ;

							for( var i = 0 ; i < result.length ; i++ ) {

								if( i == 100 )
									break

								let data = {

									member_num : ( i + 1 ) ,
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
				}
			} else {

				if( select2 === "팔로우 순" ) {

				} else {

					selectMemberRanking = 'SELECT * FROM Member WHERE member_type = 1 AND member_category = ? ORDER BY member_score DESC'

					connection.query( selectMemberRanking , select1 , function( err , result ) {
						if( err ) {
							res.status(500).send( {
								status : "fail" ,
								message : "internal server err"
							});
							connection.release() ;
							callback( "selectMemberRanking err" ) ;
						} else{
							
							let list = [] ;

							for( var i = 0 ; i < result.length ; i++ ) {

								if( i == 100 )
									break

								let data = {

									member_num : ( i + 1 ) ,
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
				}
			}
		} ,

		function( list , callback ) {

			res.status(201).send({
				status : "success" ,
				data : list ,
				message : "successfully get RankingList"
			});
			callback ( null , "successfully get RankingList" ) ;
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