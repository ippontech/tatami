<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" 	uri="http://www.springframework.org/tags" %>

<!DOCTYPE html>
<html lang="en">
  <head>
	<meta charset="utf-8">
	<title><spring:message code="tatami.title" /> - About</title>
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
					<a class="brand" href="#"><img src="${request.getContextPath}/assets/img/ippon-logo.png">&nbsp;<spring:message code="tatami.title" /></a>
					<div class="nav-collapse">
						<ul class="nav">
							<li class="active"><a href="#"><i class="icon-home icon-white"></i>&nbsp;<spring:message code="tatami.home" /></a></li>
	                        <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message code="tatami.about" /></a></li>
	                        <!-- <li><a href="?language=en"> English</a>|<a href="?language=fr"> Francais</a></li> -->
						</ul>
						<ul class="nav pull-right">
							<li class="divider-vertical"></li>
							<li><a href="/tatami/logout"><i class="icon-user icon-white"></i>&nbsp;<spring:message code="tatami.logout" /></a></li>
						</ul>
					</div><!--/.nav-collapse -->
				</div>
			</div>
		</div>

    <div class="container">
        <div class="span12">
            <h1>Presentation</h1>
            <p>Tatami is a twitter-like application, for internal use inside a company.</p>
            <p>
                More information on our Github page : <a href="https://github.com/ippontech/tatami">https://github.com/ippontech/tatami</a>
            </p>
        </div>
        <div class="span12">
            <h2>License</h2>

            <p>Copyright 2012 <a href="http://www.ippon.fr">Ippon Technologies</a></p>

            <p>Licensed under the Apache License, Version 2.0 (the "License");
                you may not use this application except in compliance with the License.
                You may obtain a copy of the License at</p>

            <p><a href="http://www.apache.org/licenses/LICENSE-2.0"></a><a
                    href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a></p>

            <p>Unless required by applicable law or agreed to in writing, software
                distributed under the License is distributed on an "AS IS" BASIS,
                WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                See the License for the specific language governing permissions and
                limitations under the License.</p>
        </div>
    </div>
    <br/><br/><br/><br/><br/><br/>
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
