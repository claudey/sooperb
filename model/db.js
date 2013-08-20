/*
* Module Dependencies
*/

var mongoose 		= 		require('mongoose'),
	moment 			= 		require('moment'),
	Schema 			= 		mongoose.Schema;

// Connect to the database
var dbUriString = 	process.env.MONGOLAB_URI || 
					process.env.MONGOHQ_URL  || 
					'mongodb://localhost/nanablog';

mongoose.connect(dbUriString, function (err, conn) {
	if (err) { 
		console.log ('ERROR connecting to: ' + dbUriString + '. ' + err);
	} else {
		console.log ('Successfully connected to: ' + dbUriString);
	}
});

// Schema & Model Definitions
var CommentSchema = new Schema({
	author: String,
	body: String,
	created_at: {
		type: Date, 
		default: Date.now
	}
});

// Fetch relative string for how long ago comment was created
CommentSchema.methods.ago = function () {
	return moment(this.created_at).fromNow();
}

var PostSchema = new Schema({
	title: String,
	body: String,
	categories: [String],
	author: {
		type: String,
		default: "nanaewusi"
	},
	created_at: {
		type: Date, 
		default: Date.now
	},
	comments: [CommentSchema]
});

// Fetch the post date in the format: Month Day
PostSchema.methods.when = function () {
	return moment(this.created_at).format('MMM DD');
}

// Fetch relative string for how long ago post was created
PostSchema.methods.ago = function () {
	return moment(this.created_at).fromNow();
}

// Fetch the urlEncoded title
PostSchema.methods.titleToUri = function(addCommentHash) {
	return encodeURIComponent(this.title) + ((addCommentHash) ? '#comments' : '');
}

// Fetch string representing the number of comments on the post
PostSchema.methods.howManyComments = function () {
	return (this.comments.length == 0) ? 
			'no comments' : ((this.comments.length == 1) ?
					 '1 comment' : this.comments.length + ' comments');
}


// Compile Schemas into Models
mongoose.model( 'Post', PostSchema );
mongoose.model( 'Comment', CommentSchema );