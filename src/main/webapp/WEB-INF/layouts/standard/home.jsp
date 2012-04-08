<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" 	uri="http://www.springframework.org/tags" %>

<!DOCTYPE html>
<html lang="en">
  <head>
	<meta charset="utf-8">
	<title>Tatami</title>
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
				<a class="brand" href="#"><img src="../assets/img/ippon-logo.png">&nbsp;Tatami</a>
				<div class="nav-collapse">
					<ul class="nav">
						<li class="active"><a href="#"><i class="icon-home icon-white"></i> Home</a></li>
                        <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i> About</a></li>
					</ul>
					<ul class="nav pull-right">
						<li class="divider-vertical"></li>
						<li><a href="/tatami/logout"><i class="icon-user icon-white"></i> logout</a></li>
					</ul>
				</div><!--/.nav-collapse -->
			</div>
		</div>
	</div>

	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span4">
				<div class="tabbable">
                    <ul class="nav nav-tabs">
						<li class="active"><a id="defaultTab" href="#homeTabContent" data-toggle="pill">Show profile</a></li>
						<li><a id="updateProfilTab" href="#profileTabContent" data-toggle="pill"><i class="icon-edit"></i> Update Profile</a></li>
					</ul>
					<div class="tab-content alert alert-info">
						<div class="tab-pane active" id="homeTabContent"></div>
						<div class="tab-pane" id="profileTabContent"></div>
					</div>
				</div>
                <div>
                    <div class="alert alert-info" id="followUserContent"></div>
                </div>
			</div>

			<div class="span8">
				<div class="tabbable">
					<ul class="nav nav-tabs">
						<li class="active"><a id="mainTab" href="#timeLinePanel" data-toggle="tab"><i class="icon-th-list"></i> Tweets</a></li>
						<li><a id="favTab" href="#favLinePanel" data-toggle="tab"><i class="icon-heart"></i> Favorite Tweets</a></li>
						<li><a id="userTab" href="#userLinePanel" data-toggle="tab"><i class="icon-user"></i> Other User Tweets</a></li>
						<li><a id="tagTab" href="#tagLinePanel" data-toggle="tab"><i class="icon-tag"></i> Tags</a></li>
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-signal"></i> Statistics <b class="caret"></b></a>
				            <ul class="dropdown-menu">
				            	<li><a id="piechartTab" href="#piechartPanel" data-toggle="tab">Tweets of the day (pie chart)</a></li>
				            	<li><a id="punchchartTab" href="#punchchartPanel" data-toggle="tab">Tweets of the week (punch chart)</a></li>
				            </ul>
						</li>
					</ul>
					<div class="tab-content alert alert-success">
						<div class="tab-pane active" id="timeLinePanel"></div>
						<div class="tab-pane" id="favLinePanel"></div>
						<div class="tab-pane" id="userLinePanel"></div>
						<div class="tab-pane" id="tagLinePanel"></div>
						<div class="tab-pane" id="piechartPanel"></div>
						<div class="tab-pane" id="punchchartPanel"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

    <footer>
        <div style="text-align: center;"><spring:message code="tatami.copyright" /><a href="http://www.ippon.fr"><spring:message code="tatami.ippon.technologies" /></a> |
            <a href="https://github.com/ippontech/tatami"><spring:message code="tatami.github.fork" /></a> |
            <a href="http://blog.ippon.fr"><spring:message code="tatami.ippon.blog" /></a> |
            <a href="https://twitter.com/#!/ippontech"><spring:message code="tatami.ippon.twitter.follow" /></a>
        </div>
    </footer>

	<!-- Le javascript
	================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="/assets/js/jquery.js"></script>
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

        var login = "<sec:authentication property="principal.username"/>";
        resetNbTweetsToDefaultNumber();

		$(document).ready(function() {
			initTatami();
		});
	</script>
  </body>
</html>
