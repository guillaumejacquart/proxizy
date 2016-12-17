$(document).ready(function() {

  $('a.delete').click(function(e){
	e.preventDefault();
	var url = $(this).attr('href');
	if(confirm('Are you sure ?')){
		$.ajax({
			url: url,
			type: 'DELETE',
			success: function(result) {
				if(result.status == 'OK' && result.redirectUrl){
					document.location.href = result.redirectUrl;
				}
			}
		});
	}
  });

});