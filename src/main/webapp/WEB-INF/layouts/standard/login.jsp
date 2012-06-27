<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div class="container mainPanel">
    <div class="row">
        <div class="span5 offset2">
            <h1><fmt:message key="tatami.presentation"/></h1>

            <p><fmt:message key="tatami.presentation.text"/></p>

            <p>
                <fmt:message key="tatami.presentation.moreinfo"/><a href="https://github.com/ippontech/tatami">https://github.com/ippontech/tatami</a>
            </p>
            <br/><br/>
        </div>
    </div>
    <div class="row">
        <div class="span4">
            <h1><fmt:message key="tatami.register.title"/></h1>

            <p>
                <fmt:message key="tatami.register.text.1"/>
            <ul>
                <li><fmt:message key="tatami.register.text.2"/></li>
                <li><fmt:message key="tatami.register.text.3"/></li>
                <li><fmt:message key="tatami.register.text.4"/></li>
            </ul>
            </p>
            <form action="/tatami/register" method="post" class="well" acceptCharset="utf-8">
                <fieldset>
                    <label><fmt:message key="tatami.login"/>&nbsp;:</label> <input id="email" name="email"
                                                                                   type="email" required="required"
                                                                                   autofocus class="input-xlarge"
                                                                                   placeholder="Your e-mail..."/>
                </fieldset>
                </label>

                <button type="submit" class="btn btn-success"><fmt:message key="tatami.register"/></button>
            </form>
        </div>
        <div class="span1">&nbsp;</div>
        <div class="span4">
            <h1><fmt:message key="tatami.authentification"/></h1>

            <form action="/tatami/authentication" method="post" class="well" acceptCharset="utf-8">
                <fieldset>
                    <label><fmt:message key="tatami.login"/>&nbsp;:</label> <input id="j_username" name="j_username"
                                                                                   type="email" required="required"
                                                                                   autofocus class="input-xlarge"
                                                                                   placeholder="Your e-mail..."/>
                    <label><fmt:message key="tatami.password"/>&nbsp;:</label> <input id="j_password" name="j_password"
                                                                                      type="password"
                                                                                      required="required"
                                                                                      class="input-xlarge"
                                                                                      placeholder="Your password..."/>
                </fieldset>
                <%--<label class="checkbox">
                    <input type='checkbox'
                           name='_spring_security_remember_me' id="_spring_security_remember_me"
                           value="true" checked="true"/>&nbsp;<fmt:message key="tatami.remember.password.time"/>
                </label>--%>

                <button type="submit" class="btn btn-success"><fmt:message key="tatami.authentificate"/></button>
            </form>
        </div>
    </div>
</div>
<br/><br/><br/>

<jsp:include page="includes/footer.jsp"/>

</body>
</html>
