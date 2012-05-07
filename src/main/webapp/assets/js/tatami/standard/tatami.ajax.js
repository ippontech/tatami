/**
 * Ajax functions.
 *
 * See Twitter's API : https://dev.twitter.com/docs/api
 *
 * Timelines
 * --------
 * POST /statuses/update -> create a new Tweet
 * POST /statuses/destroy/:id -> delete Tweet
 * GET  /statuses/home_timeline -> get the latest tweets from the current user
 * GET  /statuses/user_timeline?screen_name=jdubois -> get the latest tweets from user "jdubois"
 * GET  /search?q=keywords&page=m&rpp=n -> get the tweets matching the keywords, from the page m, containing n tweets
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
 * Account
 * --------
 * POST /account/update_profile -> update the current user
 *
 * Favorites
 * --------
 * GET  /favorites -> get the favorite tweets of the current user
 * POST /favorites/create/:id -> Favorites the tweet
 * POST /favorites/destroy/:id -> Unfavorites the tweet
 *
 *
 * Tags (does not exist in Twitter)
 * --------
 * GET  /tags -> get the latest tweets with no tags
 * GET  /tags/ippon -> get the latest tweets tagged with "ippon"
 *
 * Stats (does not exist in Twitter)
 * --------
 * GET  /stats/day -> statistics for today
 * GET  /stats/week -> statistics for this week
 *
 */

/**
 * POST /statuses/update -> create a new Tweet
 */
function postTweet(callback) {
    var tweet = $('#tweetContent');
    if (tweet.val() != "") {
        $.ajax({
            type: 'POST',
            url: "/tatami/rest/statuses/update",
            contentType: 'application/json; charset=UTF-8',
            data: tweet.val(),
            dataType: 'json',
            success: function(data) {
                callback(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                tweet.parent().parent().find("div.error").empty().append(errorThrown);
            }
        });
    }
}

/**
 * POST /statuses/destroy/:id -> delete Tweet
 */
function removeTweet(tweetId) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/statuses/destroy/" + tweetId,
        dataType: "json",
        success: function(data) {
            setTimeout(function() {
                refreshProfile();
                $('.id-' + tweetId).fadeOut();
            }, 500); //DEBUG wait for persistence consistency
        }
    });
}

/**
 * GET  /statuses/home_timeline -> get the latest tweets from the current user
 */
function listTweets(reset) {
    var url = "/tatami/rest/statuses/home_timeline";
    if (!reset && bottomTweetId != undefined) {
        url += "?max_id=" + bottomTweetId;
    } else {
        $('#tweetsList').empty();
    }
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(data) {
            if (data.length > 0) {
                makeTweetsList(data, $('#tweetsList'));
                scrollLock = false;
            } else {
                $('#tweetsList').append('<tr class="tweet"><td colspan="4" style="text-align: center;">No more tweets...</td></tr>');
            }
        }
    });
}

/**
 * GET  /statuses/user_timeline?screen_name=jdubois -> get the latest tweets from user "jdubois"
 */
function listUserTweets(userLogin) {
    var url = "/tatami/rest/statuses/user_timeline?screen_name=" + userLogin;
    if (bottomTweetId != undefined) {
        url += "&max_id=" + bottomTweetId;
    }
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(data) {
            if (data.length > 0) {
                makeTweetsList(data, $('#tweetsList'));
                scrollLock = false;
            } else {
                $('#tweetsList').append('<tr class="tweet"><td colspan="4" style="text-align: center;">No more tweets...</td></tr>');
            }
        }
    });
}

/**
 * POST /account/update_profile -> update the current user
 */
function updateProfile() {
    $profileFormErrors = $("#updateUserForm").parent().find("div.error");
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/account/update_profile",
        contentType: "application/json",
        data: JSON.stringify($("#updateUserForm").serializeObject()),
        dataType: "json",
        success: setTimeout(function() {
            $profileFormErrors.empty();
            $('#profileTab').tab('show');
        }, 500)    //DEBUG wait for persistence consistency
    });
    return false;	// no page refresh
}

/**
 * POST /friendships/create -> follow user
 */
function postFollowUser(loginToFollow, callback) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/friendships/create",
        contentType: 'application/json; charset=UTF-8',
        data: '{"login":"' + loginToFollow + '"}',
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
function postUnfollowUser(loginToUnfollow, callback) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/friendships/destroy",
        contentType: 'application/json; charset=UTF-8',
        data: '{"login":"' + loginToUnfollow + '"}',
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * GET  /friends/lookup -> return extended data about the user's friends
 */
function lookupFriends(userLogin, callback) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/friends/lookup?screen_name=" + userLogin,
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
function lookupFollowers(userLogin, callback) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/followers/lookup?screen_name=" + userLogin,
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
function getUser(userLogin, callback) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/users/show?screen_name=" + userLogin,
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * GET  /favorites -> get the favorite tweets of the current user
 */
function getFavoriteTweets(callback) {
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
 * POST /favorites/create/:id -> Favorites the tweet
 */
function favoriteTweet(tweetId) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/favorites/create/" + tweetId,
        dataType: 'json',
        success: function(data) {
            var entity = $("." + tweetId + "-favorite");
            entity.attr("onclick", "unfavoriteTweet(\"" + tweetId + "\")");
            entity.empty();
            entity.append('<i class="icon-star-empty" />');
            $(".id-" + tweetId + " .tweetDate").addClass("favorite");
        }
    });
    return false;
}

/**
 * POST /favorites/destroy/:id -> Unfavorites the tweet
 */
function unfavoriteTweet(tweetId) {
    $.ajax({
        type: 'POST',
        url: "/tatami/rest/favorites/destroy/" + tweetId,
        dataType: 'json',
        success: function(data) {
            var entity = $("." + tweetId + "-favorite");
            entity.attr("onclick", "favoriteTweet(\"" + tweetId + "\")");
            entity.empty();
            entity.append('<i class="icon-star" />');
            $(".id-" + tweetId + " .tweetDate").removeClass("favorite");
        }
    });
    return false;
}

/**
 * GET  /users/search -> search user by login
 */
function searchUser(userLoginStartWith) {
    var suggest = $('#usersSuggestions');
    var searchTerm = userLoginStartWith;
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
                        suggest.append('<li><img src="http://www.gravatar.com/avatar/' + user.gravatar + '?s=16">' + user.login + '</li>');
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
 * GET  /tags -> get the latest tweets with no tags
 * GET  /tags/ippon -> get the latest tweets tagged with "ippon"
 */
function listTagTweets(tag) {
    if (page == "home") {  // home page
        $.ajax({
            type: 'GET',
            url: "/tatami/rest/tags" + (tag ? '/' + tag : '') + "/30",
            dataType: 'json',
            success: function(data) {
                $('#tagTweetsList').empty();
                makeTweetsList(data, $('#tagTweetsList'));
                $('#tagTab').tab('show');
            }
        });
        return false;
    } else {  // profile page
        window.location = "/tatami/?tag=" + tag;
    }
}

/**
 * GET  /search?q=keywords&page=m&rpp=n -> get the tweets matching the keywords, from the page m, containing n tweets
 */
function searchTweets(query) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/search?" + query,
        dataType: 'json',
        success: function(data) {
            $('#searchTweetsList').empty();
            makeTweetsList(data, $('#searchTweetsList'));
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

