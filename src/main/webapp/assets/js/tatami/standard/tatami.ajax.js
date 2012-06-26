/**
 * Ajax functions.
 *
 * See Twitter's API : https://dev.twitter.com/docs/api
 *
 * Timelines
 * --------
 * POST /statuses/update -> create a new Status
 * POST /statuses/destroy/:id -> delete Status
 * GET  /statuses/show/:id -> returns a single status, specified by the id parameter
 * GET  /statuses/home_timeline -> get the latest status from the current user
 * GET  /statuses/user_timeline?screen_name=jdubois -> get the latest status from user "jdubois"
 * GET  /search?q=keywords&page=m&rpp=n -> get the status matching the keywords, from the page m, containing n status
 *
 * Users
 * --------
 * GET  /users/show?screen_name=jdubois -> get the "jdubois" user
 * GET  /users/suggestions -> suggest users to follow
 * GET  /users/search -> search user by login
 *
 * Friends & Followers
 * -------
 * POST /friendships/create -> follow user
 * POST /friendships/destroy -> unfollow user
 * GET  /friends/lookup -> return extended data about the user's friends
 * GET  /followers/lookup -> return extended data about the user's followers
 *
 * Favorites
 * --------
 * GET  /favorites -> get the favorite status of the current user
 * POST /favorites/create/:id -> Favorites the status
 * POST /favorites/destroy/:id -> Unfavorites the status
 *
 *
 * Tags (does not exist in Twitter)
 * --------
 * GET  /tags -> get the latest status with no tags
 * GET  /tags/ippon -> get the latest status tagged with "ippon"
 *
 * Stats (does not exist in Twitter)
 * --------
 * GET  /stats/day -> statistics for today
 * GET  /stats/week -> statistics for this week
 *
 */

/**
 * POST /statuses/update -> create a new Status
 */
function postStatus(callback) {
    var status = $('#statusContent');
    if (status.val() != "") {
        $.ajax({
            type: 'POST',
            url: "/tatami/rest/statuses/update",
            contentType: 'application/json; charset=UTF-8',
            data: status.val(),
            dataType: 'json',
            success: function(data) {
                callback(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                status.parent().parent().find("div.error").empty().append(errorThrown);
            }
        });
    }
}

/**
 * POST /statuses/destroy/:id -> delete Status
 */
function removeStatus(statusId) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/statuses/destroy/" + statusId,
        dataType: "json",
        success: function(data) {
            setTimeout(function() {
                refreshProfile();
                $('.id-' + statusId).fadeOut();
            }, 500); //DEBUG wait for persistence consistency
        }
    });
}

/**
 * GET  /statuses/show/:id -> returns a single status, specified by the id parameter
 */
function getStatus(statusId) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/statuses/show/" + statusId,
        dataType: "json",
        success: function(data) {
            $('#statusList').children().remove();
            if (data != null) {
                makeStatusList([data], $('#statusList'));
                scrollLock = false;
            } else {
                $('#statusList').append('<tr class="status"><td colspan="4" style="text-align: center;">No status found !</td></tr>');
            }
        }
    });
}

/**
 * GET  /statuses/home_timeline -> get the latest status from the current user
 */
function listStatus(reset) {
    var url = "/tatami/rest/statuses/home_timeline";
    if (!reset && bottomStatusId != undefined) {
        url += "?max_id=" + bottomStatusId;
    } else {
        $('#statusList').empty();
    }
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(data) {
            $('.status-nothing').remove();
            if (data.length > 0) {
                makeStatusList(data, $('#statusList'));
                scrollLock = false;
            } else {
                $('#statusList').append('<tr class="status status-nothing"><td colspan="4" style="text-align: center;">Nothing more to display...</td></tr>');
            }
        }
    });
}

function updateStatusList(firstStatusId) {
    var url = "/tatami/rest/statuses/home_timeline?since_id=" + firstStatusId;
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(data) {
            $('#updateStatusList').remove();
            if (data.length == 1) {
                $('#statusList').prepend('<tr id="updateStatusList" onclick="listStatus(true);"><td colspan="4" style="text-align: center;">1 new status</td></tr>');
            } else if (data.length > 1) {
                $('#statusList').prepend('<tr id="updateStatusList" onclick="listStatus(true);"><td colspan="4" style="text-align: center;">' + data.length + ' new status</td></tr>');
            }
        }
    });
}

/**
 * GET  /statuses/user_timeline?screen_name=jdubois -> get the latest status from user "jdubois"
 */
function listUserStatus(username) {
    var url = "/tatami/rest/statuses/user_timeline?screen_name=" + username;
    if (bottomStatusId != undefined) {
        url += "&max_id=" + bottomStatusId;
    }
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(data) {
            $('.status-nothing').remove();
            if (data.length > 0) {
                makeStatusList(data, $('#statusList'));
                scrollLock = false;
            } else {
                $('#statusList').append('<tr class="status status-nothing"><td colspan="4" style="text-align: center;">Nothing more to display...</td></tr>');
            }
        }
    });
}

