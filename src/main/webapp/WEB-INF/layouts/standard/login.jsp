<%@ taglib prefix="spring" 	uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html lang="en">
  <head>
	<meta charset="utf-8">
	<title>Tatami - Authentication</title>
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
						<li class="active"><a href="#"><i class="icon-lock icon-white"></i> Login</a></li>
						<li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i> About</a></li>
					</ul>
				</div><!--/.nav-collapse -->
			</div>
		</div>
	</div>

    <div class="container">
        <div class="span4 offset4">
            <h1>Authentication</h1>

            <form action="/tatami/authentication" method="post" class="well">
                <fieldset>
                    <label>Login :</label> <input id="j_username" name="j_username"
                                                  type="text" required="required" autofocus class="input-xlarge"
                                                  placeholder="Your login..."/>
                    <label>Password :</label> <input id="j_password" name="j_password"
                                                     type="password" required="required" class="input-xlarge"
                                                     placeholder="Your password..."/>
                </fieldset>
                <label class="checkbox">
                    <input type='checkbox'
                           name='_spring_security_remember_me' id="_spring_security_remember_me"
                           value="true" checked="true"/> Remember for 30 days
                </label>

                <button type="submit" class="btn btn-success">Authenticate</button>
            </form>
        </div>
    </div>
    <br/><br/><br/>
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
	<script src="/assets/js/bootstrap-tab.js"></script>

  </body>
</html>
