<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div class="container mainPanel">
    <c:if test="${action eq 'register'}">
        <div class="alert alert-info">
            <fmt:message key="tatami.register.msg"/>
        </div>
    </c:if>
    <c:if test="${action eq 'registerFailure'}">
        <div class="alert alert-error">
            <fmt:message key="tatami.register.msg.error"/>
        </div>
    </c:if>
    <c:if test="${action eq 'loginFailure'}">
        <div class="alert alert-error">
            <fmt:message key="tatami.authentification.error"/>
        </div>
    </c:if>
    <c:if test="${action eq 'lostPassword'}">
        <div class="alert alert-info">
            <fmt:message key="tatami.lost.password.msg"/>
        </div>
    </c:if>
    <c:if test="${action eq 'lostPasswordFailure'}">
        <div class="alert alert-error">
            <fmt:message key="tatami.lost.password.msg.error"/>
        </div>
    </c:if>
    <div class="row">
        <div class="offset3 span6">
            <h1><fmt:message key="tatami.presentation"/></h1>

            <p><fmt:message key="tatami.presentation.text"/></p>

            <p>
                <fmt:message key="tatami.presentation.moreinfo"/><a href="https://github.com/ippontech/tatami">https://github.com/ippontech/tatami</a>
            </p>
        </div>
        <div class="offset1 span4">
            <div class="row-fluid">
                <h1><fmt:message key="tatami.register.title"/></h1>

                <p>
                    <fmt:message key="tatami.register.text.1"/>
                <ul>
                    <li><fmt:message key="tatami.register.text.2"/></li>
                    <li><fmt:message key="tatami.register.text.3"/></li>
                    <li><fmt:message key="tatami.register.text.4"/></li>
                </ul>
                </p>
                <form action="/tatami/register" method="post" class="span12 well row-fluid" accept-charset="utf-8">
                    <fieldset class="span12">
                        <div class="controle-group">
                            <label>
                                <fmt:message key="tatami.login"/> :
                            </label>
                            <input name="email" type="email" required="required" autofocus class="span12" placeholder="Your e-mail..."/>
                        </div>
                        <div class="controle-group">
                            <button type="submit" class="span12 btn btn-success">
                                <fmt:message key="tatami.register"/>
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
        <div class="offset2 span4">
            <div class="row-fluid">
            <h1><fmt:message key="tatami.authentification"/></h1>
            <div class="span12 well row-fluid">
                <form action="/tatami/authentication" method="post" accept-charset="utf-8">
                    <fieldset class="span12">
                        <div class="controle-group">
                            <label>
                                <fmt:message key="tatami.login"/> :
                            </label>
                            <input id="j_username" name="j_username" type="email" required="required" autofocus class="span12" placeholder="Your e-mail..."/>
                        </div>
                        <div class="controle-group">
                            <label>
                                <fmt:message key="tatami.password"/> :
                            </label>
                            <input id="j_password" name="j_password" type="password" required="required" class="span12" placeholder="Your password..."/>
                        </div>
                        <div class="controle-group">
                            <button type="submit" class="span12 btn btn-success">
                                <fmt:message key="tatami.authentificate"/>
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>

            <div class="span12 well row-fluid">
                <div class="row-fluid" data-toggle="collapse" data-target="#lostPasswordDiv">
                    <button class="span12 btn btn-info">
                        <fmt:message key="tatami.lost.password.title"/>
                    </button>
                </div>
                <br/>
                <div id="lostPasswordDiv" class="collapse">
                <form action="/tatami/lostpassword" method="post" accept-charset="utf-8">
                    <fieldset>
                        <div class="controle-group">
                            <label>
                                <fmt:message key="tatami.login"/> :
                            </label>
                            <input name="email" type="email" required="required" class="span12" placeholder="Your e-mail..."/>
                        </div>
                        <div class="controle-group">
                            <button type="submit" class="span12 btn btn-success">
                                <fmt:message key="tatami.lost.password.button"/>
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
            </div>


            
        </div>
    </div>
</div>

<jsp:include page="includes/footer.jsp"/>

</body>
</html>
