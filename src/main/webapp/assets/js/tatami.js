var nbTweets;

function resetNbTweets() {
	nbTweets = 20;
}

function incrementNbTweets() {
	nbTweets += 10;
}


function refreshProfile() {
	$.ajax({
		type: 'GET',
		url: "rest/users/" + login + "/",
		dataType: "json",
		success: function(data) {
			$("#picture").parent().css('width', '68px');	// optional
            $("#picture").attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar + '?s=64');

            $("#firstName").text(data.firstName);
			$("#lastName").text(data.lastName);
			$("#tweetCount").text(data.tweetCount);
			$("#friendsCount").text(data.friendsCount);
			$("#followersCount").text(data.followersCount);
		}
	});
}


function tweet() {
	if ($("#tweetContent").val() == "") {
		alert('Please type a message.');
		return false;
	}

	$.ajax({
        type: 'POST',
        url: "rest/tweets",
        contentType: "application/json",
        data: $("#tweetContent").val(),
        dataType: "json",
        success: function(data) {
            $("#tweetContent").slideUp().val("").slideDown('fast');
            setTimeout(function() {
                        refreshProfile();
                        listTweets(true);
                    }, 1000);	//DEBUG wait for persistence consistency
        }
    });

	return false;
}

var ws;

function statusTweets() {
	if ($('#refreshStatus').is(':hidden'))	$('#refreshStatus').fadeIn();

	if (window.WebSocket) {
		$('#refreshStatus').text("Connecting WebSocket...");

		var ws = new WebSocket("ws://localhost:8080/ws/tweets");	//FIXME URL relative
		ws.onopen = function(event) {
			$('#refreshStatus').text("No new tweets");
			// à la création, le service initialise un compteur correspondant au nb de tweets de la timeline
		}
		ws.onmessage = function(event) {
			// pour chaque incrément interne de ce nb de tweets, un message est envoyé au client (nous)
			$('#refreshStatus').text(event.data);
		}

		ws.onclose = function(event) {
			statusTweets();	// ... réouverture du service en boucle
		}

	} else {
		$('#refreshStatus').text("No WebSocket support enabled");
        setTimeout(function() {
        	$('#refreshStatus').fadeOut("slow");
        }, 4000);
	}
}

function listTweets(reset) {
	if (ws) {
		// quand l'utilisateur prend la décision de rafraîchir sa timeline,
		// on ferme la connexion pour relancer le polling...
		ws.close();
	}

	if (reset)	resetNbTweets();
	else		incrementNbTweets();

	$.ajax({
		type: 'GET',
		url: "rest/tweets/" + login + "/" + nbTweets,
		dataType: "json",
		success: function(data) {
			makeTweetsList(data, $('#tweetsList'), true);
			$('#mainTab').tab('show');
		}
	});
}

function listUserTweets(login) {
	$.ajax({
		type: 'GET',
		url: "rest/ownTweets/" + login,
		dataType: "json",
		success: function(data) {
			makeTweetsList(data, $('#userTweetsList'), false);
			$('#userTab').tab('show');
		}
	});
}

function makeTweetsList(data, dest, timelineMode) {
	dest.fadeTo(400, 0, function() {	//DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
		dest.empty();

		$.each(data, function(entryIndex, entry) {
			var userline;
			if (timelineMode && login != entry['login']) {
				userline = '<a href="#" style="text-decoration:none" onclick="listUserTweets(\'' + entry['login'] + '\')" title="Show tweets">';
			}

			var html = '<tr valign="top">';
			// identification de l'émetteur du message
			html += '<td style="width: 34px; ">';
			if (userline)	html += userline;
			html += '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" />';
			if (userline)	html += '</a>';
			html += '</td>';
			html += '<td><article>';
			html += '<strong>' + entry['firstName'] + ' ' + entry['lastName'] + '</strong>&nbsp;';
			if (userline)	html += userline;
			html += '<em>@' + entry['login'] + '</em>';
			if (userline)	html += '</a>';
			// contenu du message
			html += '<br/>' + entry['content'];
			html += '</article></td>';
			// colonne de suppression des abonnements
			html += '<td class="tweetFriend">';
			if (timelineMode && login != entry['login']) {
				html += '<a href="#" onclick="removeFriend(\'' + entry['login'] + '\')" title="Forget"><i class="icon-star-empty" /></a>';
			} else {
				html += '&nbsp;';
			}
			html += '</td>';
			// temps écoulé depuis la publication du message
			html += '<td class="tweetDate"><aside>' + entry['prettyPrintTweetDate'] + '</aside></td>';
			html += '</tr>';
	
			dest.append(html);
		});

		dest.fadeTo(400, 1);
	});
}

function listTweeters() {
	$.ajax({
		type: 'GET',
		url: "rest/tweeters",
		dataType: "json",
		success: function(data) {
			makeUsersList(data, $('#followersList'));
		}
	});
}

function makeUsersList(data, dest) {
	dest.fadeTo(400, 0, function() {	//DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
		dest.empty();

		$.each(data, function(entryIndex, entry) {
			var userline;
			if (login != entry['login']) {
				userline = '<a href="#" style="text-decoration:none" onclick="listUserTweets(\'' + entry['login'] + '\')" title="Show tweets">';
			}

			var html = '<tr valign="top">';
			// identification de l'émetteur du message
			html += '<td>';
			if (userline)	html += userline;
			html += '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ';
			html += '<em>@' + entry['login'] + '</em>';
			if (userline)	html += '</a>';
			html += '</td>';
			// colonne de suppression des abonnements
			html += '<td class="tweetFriend">';
			if (userline) {
				html += '<a href="#" onclick="followUser(\'' + entry['login'] + '\')" title="Follow"><i class="icon-star" /></a>';
			} else {
				html += '&nbsp;';
			}
			html += '</td>';
			html += '</tr>';
	
			dest.append(html);
		});

		dest.fadeTo(400, 1);
	});
}

function followUser(loginToFollow) {
	$.ajax({
		type: 'POST',
		url: "rest/users/" + login + "/followUser",
		contentType: "application/json",
		data: loginToFollow,
		dataType: "json",
        success: function(data) {
            $("#followUserInput").val("");
            setTimeout(function() {
                refreshProfile();
                listTweets(true);
            }, 500);	//DEBUG wait for persistence consistency
        },
    	error: function(xhr, ajaxOptions, thrownError) {
    		$('#followStatus').fadeIn("fast").text(thrownError);
            setTimeout($('#followStatus').fadeOut("slow"), 2000);
    	}
	});

	return false;
}

function removeFriend(friend) {
	$.ajax({
		type: 'POST',
		url: "rest/users/" + login + "/removeFriend",
		contentType: "application/json",
		data: friend,
		dataType: "json",
        success: function(data) {
            setTimeout(refreshProfile(), 500);	//DEBUG wait for persistence consistency
        }
	});
}
