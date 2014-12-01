<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="../includes/header.jsp"/>

<body>

<jsp:include page="../includes/topmenu.jsp"/>

<div id="mainPanel" class="container">
    <div class="row">
        <div class="offset2 span8 text-center">
            <h1><fmt:message key="tatami.500"/></h1>
           <img src="/img/500-error.jpg">
       </div>
    </div>
</div>

<jsp:include page="../includes/footer.jsp"/>

</body>
</html>