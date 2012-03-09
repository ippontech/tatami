<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<html lang="en">
  <head>
	<meta charset="utf-8">
	<title>TaTaMi - timeline</title>
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
					<span class="icon-bar"></span>
				</a>
				<a class="brand" href="#">TaTaMi</a>
				<div class="nav-collapse">
					<ul class="nav">
						<li class="active"><a href="#">Home</a></li>
						<li><a href="/tatami/profile">Profile</a></li>
                        <li><a href="/tatami/about">About</a></li>
					</ul>
					<ul class="nav pull-right">
						<li class="divider-vertical"></li>
						<li class="close"><a href="/tatami/logout">logout &times;</a></li>
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
			<div class="span3 alert alert-info">
				<table class="table table-condensed table-striped" width="100%">
					<thead>
						<tr>
							<td align="center"><span id="picture"></span></td>
							<td colspan="2"><h2><span id="firstName"></span> <span id="lastName"></span></h2></td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><span id="tweetCount" class="label"></span><br/>TWEETS</td>
							<td><span id="friendsCount" class="label"></span><br/>FOLLOWING</td>
							<td><span id="followersCount" class="label"></span><br/>FOLLOWERS</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colspan="3">
								<form class="form-inline">
									<textarea id="tweetContent" class="focused" placeholder="Type a new tweet..." maxlength="140"></textarea>
									<button onclick="tweet()" type="button" class="btn btn-primary">Tweet!</button>
								</form>
							</td>
						<tr>
					</tfoot>
				</table>
			</div>

			<div class="span8">
				<div class="tabbable tabs-right">
					<ul class="nav nav-tabs">
						<li class="active"><a href="#1" data-toggle="tab">Tweets</a></li>
						<li><a href="#2" data-toggle="tab">Pie chart</a></li>
						<li><a href="#3" data-toggle="tab">Time chart</a></li>
					</ul>
					<div class="tab-content alert alert-success">
						<div class="tab-pane active" id="1">
							<section>
								<table class="table table-striped" width="100%">
									<thead>
										<tr>
											<th colspan="2"><h2>Tweets list</h2></th>
											<th colspan="2" align="right"><a href="javascript:listTweets()" title="Refresh"><i class="icon-repeat icon-white"></i></a></th>
										</tr>
									</thead>
									<tbody id="tweetsList" style="color:black"></tbody>
								</table>
								<footer>
									<div class="pagination">
										<ul>
											<li class="disabled"><a href="#">Prev.</a></li>
											<li class="active"><a href="#">1</a></li>
											<li><a href="#">2</a></li>
											<li><a href="#">3</a></li>
											<li><a href="#">Next</a></li>
										</ul>
									</div>
								</footer>
							</section>
						</div>
						<div class="tab-pane" id="2">
							<h2>Howdy, I'm in Section 2.</h2>
						</div>
						<div class="tab-pane" id="3">
							<h2>Howdy, I'm in Section 3.</h2>
						</div>
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

	<script type="text/javascript">
        var login = "<sec:authentication property="principal.username" htmlEscape="false"/>";

        function tweet() {
            $.ajax({
                type: 'POST',
                url: "rest/tweets",
                contentType: "application/json",
                data: $("#tweetContent").val(),
                dataType: "json",
                success: function(data) {
                    $("#tweetContent").val("");
                    setTimeout(
                            function() {
                                refreshProfile();
                                listTweets();
                            }, 1000);
                }
            });
        }

        function listTweets() {
			$.ajax({
				type: 'GET',
				url: "rest/tweets",
				dataType: "json",
				success: function(data) {
					$('#tweetsList').empty();
					$.each(data, function(entryIndex, entry) {
						var html = '<tr valign="top">';
						html += '<td align="center"><img src="http://www.gravatar.com/avatar/' + entry['picture'] + '?f=y&s=64" width="64px" /></td>';
						html += '<td width="100%">';
						html += '<strong>' + entry['firstName'] + ' ' + entry['lastName'] + '</strong>&nbsp;<em>@' + entry['login'] + '</em><br/>';
						html += entry['content'];
						html += '</td>';
						html += '<td><a href="javascript:addFriend(\'' + entry['login'] + '\')" title="Follow"><i class="icon-heart" /></a></td>';
						html += '<td align="right">' + entry['prettyPrintTweetDate'] + '</td>';
						html += '</tr>';
						$('#tweetsList').append(html);
					});
				}
			});
		}

		function addFriend(friend) {
			var url = "rest/users/" + login + "/addFriend";
			$.ajax({
				type: 'POST',
				url: url,
				contentType: "application/json",
				data: friend,
				dataType: "json"
			});
		}

        function refreshProfile() {
            var url = "rest/users/" + login + "/";
			$.ajax({
				type: 'GET',
				url: url,
				dataType: "json",
				success: function(data) {
                    $("#picture").replaceWith('<img src="http://www.gravatar.com/avatar/' + data.picture + '?f=y&s=64" width="64px" />');
					$("#firstName").text(data.firstName);
					$("#lastName").text(data.lastName);
					$("#tweetCount").text(data.tweetCount);
					$("#friendsCount").text(data.friendsCount);
					$("#followersCount").text(data.followersCount);
				}
			});
        }

		$(document).ready(function() {
			refreshProfile();
			listTweets();
		});
	</script>
  </body>
</html>
