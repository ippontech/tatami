<%@ taglib prefix="sec"		uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" 	uri="http://www.springframework.org/tags" %>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title><spring:message code="tatami.title" /></title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="Ippon Technologies">
	
		<!-- Le styles -->
		<link href="/assets/css/bootstrap.css" rel="stylesheet">
		<style>
			body {
				padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
			}
		</style>
		<link href="/assets/css/bootstrap-responsive.css" rel="stylesheet">
		<link href="/assets/css/tatami-custom.css" rel="stylesheet">
		<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
		<!--[if lt IE 9]>
				<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
			<![endif]-->
		
		<!-- Le fav and touch icons -->
		<link rel="shortcut icon" href="../assets/img/ippon.ico">
	</head>
	<body>
		
		<div class="navbar navbar-fixed-top">
			<div class="navbar-inner">
				<div class="container">
					<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</a>
					<a class="brand" href="#"><img src="${request.getContextPath}/assets/img/ippon-logo.png">&nbsp;<spring:message code="tatami.title" /></a>
					<div class="nav-collapse">
						<ul class="nav">
							<li class="active"><a href="#"><i class="icon-lock icon-white"></i>&nbsp;<spring:message code="tatami.login" /></a></li>
							<li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message code="tatami.about" /></a></li>
						</ul>
					</div><!--/.nav-collapse -->
				</div>
			</div>
		</div>
	
		<div class="container-fluid" id="userProfile">
			<div class="row-fluid">
				<a href="#" title="404">
					<img src="${request.getContextPath}/assets/img/judoka_prise_404.jpg"/>
				</a>
				<spring:message code="tatami.404" />
			</div>
		</div>
		
		<footer>
	        <div style="text-align: center;"> |<spring:message code="tatami.copyright" /><a href="http://www.ippon.fr"><spring:message code="tatami.ippon.technologies" /></a> |
	            <a href="https://github.com/ippontech/tatami"><spring:message code="tatami.github.fork" /></a> |
	            <a href="http://blog.ippon.fr"><spring:message code="tatami.ippon.blog" /></a> |
	            <a href="https://twitter.com/#!/ippontech"><spring:message code="tatami.ippon.twitter.follow" /></a>
	        </div>
	    </footer>

		<!-- Le javascript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
        <script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
        <script>!window.jQuery && document.write(unescape('%3Cscript src="/assets/js/CDN/jquery-1.7.2.min.js"%3E%3C/script%3E'))</script>
		<script src="/assets/js/bootstrap-dropdown.js"></script>
		<script src="/assets/js/bootstrap-tab.js"></script>
		<script src="/assets/js/bootstrap-tooltip.js"></script>
		<script src="/assets/js/bootstrap-popover.js"></script>
		<script src="/assets/js/shortcut.js"></script>
		<script src="/assets/js/raphael-min.js"></script>
	
		<script src="/assets/js/profile.js"></script>
		<script src="/assets/js/chart.js"></script>
		<script src="/assets/js/tatami/tatami.constants.js"></script>
		<script src="/assets/js/tatami/tatami.utils.js"></script>
		<script src="/assets/js/tatami/tatami.tweets.js"></script>
		<script src="/assets/js/tatami/tatami.users.js"></script>
		<script src="/assets/js/tatami/tatami.ajax.js"></script>
		<script src="/assets/js/tatami.js"></script>

		<script src="https://www.google.com/jsapi"></script>
		<script type="text/javascript">
	    	google.load("visualization", "1", {packages:["corechart"]});
	        resetNbTweetsToDefaultNumber();
			$(document).ready(function() {
				var login = '<c:out value="${user.login}"/>';
				initTatamiProfile(login);
			});
		</script>
		
	</body>
</html>