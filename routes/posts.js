/*
 * GET users listing.
 */

 // Module Dependencies
var		async 		= 		require('async'),
 		Posts 		= 		require('../model/post'),
 		path 		= 		require('path'),
 		fs 			= 		require('fs');

// Load Routes
var init = function (app) {
	// Display BlogPosts - Redirect to homepage
	app.get('/posts', function (req, res) {
		res.redirect('/');
	});

	// Display New-Post Form
	app.get('/posts/new', function (req, res) {
		res.render('new_post', { title: 'A Blog about Entrepreneurship, Design & Code, by Nanawusi', 
			allowedTags: 'p,a,img,div,blockquote,strong,br', 
			allowedClasses: 'sub-title,feature-description,indent,feature,feature-two,item'
		});
	});

	// Submit New Post
	app.post('/posts/new', function (req, res) {
		var post = req.body.post; // The post

		// Save any images included in the post body to disc
		var imagesUploaded = req.files.post.images;
		imagesUploaded = (imagesUploaded instanceof Array) ? imagesUploaded : [imagesUploaded];
		imagesUploaded = imagesUploaded.filter(function(item) {
			return item.lastModifiedDate != null;
		});
		
		// Iterator: Saves each image uploaded to file
		function saveImage(img, callback) {
			var file = fs.readFileSync(img.path),
				filename = path.normalize(__dirname 
							+ '/../public/images/' 
							+ img.name);

			fs.writeFile(filename, file, 'binary', function (err) {
				if (err) {
					console.log('Error saving image to file.');
					callback(err);
				} else {
					console.log('Saved ' + img.name + ' to file.');
					callback(null);
				}
			});
		}

		// Call to save posts
		function save(post, callback) {
			Posts.save(post, function (err, post) {
				if (err) callback(err);
				else callback(null, post);
			});
		}

		// Write images (if any) to file & save the post when done
		if (imagesUploaded.length) {
			async.each(imagesUploaded, saveImage, function (err) {
				if (err) {
					console.log(err);
					throw err;
				}
				// OK to save the post
				save(post, function (err, post) {
					if (err) throw err;
					res.redirect('/');
				});
			});
		} else {
			// Save the post
			save(post, function (err, post) {
				if (err) throw err;
				res.redirect('/');
			});
		}
	});

	// Fetch particular post
	app.get('/posts/:id', function (req, res) {
		var title = req.params.id;
		Posts.byTitle(title, function (err, post) {
			if (err) throw err;
			if (!post) {
				res.send('The page you requested does not exist');
			} else {
				res.render('viewpost', {
					title: 'A Blog about Entrepreneurship, Design & Code, by Nanawusi',
					post: post,
					allowedTags: 'a,blockquote,em,strong'
				});
			}
		});
	});

	// Update a post: With Comments in this case
	app.post('/posts/:id', function (req, res) {
		var title = req.params.id;
		var comment = {
			author: req.body.author,
			body: req.body.comment
		};
		async.waterfall([
		    function(callback){
		    	Posts.byTitle(title, function (err, post) {
		    		if (err) callback(err);
		    		if (!post) callback(new Error('404: Page not found.'));
		    		else callback(null, post);
		    	});
		    },
		    function(post, callback){
		        Posts.addComment(post, comment, function (err) {
					if (err) callback(new Error('Error saving the comment.'));
					else callback(null, post);
				});
		    }
		], function (err, post) {
		   	if (err) res.send(err.message);
		  	else res.redirect('/posts/' + post.titleToUri(true));
		});
	});
}
exports.init = init;