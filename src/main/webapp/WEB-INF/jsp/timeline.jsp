<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<html>
<head>

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
</head>
<body>
<h1>You are logged as <sec:authentication property="principal.username"/></h1>

<div>
    <h1>REST API for User</h1>
    First name : <div id="firstName"></div>
    Last Name : <div id="lastName"></div>
    Friends : <div id="friends"></div>
    Followers : <div id="followers"></div>
    Tweets : <div id="tweetCount"></div>
    <input id="friend" name="friend" type="text" size="20" maxlength="50"/>
    <input type="submit" onclick="addFriend()"/>
    <hr/>
    <h1>REST API for tweet</h1>
    <input id="content" name="content" type="text" size="20"/>
    <input type="submit" onclick="tweet()"/>
</div>

<script type="text/javascript">
    function tweet() {
        $.ajax({
            type: 'POST',
            url: "rest/tweets",
            contentType: "application/json",
            data: $("#content").val(),
            dataType: "json"
        });
    }

    function addFriend() {
        var url = encodeURI("rest/users/<sec:authentication property="principal.username" htmlEscape="false"/>/addFriend");
        $.ajax({
            type: 'POST',
            url: url,
            contentType: "application/json",
            data: $("#friend").val(),
            dataType: "json"
        });
    }

    $(document).ready(function() {
        var url = encodeURI("rest/users/<sec:authentication property="principal.username" htmlEscape="false"/>/");
        $.ajax({
            type: 'GET',
            url: url,
            dataType: "json",
            success: function(data) {
                $("#firstName").text(data.firstName);
                $("#lastName").text(data.lastName);
                $("#tweetCount").text(data.tweetCount);
                $("#friendsCount").text(data.friendsCount);
                $("#followersCount").text(data.followersCount);
            }
        });
    });
</script>
</body>
</html>