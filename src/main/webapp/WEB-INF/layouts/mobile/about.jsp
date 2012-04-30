<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html lang="en"
	xmlns="http://www.w3.org/1999/xhtml">
	
<jsp:include page="includes/header.jsp"/>
  <body>

		<div id="topbar-about" class="navbar navbar-fixed-top topbar" >
			<div class="navbar-inner">	
				<div class="container">
					<a class="brand" href="/tatami/"><img src="/assets/img/ippon-logo.png"></img><spring:message
                    code="tatami.title"/></a>
					<div class="nav-collapse noMargin noPadding">
						<ul class="nav">
							<li><a href="/tatami/"><i class="icon-home icon-white"></i><spring:message
                    code="tatami.home"/></a></li>
							<li class="active"><a href="#"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message
                    code="tatami.about"/></a></li>
						</ul>
						<ul class="nav pull-right">
							<li><a href="/tatami/logout"><i class="icon-user icon-white"></i>&nbsp;<spring:message
                    code="tatami.logout"/></a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>

    <div id="aboutPage" class="container row-fluid">
	    <div class="span12 noMargin">
	        <h1><spring:message code="tatami.presentation"/></h1>
	
	        <p><spring:message code="tatami.presentation.text"/></p>
	
	        <p>
	            <spring:message code="tatami.presentation.moreinfo"/><a href="https://github.com/ippontech/tatami">https://github.com/ippontech/tatami</a>
	        </p>
	    </div>
	    <div class="span12 noMargin">
	        <h1><spring:message code="tatami.license"/></h1>
	
	        <p><spring:message code="tatami.copyright"/> <a href="http://www.ippon.fr"><spring:message
	                code="tatami.ippon.technologies"/></a></p>
	
	        <p><spring:message code="tatami.license.text"/></p>
	
	        <p><a href="http://www.apache.org/licenses/LICENSE-2.0"></a><a
	                href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a></p>
	
	        <p><spring:message code="tatami.cg"/></p>
	    </div>
    </div>

	<jsp:include page="includes/footer.jsp"/>
  </body>
</html>
