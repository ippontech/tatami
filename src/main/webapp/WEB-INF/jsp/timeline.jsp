<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<html>
<head>

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
</head>
<body>
<h1>You are logged as <sec:authentication property="principal.username"/></h1>

<div>

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
</script>
</body>
</html>