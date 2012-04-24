<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand" href="#"><img
                    src="${request.getContextPath}/assets/img/ippon-logo.png">&nbsp;<spring:message
                    code="tatami.title"/></a>

            <div class="nav-collapse">
                <ul class="nav">
                    <li class="active"><a href="/tatami/"><i class="icon-home icon-white"></i>&nbsp;<spring:message
                            code="tatami.home"/></a></li>
                    <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message
                            code="tatami.about"/></a></li>
                    <!-- <li><a href="?language=en"> English</a>|<a href="?language=fr"> Francais</a></li> -->
                </ul>
                <ul class="nav pull-right">
                    <li class="divider-vertical"></li>
                    <li><a href="/tatami/logout"><i class="icon-user icon-white"></i>&nbsp;<spring:message
                            code="tatami.logout"/></a></li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
</div>

<div class="container">
    <div class="span12">
        <h1><spring:message code="tatami.presentation"/></h1>

        <p><spring:message code="tatami.presentation.text"/></p>

        <p>
            <spring:message code="tatami.presentation.moreinfo"/><a href="https://github.com/ippontech/tatami">https://github.com/ippontech/tatami</a>
        </p>
    </div>
    <div class="span12">
        <h1><spring:message code="tatami.license"/></h1>

        <p><spring:message code="tatami.copyright"/> |<a href="http://www.ippon.fr"><spring:message
                code="tatami.ippon.technologies"/></a></p>

        <p><spring:message code="tatami.licence"/></p>

        <p><a href="http://www.apache.org/licenses/LICENSE-2.0"></a><a
                href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a></p>

        <p><spring:message code="tatami.cg"/></p>
    </div>
</div>
<br/><br/><br/><br/><br/><br/>

<jsp:include page="includes/footer.jsp"/>

</body>
</html>
