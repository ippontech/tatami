<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div id="mainPanel" class="container">
    <div class="offset2 span8 ">

        <h1><fmt:message key="tatami.license"/></h1>

        <p><fmt:message key="tatami.copyright"/> <a href="http://www.ippon.fr"><fmt:message
                key="tatami.ippon.technologies"/></a></p>

        <p><fmt:message key="tatami.license.text"/></p>

        <p><a href="http://www.apache.org/licenses/LICENSE-2.0"></a><a
                href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a></p>

        <p><fmt:message key="tatami.cg"/></p>
    </div>
</div>

<jsp:include page="includes/footer.jsp"/>

</body>
</html>
