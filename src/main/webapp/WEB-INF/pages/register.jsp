<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div id="mainPanel" class="container">
    <div class="row">
        <div class="offset2 span8">
            <h1><fmt:message key="tatami.register.validation.title"/></h1>

            <c:if test="${login eq null}">
                <p><fmt:message key="tatami.register.validation.error"/></p>
            </c:if>
            <c:if test="${login ne null}">
                <p><fmt:message key="tatami.register.validation.ok"/></p>
            </c:if>
        </div>
    </div>
    <div class="row">
        <div class="offset4 span2">
            <br>
            <br>
            <a href="/tatami/"><fmt:message key="tatami.register.home"/></a>
        </div>
    </div>
</div>

<jsp:include page="includes/footer.jsp"/>

</body>
</html>
