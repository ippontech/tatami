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
            <a class="brand" href="#"><img src="../assets/img/ippon-logo.png">&nbsp;<spring:message
                    code="tatami.title"/></a>

            <div class="nav-collapse">
                <ul class="nav">
                    <li class="active"><a href="#"><i class="icon-lock icon-white"></i>&nbsp;<spring:message
                            code="tatami.login"/></a></li>
                    <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message
                            code="tatami.about"/></a></li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
</div>

<div class="container">
    <div class="span4 offset4">
        <h1><spring:message code="tatami.authentification"/></h1>

        <form action="/tatami/authentication" method="post" class="well">
            <fieldset>
                <label><spring:message code="tatami.login"/>&nbsp;:</label> <input id="j_username" name="j_username"
                                                                                   type="text" required="required"
                                                                                   autofocus class="input-xlarge"
                                                                                   placeholder="Your login..."/>
                <label><spring:message code="tatami.password"/>&nbsp;:</label> <input id="j_password" name="j_password"
                                                                                      type="password"
                                                                                      required="required"
                                                                                      class="input-xlarge"
                                                                                      placeholder="Your password..."/>
            </fieldset>
            <label class="checkbox">
                <input type='checkbox'
                       name='_spring_security_remember_me' id="_spring_security_remember_me"
                       value="true" checked="true"/>&nbsp;<spring:message code="tatami.remember.password.time"/>
            </label>

            <button type="submit" class="btn btn-success"><spring:message code="tatami.authentificate"/></button>
        </form>
    </div>
</div>
<br/><br/><br/>

<jsp:include page="includes/footer.jsp"/>

</body>
</html>
