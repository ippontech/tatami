/* Functions called by tatami.js that deal about users */

function displayProfile() {
    getUser(username, function(data) {
        $("#pictureInput").attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar + '?s=64');
        $("#emailInput").val(data.email);
        $("#firstNameInput").val(htmlDecode(data.firstName));
        $("#lastNameInput").val(htmlDecode(data.lastName));
    });
}

function refreshProfile() {
    getUser(username, function(data) {
        $("#picture").attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar + '?s=64');
        $("#profile_view").html("<a href='/tatami/profile/" + username + "/'><h3>" +
            data.firstName + " " + data.lastName + "</h3>@" +
            username + "</a>");
        $("#statusCount").text(data.statusCount);
        $("#friendsCount").text(data.friendsCount);
        $("#followersCount").text(data.followersCount);
    });
}

// Follow a user from the home page
function followUserHome(usernameToFollow) {
    postFollowUser(usernameToFollow, function(data) {
        $("#followUserInput").val("");
        setTimeout(function() {
            refreshProfile();
            suggestUsersToFollow();
            listStatus(true);
        }, 500);	//DEBUG wait for persistence consistency
    });
    return false;
}

// Follow a user from the profile page
function followUserProfile(usernameToFollow) {
    postFollowUser(usernameToFollow, function(data) {
        $('#followBtn').slideUp();
        $('#unfollowBtn').slideDown();
    });
    return false;
}

// Unfollow a user from the profile page
function unfollowUserProfile(usernameToFollow) {
    postUnfollowUser(usernameToFollow, function(data) {
        $('#unfollowBtn').slideUp();
        $('#followBtn').slideDown();
    });
    return false;
}

function makeWhoToFollowList(data) {
    dest = $('#suggestions');
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {    //DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        var updated = false;
        $.each(data, function(entryIndex, entry) {
            var suggestedUserName = entry['username'];
            if (username != suggestedUserName) {
                userline = userlineURL.replace(userlineREG, suggestedUserName);
            }

            var html = '<tr valign="top"><td>';
            if (userline) {
                html += userline;
            }
            html += '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ';
            html += '<em>@' + entry['username'] + '</em>';
            if (userline) {
                html += '</a>';
            }
            html += '</td></tr>';
            dest.append(html);
            updated = true;
        });
        if (!updated) {
            dest.append('<tr valign="top"><td colspan="2">No new user to follow today...</td></tr>');
        }
        dest.fadeTo(DURATION_OF_FADE_TO, 1);
    });
}

function makeFollowingList() {
    dest = $('#followingList');
    dest.empty();
    lookupFriends(username, function(data) {
        $.each(data, function(entryIndex, entry) {
            userline = userlineURL.replace(userlineREG, entry['username']);
            var html = '<tr valign="top"><td>' +
                userline +
                '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ' +
                entry['firstName'] + ' ' +
                entry['lastName'] +
                '<em>@' + entry['username'] + '</em></a>' +
                '</td></tr>';

            dest.append(html);
        });
    });
}

function makeFollowersList() {
    dest = $('#followersList');
    dest.empty();
    lookupFollowers(username, function(data) {
        $.each(data, function(entryIndex, entry) {
            userline = userlineURL.replace(userlineREG, entry['username']);
            var html = '<tr valign="top"><td>' +
                userline +
                '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ' +
                entry['firstName'] + ' ' +
                entry['lastName'] +
                '<em>@' + entry['username'] + '</em></a>' +
                '</td></tr>';

            dest.append(html);
        });
    });
}