/**
 * POST /friendships/create -> follow user
 */
function postFollowUser(usernameToFollow, callback) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/friendships/create",
        contentType: 'application/json; charset=UTF-8',
        data: '{"username":"' + usernameToFollow + '"}',
        dataType: 'json',
        success: function(data) {
            callback(data);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $('#followStatus').fadeIn('fast').text(thrownError);
            setTimeout(followStatus.fadeOut('show'), 500);
        }
    });
    return false;
}

/**
 * POST /friendships/destroy -> unfollow user
 */
function postUnfollowUser(usernameToUnfollow, callback) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/friendships/destroy",
        contentType: 'application/json; charset=UTF-8',
        data: '{"username":"' + usernameToUnfollow + '"}',
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * GET  /friends/lookup -> return extended data about the user's friends
 */
function lookupFriends(username, callback) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/friends/lookup?screen_name=" + username,
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
    return false;
}

/**
 * GET  /followers/lookup -> return extended data about the user's followers
 */
function lookupFollowers(username, callback) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/followers/lookup?screen_name=" + username,
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
    return false;
}

/**
 * GET  /users/show?screen_name=jdubois -> get the "jdubois" user
 */
function getUser(username, callback) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/users/show?screen_name=" + username,
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * GET  /favorites -> get the favorite status of the current user
 */
function getFavoriteStatus(callback) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/favorites",
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * POST /favorites/create/:id -> Favorites the status
 */
function favoriteStatus(statusId) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/favorites/create/" + statusId,
        dataType: 'json',
        success: function(data) {
            var entity = $("." + statusId + "-favorite");
            entity.attr("onclick", "unfavoriteStatus(\"" + statusId + "\")");
            entity.empty();
            entity.append('<i class="icon-star-empty" />');
            $(".id-" + statusId + " .statusDate").addClass("favorite");
        }
    });
    return false;
}

/**
 * POST /favorites/destroy/:id -> Unfavorites the status
 */
function unfavoriteStatus(statusId) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/favorites/destroy/" + statusId,
        dataType: 'json',
        success: function(data) {
            var entity = $("." + statusId + "-favorite");
            entity.attr("onclick", "favoriteStatus(\"" + statusId + "\")");
            entity.empty();
            entity.append('<i class="icon-star" />');
            $(".id-" + statusId + " .statusDate").removeClass("favorite");
        }
    });
    return false;
}

/**
 * GET  /users/search -> search user by username
 */
function searchUser(usernameStartWith) {
    var suggest = $('#usersSuggestions');
    var searchTerm = usernameStartWith;
    searchTerm = (searchTerm.indexOf('@') == 0) ? searchTerm.substring(1, searchTerm.length) : searchTerm;

    if (searchTerm.length < 3) {
        suggest.hide();
    } else {
        $.ajax({
            type: 'GET',
            url: "/tatami/rest/users/search?q=" + searchTerm,
            dataType: 'json',
            success: function(data) {
                suggest.empty();
                if (null != data && data.length > 0) {
                    $.each(data, function(i, user) {
                        suggest.append('<li><img src="http://www.gravatar.com/avatar/' + user.gravatar + '?s=16">' + user.username + '</li>');
                    });
                    suggest.show();
                }
            }
        });
    }
}

/**
 * GET  /users/suggestions -> suggest users to follow
 */
function suggestUsersToFollow() {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/users/suggestions",
        dataType: 'json',
        success: function(data) {
            makeWhoToFollowList(data);
        }
    });
}

/**
 * GET  /tags -> get the latest status with no tags
 * GET  /tags/ippon -> get the latest status tagged with "ippon"
 */
function listTagStatus(tag) {
    if (page == "home") {  // home page
        $.ajax({
            type: 'GET',
            url: "/tatami/rest/tags" + (tag ? '/' + tag : '') + "/30",
            dataType: 'json',
            success: function(data) {
                $('#tagStatusList').empty();
                makeStatusList(data, $('#tagStatusList'));
                $('#tagTab').tab('show');
            }
        });
        return false;
    } else {  // profile page
        window.location = "/tatami/?tag=" + tag;
    }
}

/**
 * GET  /search?q=keywords&page=m&rpp=n -> get the status matching the keywords, from the page m, containing n status
 */
function searchStatus(query) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/search?" + query,
        dataType: 'json',
        success: function(data) {
            $('#searchStatusList').empty();
            makeStatusList(data, $('#searchStatusList'));
            $('#searchTab').tab('show');
        }
    });
}

/**
 * GET  /stats/day -> statistics for today
 */
function refreshPieChart() {
    $.ajax({
        type: 'GET',
        url: "rest/stats/day",
        dataType: "json",
        success: function(data) {
            makePieChartsList(data, $('#piechart_div'));
        }
    });
}

/**
 * GET  /stats/week -> statistics for this week
 */
function refreshPunchChart() {
    $.ajax({
        type: 'GET',
        url: "rest/stats/week",
        dataType: "json",
        success: function(data) {
            makePunchChartsList(data, $('#punchchart_div'));
        }
    });
}

