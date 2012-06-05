/*
* Manage the status list.
*/

//Create a Status
function status() {
    postStatus(function(data) {
        var status = $('#statusContent');
        status.slideUp().empty().slideDown('fast');
        status.parent().parent().find("div.error").empty();
        status.val("");
        setTimeout(function() {
            refreshProfile();
            $('#refreshStatus').click();
        }, 500);
    });
    return false;
}

//Create a Status sent to a user (from the "profile" page).
function statusToUser() {
    postStatus(function(data) {
        var status = $('#statusContent');
        status.slideUp().empty().slideDown('fast');
        status.parent().parent().find("div.error").empty();
        status.val("@" + username + " ");
    });
    return false;
}

// Get the favorites, on the home page.
function favoriteStatuses() {
    getFavoriteStatus(function(data) {
        $('#favStatusList').empty();
        makeStatusList(data, $('#favStatusList'));
    });
    return false;
}

var bottomStatusId;

function makeStatusList(data, dest) {
    $.each(data, function(entryIndex, entry) {
        var userlineLink = userlineURL.replace(userlineREG, encodeURI(entry['username']));

        var template = $('#template_status').html();
        var content = entry['content']
            .replace(userrefREG, userrefURL)
            .replace(tagrefREG, tagrefURL)
            .replace(url1REG, url1URL)
            .replace(url2REG, url2URL);
        var data = {'userlineLink' : userlineLink,
            'username' : entry['username'],
            'firstName':entry['firstName'],
            'lastName':entry['lastName'],
            'content':content,
            'statusId':entry['statusId'],
            'gravatar':entry['gravatar'],
            'prettyPrintStatusDate':entry['prettyPrintStatusDate'],
            'favorite':entry['favorite'],
            'isUserName' : username == entry['username']
        };

        var html = Mustache.render(template, data);

        dest.append(html);
        bottomStatusId = entry['statusId'];
    });
}

function showActions(statusId) {
    $("." + statusId + "-actions").show();
}

function hideActions(statusId) {
    $("." + statusId + "-actions").hide();
}