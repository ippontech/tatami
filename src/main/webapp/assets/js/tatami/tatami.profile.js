
function updateProfile() {
	$profileFormErrors = $("#updateUserForm").parent().find("div.error");
	$.ajax({
		type: 'POST',
		url: "rest/users/" + login,
		contentType: "application/json",
		data: JSON.stringify($("#updateUserForm").serializeObject()),
		dataType: "json",
		success: setTimeout(function() {
			$profileFormErrors.empty();
			$('#profileTab').tab('show');
		}, 500)	//DEBUG wait for persistence consistency
	});
	return false;	// no page refresh
}

function displayProfile() {
	$.ajax({
		type: 'GET',
		url: "/tatami/rest/users/" + login,
		dataType: "json",
		success: function(data) {
			$("#emailInput").val(data.email);
			$("#firstNameInput").val(htmlDecode(data.firstName));
			$("#lastNameInput").val(htmlDecode(data.lastName));
		}
	});
}

function refreshProfile() {
	$.ajax({
		type: 'GET',
		url: "/tatami/rest/users/" + login,
		dataType: "json",
		success: function(data) {
			$("#picture").parent().css('width', '68px');	// optional
            $("#picture").attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar + '?s=64');
            $("#firstName").html(data.firstName);
			$("#lastName").html(data.lastName);
			$("#tweetCount").text(data.tweetCount);
			$("#friendsCount").text(data.friendsCount);
			$("#followersCount").text(data.followersCount);
		}
	});
}
