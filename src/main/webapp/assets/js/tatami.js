function refreshHome() {
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


function tweet() {
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
                        listTweets();
                    }, 1000);
        }
    });
}

var ws;

function statusTweets() {
	if (window.WebSocket) {
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
			$('#refreshStatus').text("");
			statusTweets();	// ... réouverture du service en boucle
		}
	}
}

function listTweets() {
	if (ws) {
		// quand l'utilisateur prend la décision de rafraîchir sa timeline,
		// on ferme la connexion pour relancer le polling...
		ws.close();
	}

	$.ajax({
		type: 'GET',
		url: "rest/tweets",
		dataType: "json",
		success: makeList
	});
}

function makeList(data) {
	$('#tweetsList').empty();

	$.each(data, function(entryIndex, entry) {
		var html = '<tr valign="top">';
		// identification de l'émetteur du message
		html += '<td class="tweetPicture"><img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=64" width="64px" /></td>';
		html += '<td>';
		html += '<strong>' + entry['firstName'] + ' ' + entry['lastName'] + '</strong>&nbsp;<em>@' + entry['login'] + '</em><br/>';
		// contenu du message
		html += entry['content'];
		html += '</td>';
		// colonne de suppression des abonnements
		html += '<td class="tweetFriend">';
		if (login != entry['login']) {
			html += '<a href="javascript:removeFriend(\'' + entry['login'] + '\')" title="Forget"><i class="icon-star-empty" /></a>';
		} else {
			html += '&nbsp;';
		}
		html += '</td>';
		// temps écoulé depuis la publication du message
		html += '<td class="tweetDate">' + entry['prettyPrintTweetDate'] + '</td>';
		html += '</tr>';

		$('#tweetsList').append(html);
	});
}


function addFriend() {
	var url = "rest/users/" + login + "/addFriend";
	$.ajax({
		type: 'POST',
		url: url,
		contentType: "application/json",
		data: $('#friendInput'),
		dataType: "json",
        success: function(data) {
            $("#friendInput").val("");
            setTimeout(refreshHome(), 1000);
        }
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
            setTimeout(refreshHome(), 1000);
        }
	});
}
