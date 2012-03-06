<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<html>
<head></head>
<body>
<h1>You are logged as <sec:authentication property="principal.username"/></h1>


</body>
</html>