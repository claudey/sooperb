/*
* Module Dependencies
*/
var mongoose = require('mongoose'),
	Post = mongoose.model('Post');

function findAll(callback) {
	Post.find()
		.sort('-created_at')
		.exec(function (err, posts) {
			if (err) callback(err);
			callback(null, posts);
		});
}
function byTitle(title, callback) {
	Post.find()
		.where('title')
		.equals(title)
		.exec(function (err, post) {
			if (err) callback(err);
			callback(null, post[0]);
		})
}
function recent(num, skip, callback) {
	var skip = skip || 0;
	Post.find()
		.sort('-created_at')
		.skip(skip)
		.limit(num)
		.exec(function (err, posts) {
			if (err) callback(err);
			callback(null, posts);
		});
}
function count(callback) {
	Post.count({}, function (err, count) {
		if (err) callback(err);
		callback(null, count);
	});
}
function save(posts, callback) {
	posts = (posts instanceof Array) ? posts : [posts];
	Post.create(posts, function (err) {
		if (err) callback(err);
		else {
			var saved = Array.prototype.slice.call(arguments, 1);
			callback(null, saved);
		}
	});
}
function addComment(post, comment, callback) {
	post.comments.push(comment);
	post.save(function (err) {
		if (err) callback(err);
		else callback(null);
	});
}

exports.findAll = findAll;
exports.byTitle = byTitle;
exports.count = count;
exports.recent = recent;
exports.save = save;
exports.addComment = addComment;