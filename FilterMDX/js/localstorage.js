$(function() {
	$('.swap_axis').on('click', function() {
       	if (localStorage.getItem('swap_axis') === 'row') {
    		localStorage.setItem('swap_axis', 'column');
       	}
       	else {
        	localStorage.setItem('swap_axis', 'row');	
       	}
 	});
});