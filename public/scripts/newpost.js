// Initialize //
function init() {
	// make post-body textarea elastic
    $('textarea').elasticize();

    // guidelines toggler click listener
    $('.toggler').on('click', function(e) {
        var toggler = $(this);
        e.preventDefault();
        $('.guidelines .body').slideToggle(300, function() {
        toggler.html(($('.guidelines .body').is(':hidden')) ? '[+]' : '[-]');
        });
    });

    function removeLink(ev) {
    	console.log('you clicked.')
        ev.preventDefault(); console.log($('.image-fields input').length);
        $(this).prev('input').remove();
        $(this).remove();
    }

    // Add click listener to the first remove_link
    $('.remove_link').on('click', removeLink);

    // Add/Remove file input fields
    $('#add-image').on('click', function() {
        var images_div = $('.image-fields');
        var new_img_num = $('.image-fields input').length + 1;

        // Append new input
        $('<input name="post[images]" id="image' + new_img_num + '" type="file" class="image-file" /><a href="#" title="Remove File" id="remove_file' + new_img_num + '" class="remove_link"> x </a>').appendTo(images_div);
        
        // Listen for click to remove input
        $('#remove_file' + new_img_num).on('click', removeLink);
    });

    // Install submit button click listener
    $('#submit-btn').on('click', function (e) {
        checkForm(e);
    })
}

function updateImageSources() {
	// Update image src attributes (in the post body) with corresponding images
	var postBody = $('#post-body').val(); // get the post body
	
	// Get & prefix files selected for upload
	var toUpload = $('.image-file').filter(function(index) {
		return ($(this).val() == "") ? false : true;
	}).map(function(index, item) {
	    var file = item.value.replace(/\\/g, '|');
		var i = '/images/' + file.substring(file.lastIndexOf('|') + 1);
		return 'src="' + i + '"';
	});
	
	// Update the body text
	for (var i = 0; i < toUpload.length; i++) {
	    var n = i + 1, srcReg = new RegExp('src="' + n + '"');
	    postBody = postBody.replace(srcReg, toUpload[i]);
	}

	// Update the post body
	$('#post-body').val(postBody);
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
		updateImageSources();
	    $(event.target).parents('.new-post-form').submit();	    
	}
}