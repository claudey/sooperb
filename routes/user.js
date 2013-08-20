/*
 * GET users listing.
 */

var init = function (app) {
	app.get('/users', function (req, res) {
		res.send('Display list of users');
	});
}
exports.init = init;