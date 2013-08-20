/*
 * GET Blog Homepage.
 */

// Module Dependencies
var Posts 		= 		require('../model/post'),
	async 		= 		require('async');

// Load Routes
var init = function (app) {
	app.get('/', function (req, res) {
		var posts_per_page = 2, page_flag = parseInt(req.query.n) || 0;
		async.parallel([
		    function(callback){
		        Posts.recent(posts_per_page, page_flag, function (err, data) {
		        	if (err) callback(err);
		        	callback(null, data);
		        });
		    },
		    function(callback){
		        Posts.count(function (err, count) {
		        	if (err) callback(err);
		        	callback(null, count);
		        });
		    }
		], // Render homepage with results
		function(err, data){
		    if (err) res.send('Error fetching homepage :(');
		    var posts = data[0], totalPosts = data[1];
		    res.render('index', {
		    	title: 'A Blog about Entrepreneurship, Design & Code, by Nanawusi',
		    	posts: posts,
		    	pager: {
		    		older: {
		    			status: ((page_flag + posts_per_page) < totalPosts)
		    						? true : false,
		    			href: '/?n=' + (page_flag + posts_per_page)
		    		},
		    		newer: {
		    			status: (page_flag == 0) ? false : true,
		    			href: '/?n=' + (page_flag - posts_per_page)
		    		}
		    	}
		    });
		});
	});
}
exports.init = init;