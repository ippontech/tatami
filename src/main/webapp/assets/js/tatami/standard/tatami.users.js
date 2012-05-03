/* Functions called by tatami.js that deal about users */

function displayProfile() {
    getUser(login, function(data) {
        $("#emailInput").val(data.email);
        $("#firstNameInput").val(htmlDecode(data.firstName));
        $("#lastNameInput").val(htmlDecode(data.lastName));
    });
}

function refreshProfile() {
    getUser(login, function(data) {
        $("#picture").parent().css('width', '68px');	// optional
        $("#picture").attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar + '?s=64');
        $("#profile_view").html("<a href='/tatami/profile/" + login + "'><h3>" +
            data.firstName + " " + data.lastName + "</h3>@" +
            login + "</a>");
        $("#tweetCount").text(data.tweetCount);
        $("#friendsCount").text(data.friendsCount);
        $("#followersCount").text(data.followersCount);
    });
}

// Follow a user from the home page
function followUserHome(loginToFollow) {
    postFollowUser(loginToFollow, function(data) {
        $("#followUserInput").val("");
        setTimeout(function() {
            refreshProfile();
            suggestUsersToFollow();
            listTweets(true);
        }, 500);	//DEBUG wait for persistence consistency
    });
    return false;
}

// Follow a user from the profile page
function followUserProfile(loginToFollow) {
    postFollowUser(loginToFollow, function(data) {
        $('#followBtn').slideUp();
        $('#unfollowBtn').slideDown();
    });
    return false;
}

// Unfollow a user from the profile page
function unfollowUserProfile(loginToFollow) {
    postUnfollowUser(loginToFollow, function(data) {
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
            var suggestedLogin = entry['login'];
            if (login != suggestedLogin) {
                userline = userlineURL.replace(userlineREG, suggestedLogin);
            }

            var html = '<tr valign="top"><td>';
            if (userline) {
                html += userline;
            }
            html += '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ';
            html += '<em>@' + entry['login'] + '</em>';
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
    lookupFriends(userLogin, function(data) {
        $.each(data, function(entryIndex, entry) {
            userline = userlineURL.replace(userlineREG, entry['login']);
            var html = '<tr valign="top"><td>' +
                userline +
                '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ' +
                entry['firstName'] + ' ' +
                entry['lastName'] + '</a> ' +
                '<em>@' + entry['login'] + '</em>' +
                '</td></tr>';

            dest.append(html);
        });
    });
}

function makeFollowersList() {
    dest = $('#followersList');
    dest.empty();
    lookupFollowers(userLogin, function(data) {
        $.each(data, function(entryIndex, entry) {
            userline = userlineURL.replace(userlineREG, entry['login']);
            var html = '<tr valign="top"><td>' +
                userline +
                '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ' +
                entry['firstName'] + ' ' +
                entry['lastName'] + '</a> ' +
                '<em>@' + entry['login'] + '</em>' +
                '</td></tr>';

            dest.append(html);
        });
    });
}

