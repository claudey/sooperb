// Will run tests (as specified by the tests variable) on the given field
function runTests(tests, field) {
	for (var i = 0; i < tests.length; i++) {
		var test = tests[i];
		if (test.run.call(null, field)) { // test passed
			err.message = null;
		} else { // test failed, break
			err.message = test.errorMessage;
			err.field = field;
			break;
		}
	};
	if (err.message) {
		return false;
	} else {
		// Dehighlight field if currently highlighted
		field.removeClass('error');
		return true;
	}
}

function toggleError(err, errorDiv) {
	if (err.message) {
		// Show error message
		errorDiv.html(err.message);
		errorDiv.removeClass('hidden');

		// Highlight problem field
		err.field.addClass('error');

		// Pan page to error div
		scrollTo(errorDiv);
	} else {
		// Hide error message
		errorDiv.html('');
		errorDiv.addClass('hidden');

		// De-Highlight highighted field
		if (err.field)
			err.field.removeClass('error');
	}
}