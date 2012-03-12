function tweet(login) {
    $.ajax({
        type: 'POST',
        url: "rest/tweets",
        contentType: "application/json",
        data: $("#tweetContent").val(),
        dataType: "json",
        success: function(data) {
            $("#tweetContent").val("");
            setTimeout(
                    function() {
                        refreshHome(login);
                        listTweets(login);
                    }, 1000);
        }
    });
}

function listTweets(login) {
	$.ajax({
		type: 'GET',
		url: "rest/tweets",
		dataType: "json",
		success: function(data) {
			$('#tweetsList').empty();
			$.each(data, function(entryIndex, entry) {
				var html = '<tr valign="top">';
				html += '<td class="tweetPicture"><img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=64" width="64px" /></td>';
				html += '<td>';
				html += '<strong>' + entry['firstName'] + ' ' + entry['lastName'] + '</strong>&nbsp;<em>@' + entry['login'] + '</em><br/>';
				html += entry['content'];
				html += '</td>';
				html += '<td class="tweetFriend"><a href="javascript:addFriend(\'' + entry['login'] + '\')" title="Follow"><i class="icon-heart" /></a></td>';
				html += '<td class="tweetDate">' + entry['prettyPrintTweetDate'] + '</td>';
				html += '</tr>';
				$('#tweetsList').append(html);
			});
		}
	});
}

function addFriend(login, friend) {
	var url = "rest/users/" + login + "/addFriend";
	$.ajax({
		type: 'POST',
		url: url,
		contentType: "application/json",
		data: friend,
		dataType: "json"
	});
}

function refreshHome(login) {
	$.ajax({
		type: 'GET',
		url: "rest/users/" + login + "/",
		dataType: "json",
		success: function(data) {
            $("#picture").replaceWith('<img src="http://www.gravatar.com/avatar/' + data.gravatar + '?s=64" width="64px" />');
			$("#firstName").text(data.firstName);
			$("#lastName").text(data.lastName);
			$("#tweetCount").text(data.tweetCount);
			$("#friendsCount").text(data.friendsCount);
			$("#followersCount").text(data.followersCount);
		}
	});
}
