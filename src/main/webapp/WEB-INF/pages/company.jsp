<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

    <jsp:include page="includes/topmenu.jsp"/>

    <div id="mainPanel" class="container">
    </div>

    <jsp:include page="includes/footer.jsp"/>

    <script type="text/javascript">
        var page = "company";
        var login = "<sec:authentication property="principal.username"/>";
        var username = "${user.username}";
        var authenticatedUsername = "${authenticatedUsername}";
    </script>

    <c:if test="${wro4jEnabled eq false}">
        <script src="/js/tatami-company.js"></script>
    </c:if>
    <c:if test="${wro4jEnabled eq true}">
        <script src="/tatami/static/${version}/tatami-company.js"></script>
    </c:if>
</body>
</html>