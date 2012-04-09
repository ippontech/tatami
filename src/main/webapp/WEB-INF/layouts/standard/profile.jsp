<%@ taglib prefix="sec"		uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" 	uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt"	 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title><spring:message code="tatami.title" /> - <spring:message code="tatami.profile" /></title>
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
	
		<div class="container-fluid" id="userProfile">
			<c:choose>
				<c:when test="${not empty user}">
					
					<div id="userProfileDesc" class="row-fluid">
						<div class="span2">
							<img id="userPicture" src="http://www.gravatar.com/avatar/${user.gravatar}/>?s=128" rel="popover"/>
						</div>
						<div class="span7">
							<h1>${user.firstName}&nbsp;${user.lastName}</h1>
							<span><a href="<%=request.getContextPath()%>/tatami/profile/${user.login}" title="${user.firstName}&nbsp;${user.lastName}">@${user.login}</a></span>
						</div>
						<div class="span3">
							<ul id="profileStats">
								<sec:authentication property='principal.username' var="login"/>
								<c:choose>
									<c:when test="${not empty user && user.login eq login}">
										<li>
											<a href="#" id="followBtn" class="btn btn-inverse disabled" title="You are!"><spring:message code="tatami.user.yourare" /></a>
										</li>
									</c:when>
									<c:when test="${not empty followed && followed}">
										<li>
											<a href="#" id="unfollowBtn" onclick="removeFollowingAnUserFromHisProfile(login, '${user.login}')" class="btn btn-info" title="${user.firstName}&nbsp;${user.lastName}"><spring:message code="tatami.user.followed" /></a>
											<a href="#" id="followBtn" onclick="followUserFromHisProfile(login, '${user.login}')" class="btn btn-success hide" title="${user.firstName}&nbsp;${user.lastName}"><spring:message code="tatami.user.follow" /></a>
										</li>
									</c:when>
									<c:otherwise>
										<li>
											<a href="#" id="unfollowBtn" onclick="removeFollowingAnUserFromHisProfile(login, '${user.login}')" class="btn btn-info" title="${user.firstName}&nbsp;${user.lastName}"><spring:message code="tatami.user.followed" /></a>
											<a href="#" id="followBtn" onclick="followUserFromHisProfile(login, '${user.login}')" class="btn btn-success hide" title="${user.firstName}&nbsp;${user.lastName}"><spring:message code="tatami.user.follow" /></a>
										</li>
									</c:otherwise>
								</c:choose>
								<li class="bottomline">
									<strong><fmt:formatNumber value="${nbTweets}" pattern="# ### ###"/></strong>&nbsp;<spring:message code="tatami.user.nbTweets" />
								</li>
			    				<li class="bottomline">
			    					<strong><fmt:formatNumber value="${nbFollowed}" pattern="# ### ###"/></strong>&nbsp;<spring:message code="tatami.user.nbFollowedUsers" />
			    				</li>
			    				<li class="bottomline">
			    					<strong><fmt:formatNumber value="${nbFollowers}" pattern="# ### ###"/></strong>&nbsp;<spring:message code="tatami.user.nbFollowers" />
			    				</li>
							</ul>
						</div>
					</div>
					
					<div class="row-fluid">
						<div id="profilemenuleft" class="span3">
							<div class="row-fluid">
								<h2><spring:message code="tatami.user.tweettohim" />&nbsp;:</h2>
								<div id="tweetToHim" class="row-fluid">
									<c:set var="tweetTo" value="@${user.login}"/>
									<form class="form-inline" onsubmit="return tweet();">
										<textarea id="tweetContent" rel="popover" class="focused" maxlength="140" placeholder="Type here..." ></textarea>
										<button type="submit" class="btn btn-primary"><spring:message code="tatami.user.tweet" /></button>
									</form>
									<div class="error"></div>
								</div>
							</div>
							<div class="row-fluid">
								<h2><spring:message code="tatami.user.suggestions" />&nbsp;:</h2>
								<div id="suggestions" class="row-fluid"></div>
							</div>
						</div>
						<div id="userTimeline" class="span9">
						
							
						</div>
					</div>
					
				</c:when>
				<c:otherwise>
					
					<div class="row-fluid">
						<a href="#" title="404">
							<img src="${request.getContextPath}/assets/img/judoka_prise_404.jpg"/>
						</a>
						<spring:message code="tatami.user.undefined" />
					</div>
					
				</c:otherwise>
			</c:choose>
		</div>
		
		<footer>
	        <div style="text-align: center;"><spring:message code="tatami.copyright" /> | <a href="http://www.ippon.fr"><spring:message code="tatami.ippon.technologies" /></a> |
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
	        resetNbTweetsToDefaultNumber();
	        var login = "<sec:authentication property='principal.username'/>";
	        $(document).ready(function() {
				initTatamiProfile(login);
				
				$('#tweetContent').click(function(){
					this.value='${tweetTo} ';
				});
			});
		</script>
		
	</body>
</html>