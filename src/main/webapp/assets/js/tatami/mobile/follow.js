
function loadWhoToFollow()
{
	$('#followPanel').empty();
	$('#followPanel').load('fragments/mobile/suggestions.html #followline',function()
	{
		refreshUserSuggestions();
		registerUserSearchListener();
	});
}

function refreshUserSuggestions()
{
	$.ajax({
		type: HTTP_GET,
		url: 'rest/users/suggestions',
		dataType: JSON_DATA,
        success: function(data)
        {
    		var $tableBody = $('#userSuggestions');
    		$tableBody.empty();
        	if(data.length>0)
    		{
	        	$.each(data,function(index, user)
	        	{        		
	        		$tableBody.append(fillUserTemplate(user));
	        	});
	        	
    		}
        	else
        	{
        		$newUserLine = $('#emptyUserTemplate').clone().attr('id','').appendTo($tableBody);
        	}	
        	
        }
    });	
}

function followUser(loginToFollow) {
	
	$('#followErrorPanel').hide();
	
	$.ajax({
		type: HTTP_POST,
		url: "rest/users/" + login + "/followUser",
		contentType: JSON_CONTENT,
		data: loginToFollow,
		dataType: JSON_DATA,
        success: function(data) {

			setTimeout(function()
			{
	            $("#followUserInput").val("");
	            updateUserCounters();
	            refreshUserSuggestions();
			},300);

        },
    	error: errorHandler($('#followErrorPanel'))
	});

	return false;
}

function removeFriend(friend) {
	
	$('#followErrorPanel').hide();
	
	$.ajax({
		type: HTTP_POST,
		url: "rest/users/" + login + "/removeFriend",
		contentType: "application/json;  charset=UTF-8",
		data: friend,
		dataType: JSON_DATA,
        success: function(data) {

			setTimeout(function()
			{
	        	updateUserCounters();	
	        	refreshUserSuggestions();
			},300);

        },
    	error: errorHandler($('#followErrorPanel'))
	});
}
