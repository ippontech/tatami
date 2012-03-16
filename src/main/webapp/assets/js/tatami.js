var nbTweets;

function resetNbTweets() {
	nbTweets = 20;
}

function incrementNbTweets() {
	nbTweets += 10;
}


function refreshHome() {
	$.ajax({
		type: 'GET',
		url: "rest/users/" + login + "/",
		dataType: "json",
		success: function(data) {
			$("#picture").empty();
            $("#picture").append('<img src="http://www.gravatar.com/avatar/' + data.gravatar + '?s=64" width="64px" />');

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
		return;
	}

	$.ajax({
        type: 'POST',
        url: "rest/tweets",
        contentType: "application/json",
        data: $("#tweetContent").val(),
        dataType: "json",
        success: function(data) {
            $("#tweetContent").val("");
            setTimeout(function() {
                        refreshHome();
                        listTweets(true);
                    }, 1000);	//DEBUG wait for persistence consistency
        }
    });
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
        	$('#refreshStatus').hide(300);
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

	$.ajax({
		type: 'GET',
		url: "rest/tweets/" + login + "/" + nbTweets,
		dataType: "json",
		success: function(data) {
			makeList(data, $('#tweetsList'), false);
			$('#mainTab').tab('show');
		}
	});
}

function listFriendTweets(friend) {
	$.ajax({
		type: 'GET',
		url: "rest/ownTweets/" + friend,
		dataType: "json",
		success: function(data) {
			makeList(data, $('#friendTweetsList'), true);
			$('#friendTab').tab('show');
		}
	});
}

function makeList(data, dest, friendListMode) {
	dest.fadeTo(400, 0, function () {	//DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
		dest.empty();

		$.each(data, function(entryIndex, entry) {
			var html = '<tr valign="top">';
			// identification de l'émetteur du message
			html += '<td class="tweetPicture">';
			if (login != entry['login']) {
				html += '<a href="#" onclick="listFriendTweets(\'' + entry['login'] + '\')" title="Show tweets">';
			}
			html += '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=64" width="64px" />';
			if (login != entry['login']) {
				html += '</a>';
			}
			html += '</td>';
			html += '<td><article>';
			html += '<strong>' + entry['firstName'] + ' ' + entry['lastName'] + '</strong>&nbsp;<em>@' + entry['login'] + '</em><br/>';
			// contenu du message
			html += entry['content'];
			html += '</article></td>';
			// colonne de suppression des abonnements
			html += '<td class="tweetFriend">';
			if (login != entry['login']) {
				if (friendListMode) {
					html += '<a href="#" onclick="addFriend(\'' + entry['login'] + '\')" title="Follow"><i class="icon-star" /></a>';
				} else {
					html += '<a href="#" onclick="removeFriend(\'' + entry['login'] + '\')" title="Forget"><i class="icon-star-empty" /></a>';
				}
			} else {
				html += '&nbsp;';
			}
			html += '</td>';
			// temps écoulé depuis la publication du message
			html += '<td class="tweetDate">' + entry['prettyPrintTweetDate'] + '</td>';
			html += '</tr>';
	
			dest.append(html);
		});

		dest.fadeTo(400, 1);
	});
}


function addFriend() {
	var url = "rest/users/" + login + "/addFriend";
	$.ajax({
		type: 'POST',
		url: url,
		contentType: "application/json",
		data: $('#friendInput').val(),
		dataType: "json",
        success: function(data) {
            $("#friendInput").val("");
            setTimeout(refreshHome, 1000);	//DEBUG wait for persistence consistency
        }
	});
}
function addFriend(friend) {
	var url = "rest/users/" + login + "/addFriend";
	$.ajax({
		type: 'POST',
		url: url,
		contentType: "application/json",
		data: friend,
		dataType: "json",
        success: alert('Friend added.')
	});
}

function removeFriend(friend) {
	var url = "rest/users/" + login + "/removeFriend";
	$.ajax({
		type: 'POST',
		url: url,
		contentType: "application/json",
		data: friend,
		dataType: "json",
        success: function(data) {
            setTimeout(refreshHome, 1000);	//DEBUG wait for persistence consistency
        }
	});
}
