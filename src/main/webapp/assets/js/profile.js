$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function updateProfile() {
	$profileFormErrors = $("#updateUserForm").parent().find("div.error");
	setTimeout($.ajax({
		type: 'POST',
		url: "/tatami/rest/users/" + login,
		contentType: "application/json",
		data: JSON.stringify($("#updateUserForm").serializeObject()),
		dataType: "json",
		success: function() {
			$profileFormErrors.empty();
			$('#defaultTab').tab('show');
		},	//DEBUG wait for persistence consistency
		error: function(jqXHR, textStatus, errorThrown){
	       	$profileFormErrors.empty().append(errorThrown);
	       	$('#updateProfilTab').tab('show');
	    }
	}), 1000);
	return false;	// no page refresh
}

function displayProfile() {
	$.ajax({
		type: 'GET',
		url: "/tatami/rest/users/" + login,
		dataType: "json",
		success: function(data) {
			$("#emailInput").val(data.email);
			$("#firstNameInput").val(data.firstName);
			$("#lastNameInput").val(data.lastName);
		}
	});
}

function refreshProfile() {
	$.ajax({
		type: 'GET',
		url: "/tatami/rest/users/" + login + "/",
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
