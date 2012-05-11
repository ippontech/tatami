<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en"
	xmlns="http://www.w3.org/1999/xhtml">
	
<jsp:include page="includes/header.jsp"/>
  <body>

		<div id="topbar-about" class="navbar navbar-fixed-top topbar" >
			<div class="navbar-inner">	
				<div class="container">
					<a class="brand" href="/tatami/"><img src="/assets/img/ippon-logo.png"></img><fmt:message
                    key="tatami.title"/></a>
					<div class="nav-collapse noMargin noPadding">
						<ul class="nav">
							<li><a href="/tatami/"><i class="icon-home icon-white"></i><fmt:message
                    key="tatami.home"/></a></li>
							<li class="active"><a href="#"><i class="icon-info-sign icon-white"></i>&nbsp;<fmt:message
                    key="tatami.about"/></a></li>
						</ul>
						<ul class="nav pull-right">
							<li><a href="/tatami/logout"><i class="icon-user icon-white"></i>&nbsp;<fmt:message
                    key="tatami.logout"/></a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>

    <div id="aboutPage" class="container row-fluid">
	    <div class="span12 noMargin">
	        <h1><fmt:message key="tatami.presentation"/></h1>
	
	        <p><fmt:message key="tatami.presentation.text"/></p>
	
	        <p>
	            <fmt:message key="tatami.presentation.moreinfo"/><a href="https://github.com/ippontech/tatami">https://github.com/ippontech/tatami</a>
	        </p>
	    </div>
	    <div class="span12 noMargin">
	        <h1><fmt:message key="tatami.license"/></h1>
	
	        <p><fmt:message key="tatami.copyright"/> <a href="http://www.ippon.fr"><fmt:message
	                key="tatami.ippon.technologies"/></a></p>
	
	        <p><fmt:message key="tatami.license.text"/></p>
	
	        <p><a href="http://www.apache.org/licenses/LICENSE-2.0"></a><a
	                href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a></p>
	
	        <p><fmt:message key="tatami.cg"/></p>
	    </div>
    </div>

	<jsp:include page="includes/footer.jsp"/>
  </body>
</html>
