<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<html lang="en">
  <head>
	<meta charset="utf-8">
	<title>TaTaMi</title>
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
	<link rel="shortcut icon" href="../images/ippon.ico">
  </head>

  <body>

	<div class="navbar navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container">
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</a>
				<a class="brand" href="#">TaTaMi</a>
				<div class="nav-collapse">
					<ul class="nav">
						<li class="active"><a href="#"><i class="icon-home icon-white"></i> Home</a></li>
                        <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i> About</a></li>
					</ul>
					<ul class="nav pull-right">
						<li class="divider-vertical"></li>
						<li class="close"><a href="/tatami/logout"><i class="icon-user icon-white"></i> logout &times;</a></li>
					</ul>
				</div><!--/.nav-collapse -->
			</div>
		</div>
	</div>

	<div class="alert alert-success">
		<h1>Tweets view</h1>
		<p>View your <a href="http://www.ippon.fr/" target="_blank">Ippon Technologies</a> tweets at a glance.</p>
	</div>

	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span4">
				<div class="tabbable">
					<div class="tab-content alert alert-info">
						<div class="tab-pane active" id="homeTabContent"></div>
						<div class="tab-pane" id="profileTabContent"></div>
					</div>
					<ul class="nav nav-pills">
						<li class="active"><a id="defaultTab" href="#homeTabContent" data-toggle="pill">Home</a></li>
						<li><a href="#profileTabContent" data-toggle="pill">Profile</a></li>
					</ul>
				</div>
			</div>

			<div class="span8">
				<div class="tabbable">
					<ul class="nav nav-tabs">
						<li class="active"><a id="mainTab" href="#view1Content" data-toggle="tab">Tweets</a></li>
						<li><a id="friendTab" href="#view2Content" data-toggle="tab">Friend Tweets</a></li>
						<li><a id="chartTab" href="#view3Content" data-toggle="tab">Time chart</a></li>
					</ul>
					<div class="tab-content alert alert-success">
						<div class="tab-pane active" id="view1Content"></div>
						<div class="tab-pane" id="view2Content"></div>
						<div class="tab-pane" id="view3Content"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Le javascript
	================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="/assets/js/jquery.js"></script>
	<script src="/assets/js/bootstrap-tab.js"></script>

	<script src="/assets/js/tatami.js"></script>
	<script src="/assets/js/profile.js"></script>

	<script type="text/javascript">
        var login = "<sec:authentication property="principal.username"/>";
        resetNbTweets();

		$(document).ready(function() {
			// left panel
			$('#homeTabContent').load('/assets/fragments/home.html', refreshHome);
			$('#profileTabContent').load('/assets/fragments/profile.html');
        	// auto-refresh
		    $('a[data-toggle="pill"]').on('show', function(e) {
		    	if (e.target.hash == '#homeTabContent') {
					refreshHome();
		    	} else if (e.target.hash == '#profileTabContent') {
		        	displayProfile();
		        }
		    });

		    // right panel
			$('#view1Content').load('/assets/fragments/timeline.html', listTweets(true));
//			statusTweets();
		    // infinite scroll
			$(window).scroll(function () { 
				if ($('#timeline').is(':visible') && $(window).scrollTop() >= $(document).height() - $(window).height()) {
					incrementNbTweets();
					listTweets(false);
				}
			});

			$('#view2Content').load('/assets/fragments/friendTimeline.html');

			//TODO #view3Content : graphique interactif
		});
	</script>
  </body>
</html>
