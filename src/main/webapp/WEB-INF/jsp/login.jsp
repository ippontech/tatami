<html lang="en">
  <head>
	<meta charset="utf-8">
	<title>TaTaMi - login</title>
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
				</a>
				<a class="brand" href="#">TaTaMi</a>
				<div class="nav-collapse">
					<ul class="nav">
						<li class="active"><a href="#"><i class="icon-lock icon-white"></i> Login</a></li>
						<li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i> About</a></li>
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
		<h1>Authentication</h1>
	</div>

	<form action="/tatami/authentication" method="post" class="well">
        <fieldset>
			<label>Login :</label> <input id="j_username" name="j_username"
				type="text" autofocus class="input-xlarge"
				placeholder="Your login..." />
			<label>Password :</label> <input id="j_password" name="j_password"
				type="password" class="input-xlarge"
				placeholder="Your password..." />
		</fieldset>
		<label class="checkbox">
			<input type='checkbox'
				name='_spring_security_remember_me' id="_spring_security_remember_me" value="true"
            	checked="true" /> Remember for 30 days
        </label>

		<button type="submit" class="btn btn-primary">Authenticate</button>
	</form>

	<!-- Le javascript
	================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="/assets/js/jquery.js"></script>
	<script src="/assets/js/bootstrap-tab.js"></script>

  </body>
</html>
