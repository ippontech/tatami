<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<html>
<head></head>
<body>
<h1>Welcome</h1>

<form action="j_spring_openid_security_check" method="post">
    <input name="openid_identifier" type="hidden" value="https://www.google.com/accounts/o8/id"/>
    <input type="submit" value="Sign with Google"/>
</form>
</body>
</html>