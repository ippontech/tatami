var clickFromLink = false;

!function ( $ ) {

	// left panel
	loadProfile();
	loadWhoToFollow();
	
    // auto-refresh
    $('a[data-toggle="tab"]').on('show', function(e) {
    	if (e.target.hash == '#timelinePanel' || e.target.hash == '#userlinePanel' || e.target.hash == '#taglinePanel') {
    		if(!clickFromLink)
    		{	
    			setTimeout(refreshCurrentLine,10);
    		}	
    	}
    });
    
    
	$(function() {
		
		$.ajaxSetup({
			statusCode: 
			{
				901 : sessionTimeOutPopup
			}
		});
		// Bind click handler for "Status" button
		$('#statusButton').click(status);
		
		//Right panel
		loadEmptyLines();
		$('#picture').click(function()
		{
			var login = $('#picture').attr('data-user');
			showUserProfile(login);
			return false;
		});
		
	});

}( window.jQuery );


