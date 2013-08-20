// Form Validation
var err = {};
var checks = {
    title: function(field) {
        var tests = [{
        	run: notEmpty,
	        errorMessage: 'Your post needs a title :)'
        }];

        // Run Tests
        return runTests(tests, field);
    },
    body: function(field) {
        var tests = [{
        	run: notEmpty,
	        errorMessage: 'Your post needs content :)'
        }, {
        	run: function () {
	        	var allowedTags = field.attr('data-allowed-tags').split(',');
	        	return noBadTags(field.val(), allowedTags);
	        },
	        errorMessage: 'You have unsupported tags in your post body.<br />Please see guidelines above for a list of allowed tags.'
        }, {
        	run: function () {
	        	var allowedClasses = field.attr('data-allowed-classes').split(',');
	        	return noBadClasses(field.val(), allowedClasses);
	        },
	        errorMessage: 'You have unsupported values in your class attribute(s).<br />Please see guidelines above for a list of allowed class attribute values.'
        }, { // Ensure post body images are correctly numbered
        	run: function () {
        	    var images = getTags($('#post-body').val(), 'img'), imageCount = images.length;
        	    var numbers = images.map(function(item, index) {
        	        var res = item.match(/src="(\d+)"/);
        	        return (res) ? res[1] : null;
        	    });
        	    return numbers.compare(range(1, imageCount+1));
	        },
	        errorMessage: 'Please number the images in your post correctly'
        }];

        // Run Tests
        return runTests(tests, field);
    },
    categories: function(field) {
        var tests = [{
        	run: function () {
	        	var categoryInputs = field.find('.category input');
	        	var atLeastOneChecked = false;
	        	categoryInputs.each(function (index, input) {
	        		if (input.checked) {
	        			atLeastOneChecked = true;
	        			return false;
	        		}
	        	})
	        	return atLeastOneChecked;
	        },
	        errorMessage: 'Your post must belong to at least one category'
        }];

        // Run Tests
        return runTests(tests, field);
    },
    images: function(field) {
    	var tests = [{ // Ensure images in post body = Files Selected for upload
        	run: function () {
        		// Fetch the body of the post
        		var postBody = field.prevAll('.body').find('#post-body').val();

        		// Count num of img tags present
	        	var imgTagsPresent = count('img', postBody);

	        	// Count num of files selected for upload
	        	var imgFilesUploaded = $('.image-file').filter(function(index) {
	        		return ($(this).val() == "") ? false : true;
	        	}).length;

	        	// match files selected for uploads against img tags used in post
	        	return (imgTagsPresent == imgFilesUploaded);
	        },
	        errorMessage: 'The number of images present in your post, does not match the number of files you have uploaded'
        }, { // Ensures only image files have been selected for upload
        	run: function () {
	        	// Get files selected for upload
	        	var imgFilesUploaded = $('.image-file').filter(function(index) {
	        		return ($(this).val() == "") ? false : true;
	        	});

	        	// Ensure only image files have been selected
	        	var noNonImageFilesPresent = true;
	        	imgFilesUploaded.each(function(index, field) {
	        		if (!isImageFile(field.value)) {
	        			return noNonImageFilesPresent = false;
	        		} 
	        	});
	        	return noNonImageFilesPresent;
	        },
	        errorMessage: 'Please select only image files for upload'
        }, { // Ensures duplicate files have not been selected for upload
        	run: function () {
        	    var hasDuplicates = false;
	        	var toUpload = $('.image-file').filter(function(index) {
	        		return ($(this).val() == "") ? false : true;
	        	});
	        	if (toUpload.length == 1) return true;
	        	var files = jQuery.makeArray(toUpload.map(function (index, item) {
	        	    return item.value;  
	        	}));
	        	files.forEach(function (item, index) {
	        	    if (files.count(item) > 1) {
	        	        hasDuplicates = true;
	        	        return false;
	        	    }
	        	});
	        	return (hasDuplicates) ? false : true;
	        },
	        errorMessage: 'You have uploaded multiple copies of the same file'
        }];
        
        // Run Tests
        return runTests(tests, field);
    }
}