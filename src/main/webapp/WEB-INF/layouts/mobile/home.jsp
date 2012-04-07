<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>
    </title>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.css"/>
    <style>
            /* App custom styles */
    </style>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js">
    </script>
    <script src="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.js">
    </script>
    <script src="/assets/js/tatami/tatami.constants.js"></script>

    <style>
        .ui-li-desc {
            overflow: visible;
            white-space: pre-line;
        }
    </style>
</head>
<body>
<div data-role="page" id="timeline">
    <div data-theme="a" data-role="header">
        <a href="javascript:refreshTweet();" data-theme="a" data-iconshadow="false">Refresh</a>

        <h3>
            Timeline
        </h3>
    </div>
    <div data-role="content">
        <ul id="tweetList" data-role="listview">
        </ul>
    </div>
    <div data-theme="a" data-role="footer" data-position="fixed">
        <div data-role="navbar" data-iconpos="top">
            <ul>
                <li>
                    <a href="#timeline" data-transition="none" data-theme="" data-icon="" class="ui-btn-active">
                        Timeline
                    </a>
                </li>
                <li>
                    <a href="#favoriteTweets" data-transition="none" data-theme="" data-icon="">
                        Favorites
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
<div data-role="page" id="favoriteTweets">
    <div data-theme="a" data-role="header">
        <a href="javascript:listFavorite();" data-theme="a" data-iconshadow="false">Refresh</a>

        <h3>
            Favorites
        </h3>
    </div>
    <div data-role="content">

        <ul id="favoritesTweet" data-role="listview">
        </ul>
    </div>
    <div data-theme="a" data-role="footer" data-position="fixed">
        <div data-role="navbar" data-iconpos="top">
            <ul>
                <li>
                    <a href="#timeline" data-transition="none" data-theme="" data-icon="">
                        Timeline
                    </a>
                </li>
                <li>
                    <a href="#favoriteTweets" data-transition="none" data-theme="" data-icon="" class="ui-btn-active">
                        Favorites
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>


<script>

    var login = "<sec:authentication property="principal.username"/>";

    $(document).bind("mobileinit", function () {
        $.mobile.defaultPageTransition = 'none';
        $.mobile.defaultDialogTransition = 'none';
        $.mobile.useFastClick = true;
    });


    $(function () {

        refreshTweet();
        listFavorite();

    });

    function refreshTweet() {
        jQuery.ajax({
            type:GET_TYPE_REQUEST,
            url:"rest/tweets/" + login + "/" + DEFAULT_NUMBER_OF_TWEETS_TO_DISPLAY,
            dataType:JSON_DATA_TYPE,
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
            type:GET_TYPE_REQUEST,
            url:"rest/favTweets/" + login,
            dataType:JSON_DATA_TYPE,
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


</script>
</body>
</html>