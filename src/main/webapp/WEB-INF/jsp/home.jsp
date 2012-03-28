<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
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
						<li><a href="#profileTabContent" data-toggle="pill"><i class="icon-edit"></i> Update Profile</a></li>
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
						<li class="active"><a id="mainTab" href="#timeLinePanel" data-toggle="tab"><strong>Tweets</strong></a></li>
						<li><a id="favTab" href="#favLinePanel" data-toggle="tab"><i class="icon-heart"></i> Favorite Tweets</a></li>
						<li><a id="userTab" href="#userLinePanel" data-toggle="tab"><i class="icon-user"></i> Other User Tweets</a></li>
						<li><a id="tagTab" href="#tagLinePanel" data-toggle="tab"><i class="icon-tag"></i> Tag Tweets</a></li>
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Statistics <b class="caret"></b></a>
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
        <div style="text-align: center;">Copyright 2012 <a href="http://www.ippon.fr">Ippon Technologies</a> |
            <a href="https://github.com/ippontech/tatami">Fork Tatami on Github</a> |
            <a href="http://blog.ippon.fr">Blog Ippon</a> |
            <a href="https://twitter.com/#!/ippontech">Follow @ippontech on Twitter</a>
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
	<script src="/assets/js/tatami.constants.js"></script>
	<script src="/assets/js/tatami.utils.js"></script>
	<script src="/assets/js/tatami.tweets.js"></script>
	<script src="/assets/js/tatami.ajax.js"></script>
	<script src="/assets/js/tatami.js"></script>

	<script src="https://www.google.com/jsapi"></script>
	<script type="text/javascript">
	    google.load("visualization", "1", {packages:["corechart"]});

        var login = "<sec:authentication property="principal.username"/>";
        resetNbTweetsToDefaultNumber();

		$(document).ready(function() {
			// left panel
			$('#homeTabContent').load('/assets/fragments/home.html', function () {
				refreshProfile();
				$('#tweetContent').popover({
					trigger: 'manual',
					placement: 'bottom',
					title: 'Error',
					content: '<i class="icon-exclamation-sign"></i>&nbsp;Please type a message to tweet.'
				});
			});
			$('#profileTabContent').load('/assets/fragments/profile.html');
            $('#followUserContent').load('/assets/fragments/followUser.html', whoToFollow());
        	// auto-refresh
		    $('a[data-toggle="pill"]').on('show', function(e) {
		    	if (e.target.hash == '#homeTabContent') {
					refreshProfile();
		    	} else if (e.target.hash == '#profileTabContent') {
		        	displayProfile();
		        }
		    });

		    // right panel
			$('#timeLinePanel').load('/assets/fragments/timeline.html', listTweets(true));
		    // browser's refresh shortcut override
			shortcut.add("Ctrl+R", function() {
				listTweets(true);
			});
		    // infinite scroll
			$(window).scroll(function() { 
				if ($('#timeline').is(':visible') && $(window).scrollTop() >= $(document).height() - $(window).height()) {
					listTweets(false);
				}
			});

			$('#favLinePanel').load('/assets/fragments/favline.html');
			$('#userLinePanel').load('/assets/fragments/userline.html');
			$('#tagLinePanel').load('/assets/fragments/tagline.html');

			$('#piechartPanel').load('/assets/fragments/piechart.html');
			$('#punchchartPanel').load('/assets/fragments/punchchart.html');
        	// auto-refresh
		    $('a[data-toggle="tab"]').on('show', function(e) {
		    	if (e.target.hash == '#favLinePanel') {
		        	listFavoriteTweets();
		    	} else if (e.target.hash == '#piechartPanel') {
					refreshPieChart();
		    	} else if (e.target.hash == '#punchchartPanel') {
					refreshPunchChart();
		        }
		    });
		});
	</script>
  </body>
</html>
