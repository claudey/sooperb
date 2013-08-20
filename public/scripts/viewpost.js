// Initialize //
function init() {
	// make post-body textarea elastic
    $('textarea').elasticize();

    // Install submit button click listener
    $('#submit-btn').on('click', function (e) {
        checkForm(e);
    });
}

function checkForm(event) {
	event.preventDefault(); //Hold off form submission
	// Get fields to validate
	var toValidate = $('.validate').filter(function(index){return $(this).attr('disabled') != 'disabled'});
	
	// validate fields
	toValidate.each(function(index, field) {
	    return checks[$(field).attr('data-section')]($(field));
	});
	
	// toggle the error div depending on the error situation
	toggleError(err, $('#errors'));
	
	// Submit form if all clear
	if (!err.message) {
	    $(event.target).parents('#new-comment-form').submit();	    
	}
}