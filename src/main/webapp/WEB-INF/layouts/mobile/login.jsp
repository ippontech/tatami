<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
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
					<a class="brand" href="#"><img src="/assets/img/ippon-logo.png"></img><spring:message
                    code="tatami.title"/></a>
					<div class="nav-collapse">
						<ul class="nav">
							<li class="active"><a href="/tatami/login"><i class="icon-lock icon-white"></i>&nbsp;<spring:message
                            code="tatami.login"/></a></li>
							<li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message
                            code="tatami.about"/></a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	<br/>
    <div id="mobileLoginContainer">
        <h1><spring:message code="tatami.authentification"/></h1>
		<br/>
        <form id="loginForm" action="/tatami/authentication" method="post" class="well" >
        	<br/>
            <fieldset>
                <label><spring:message code="tatami.login"/> :</label> <input id="j_username" name="j_username"
                       type="text" required="required" autofocus="autofocus" class="input-large"
                       placeholder="<spring:message code="tatami.login"/>..."/>
                <label><spring:message code="tatami.password"/> :</label> <input id="j_password" name="j_password"
                       type="password" required="required" class="input-large"
                       placeholder="<spring:message code="tatami.password"/>..."/>
	            <label class="checkbox"><spring:message code="tatami.remember.password.time"/> :</label> <input type="checkbox"
	                       name="_spring_security_remember_me" id="_spring_security_remember_me"
	                       value="true" checked="true"/>
            </fieldset>

            <button type="submit" class="btn btn-success btn-large"><spring:message code="tatami.authentificate"/></button>
            <br/>&nbsp;
        </form>
    </div>
   
	<jsp:include page="includes/footer.jsp"/>
  </body>
</html>
