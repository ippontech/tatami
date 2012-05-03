<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div class="container-fluid mainPanel">
    <div class="span8">
        <h1><spring:message code="tatami.presentation"/></h1>

        <p><spring:message code="tatami.presentation.text"/></p>

        <p>
            <spring:message code="tatami.presentation.moreinfo"/><a href="https://github.com/ippontech/tatami">https://github.com/ippontech/tatami</a>
        </p>

        <h1><spring:message code="tatami.license"/></h1>

        <p><spring:message code="tatami.copyright"/> <a href="http://www.ippon.fr"><spring:message
                code="tatami.ippon.technologies"/></a></p>

        <p><spring:message code="tatami.license.text"/></p>

        <p><a href="http://www.apache.org/licenses/LICENSE-2.0"></a><a
                href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a></p>

        <p><spring:message code="tatami.cg"/></p>
    </div>
</div>
<br/><br/><br/><br/><br/><br/>

<jsp:include page="includes/footer.jsp"/>

</body>
</html>
