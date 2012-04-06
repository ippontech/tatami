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
<div data-role="page" id="page1">
    <div data-theme="a" data-role="header">
        <h3>
            Tatami
        </h3>
    </div>
    <div data-role="content">

        <ul id="tweetList" data-role="listview">
        </ul>
    </div>
    <div data-theme="a" data-role="footer" data-position="fixed">
        <h1>
            Copyright 2012 Ippon Technologies
        </h1>
    </div>
</div>


<script>

    $(function () {

        jQuery.ajax({
            type:GET_TYPE_REQUEST,
            url:"rest/tweets/" + "jdubois" + "/" + 5,
            dataType:JSON_DATA_TYPE,
            success:function (data) {


                $.each(data, function (entryIndex, entry) {
                    line = '<li class="ui-li-desc">' +
                            '<a href="#">' +
                            '<img src="http://www.gravatar.com/avatar/' + entry[fieldGravatarInSession] + '"/>' +
                            '<p>' + entry[fieldContentInSession] + '</p>' +
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

    });


</script>
</body>
</html>