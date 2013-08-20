// Form Validation
var err = {};
var checks = {
    author: function(field) {
        var tests = [{
        	run: notEmpty,
	        errorMessage: 'What would you like to be called :)'
        }];

        // Run Tests
        return runTests(tests, field);
    },
    comment: function(field) {
        var tests = [{
        	run: notEmpty,
	        errorMessage: 'You have not added your comment :('
        }, {
        	run: function () {
	        	var allowedTags = field.attr('data-allowed-tags').split(',');
	        	return noBadTags(field.val(), allowedTags);
	        },
	        errorMessage: 'You have unsupported tags in your comment.<br />Please see guide above for a list of allowed tags.'
        }];

        // Run Tests
        return runTests(tests, field);
    }
}