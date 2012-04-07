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
	$.ajax({
		type: 'POST',
		url: "rest/users/" + login,
		contentType: "application/json",
		data: JSON.stringify($("#updateUserForm").serializeObject()),
		dataType: "json",
		success: setTimeout(function() {
			$('#defaultTab').tab('show');
			$profileFormErrors.empty();
		}, 1000)	//DEBUG wait for persistence consistency
		error: function(jqXHR, textStatus, errorThrown){
	       	$profileFormErrors.empty().append(errorThrown);
	    }	
	});
	return false;	// no page refresh
}

function displayProfile() {
	$.ajax({
		type: 'GET',
		url: "rest/users/" + login,
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
