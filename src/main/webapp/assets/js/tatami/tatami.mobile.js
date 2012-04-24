function refreshTweet() {
    jQuery.ajax({
        type:'GET',
        url:"rest/tweets/" + login + "/" + DEFAULT_NUMBER_OF_TWEETS_TO_DISPLAY,
        dataType:'json',
        success:function (data) {

            $("#tweetList").empty();
            $.each(data, function (entryIndex, entry) {
                var line = '<li class="ui-li-desc">' +
                    '<a href="#">' +
                    '<img src="http://www.gravatar.com/avatar/' + entry["gravatar"] + '"/>' +
                    '' + entry["content"] + '' +
                    '</a>' +
                    '</li>';
                $("#tweetList").append(line);

            });
            $("#tweetList").listview("refresh")
        },
        error:function (jqXHR, textStatus, errorThrown) {
            alert("error");
        }

    });
}

function listFavorite() {
    $.ajax({
        type:'GET',
        url:"rest/favTweets/" + login,
        dataType:'json',
        success:function (data) {

            $("#favoritesTweet").empty();
            $.each(data, function (entryIndex, entry) {
                var line = '<li class="ui-li-desc">' +
                    '<a href="#">' +
                    '<img src="http://www.gravatar.com/avatar/' + entry["gravatar"] + '"/>' +
                    '' + entry["content"] + '' +
                    '</a>' +
                    '</li>';
                $("#favoritesTweet").append(line);

            });
            $("#favoritesTweet").listview("refresh")
        },
        error:function (jqXHR, textStatus, errorThrown) {
            alert("error");
        }

    });
}

function postTheTweet(tweet) {
    $.ajax({
        type: 'POST',
        url: "rest/tweets",
        contentType: 'application/json; charset=UTF-8',
        data: tweet,
        dataType: 'json',
        success: function(data) {
            $('#tweetText').val("");
            setTimeout(function() {
                refreshTweet();
            }, 1000);
        }
    });
}