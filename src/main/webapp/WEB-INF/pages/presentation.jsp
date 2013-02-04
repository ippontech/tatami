<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div id="mainPanel" class="container">
    <div class="row">

        <div class="offset2 span8 ">
            <h1><fmt:message key="tatami.presentation.title"/></h1>
            <br><br>
        </div>

    </div>
    <div class="row">

        <div class="span4"><img src="/img/presentation_tatami.jpg" height="267" width="400" alt="Tatami"></div>
        <div class="span8">
            <br>
            <p><h2><fmt:message key="tatami.presentation.row1.title"/></h2></p>
            <ul>
                <li><fmt:message key="tatami.presentation.row1.1"/></li>
                <li><fmt:message key="tatami.presentation.row1.2"/></li>
                <li><fmt:message key="tatami.presentation.row1.3"/></li>
                <li><fmt:message key="tatami.presentation.row1.4"/></li>
                <li><fmt:message key="tatami.presentation.row1.5"/></li>
                <li><fmt:message key="tatami.presentation.row1.6"/></li>
                <li><fmt:message key="tatami.presentation.row1.7"/></li>
                <li><fmt:message key="tatami.presentation.row1.8"/></li>
                <li><fmt:message key="tatami.presentation.row1.9"/></li>
            </ul>
        </div>

    </div>
    <div class="row">

        <div class="span8">
            <br>
            <br>
            <br>
            <p><h2><fmt:message key="tatami.presentation.row2.title"/></h2></p>
            <ul>
                <li><fmt:message key="tatami.presentation.row2.1"/></li>
                <li><fmt:message key="tatami.presentation.row2.2"/></li>
                <li><fmt:message key="tatami.presentation.row2.3"/></li>
            </ul>
        </div>
        <div class="span4"><img src="/img/presentation_devices.jpg" height="267" width="200" alt="Devices"></div>

    </div>
    <div class="row">
        <br>
        <br>
        <br>
        <div class="span4"><img src="/img/presentation_opensource.jpg" height="216" width="250Logo-ippon-MarquePage.png" alt="Open Source"></div>
        <div class="span8">
            <p><h2><fmt:message key="tatami.presentation.row3.title"/></h2></p>
            <ul>
                <li><fmt:message key="tatami.presentation.row3.1"/></li>
                <li><fmt:message key="tatami.presentation.row3.2"/></li>
                <li><fmt:message key="tatami.presentation.row3.3"/></li>
                <li><fmt:message key="tatami.presentation.row3.4"/></li>
                <li><fmt:message key="tatami.presentation.row3.5"/></li>
                <li><fmt:message key="tatami.presentation.row3.6"/></li>
                <li><fmt:message key="tatami.presentation.row3.7"/></li>
                <li><fmt:message key="tatami.presentation.row3.8"/> <a href="https://github.com/ippontech/tatami">https://github.com/ippontech/tatami</a></li>
            </ul>
        </div>

    </div>
    <br>
    <br>
    <div class="row">

        <div class="span8">
            <p><h2><fmt:message key="tatami.presentation.row4.title"/></h2></p>
            <ul>
                <li><fmt:message key="tatami.presentation.row4.1"/> <a href="https://tatami.ippon.fr">https://tatami.ippon.fr</a></li>
                <li><fmt:message key="tatami.presentation.row4.2"/></li>
                <li><fmt:message key="tatami.presentation.row4.3"/></li>
            </ul>
        </div>
        <div class="span4"><img src="/img/company-logo-bookmark.png" height="148" width="150" alt="<fmt:message key="tatami.logo"/>"></div>

    </div>
    <div class="row">
        <div class="span12">
            <p><h2><fmt:message key="tatami.presentation.row5.title"/></h2></p>
            <ul>
                <li><fmt:message key="tatami.presentation.row5.1"/> <a href="mailto:commercial@ippon.fr">commercial@ippon.fr</a></li>
            </ul>
        </div>

    </div>
</div>
<br>
<br>
<br>
<br>
<jsp:include page="includes/footer.jsp"/>

</body>
</html>
