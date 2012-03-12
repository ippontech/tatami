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
	$.ajax({
		type: 'POST',
		url: "rest/users/" + login,
		contentType: "application/json",
		data: JSON.stringify($("#updateUserForm").serializeObject()),
		dataType: "json",
	});
	return true;
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
