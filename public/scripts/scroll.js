function scrollTo(element) {
	$('html, body').animate({
		scrollTop: $(element).offset().top
	}, 400);
	location.hash = element.attr('id');
}