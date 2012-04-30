<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
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
                    src="/assets/img/ippon-logo.png">&nbsp;<spring:message
                    code="tatami.title"/></a>

            <div class="nav-collapse">
                <ul class="nav">
                    <li class="active"><a href="#"><i class="icon-lock icon-white"></i>&nbsp;<spring:message
                            code="tatami.authentification"/></a></li>
                    <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message
                            code="tatami.about"/></a></li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
</div>

<div class="row">
    <div class="span2">&nbsp;</div>
    <div class="span8">
        <table>
            <tr>
                <td><h1><spring:message code="tatami.404"/></h1></td>
                <td><img src="/assets/img/404-error.jpg" width="500" height="570"/></td>
            </tr>
        </table>
    </div>
    <div class="span2">&nbsp;</div>
</div>

<jsp:include page="includes/footer.jsp"/>

</body>
</html>