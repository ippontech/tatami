<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

<jsp:include page="includes/header.jsp"/>

  <body>
		<div id="topbar-login" class="navbar navbar-fixed-top topbar">
			<div class="navbar-inner">
				<div class="container">
					<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</a>
					<a class="brand" href="#"><img src="/assets/img/ippon-logo.png"></img><fmt:message
                    key="tatami.title"/></a>
					<div class="nav-collapse">
						<ul class="nav">
							<li class="active"><a href="/tatami/login"><i class="icon-lock icon-white"></i>&nbsp;<fmt:message
                            key="tatami.login"/></a></li>
							<li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<fmt:message
                            key="tatami.about"/></a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	<br/>
    <div id="mobileLoginContainer">
        <h1><fmt:message key="tatami.authentification"/></h1>
		<br/>
        <form id="loginForm" action="/tatami/authentication" method="post" class="well" >
        	<br/>
            <fieldset>
                <label><fmt:message key="tatami.login"/> :</label> <input id="j_username" name="j_username"
                       type="text" required="required" autofocus="autofocus" class="input-large"
                       placeholder="<fmt:message key="tatami.login"/>..."/>
                <label><fmt:message key="tatami.password"/> :</label> <input id="j_password" name="j_password"
                       type="password" required="required" class="input-large"
                       placeholder="<fmt:message key="tatami.password"/>..."/>
	            <label class="checkbox"><fmt:message key="tatami.remember.password.time"/> :</label> <input type="checkbox"
	                       name="_spring_security_remember_me" id="_spring_security_remember_me"
	                       value="true" checked="true"/>
            </fieldset>

            <button type="submit" class="btn btn-success btn-large"><fmt:message key="tatami.authentificate"/></button>
            <br/>&nbsp;
        </form>
    </div>
   
	<jsp:include page="includes/footer.jsp"/>
  </body>
</html>
