<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>
<html lang="en"
	xmlns="http://www.w3.org/1999/xhtml">

<jsp:include page="includes/header.jsp"/>

  <body>
		<div id="topbar-home" class="navbar navbar-fixed-top topbar" >
			<div class="navbar-inner">
				<div class="container">
					<a class="brand" href="#"><img src="/assets/img/ippon-logo.png"></img><fmt:message
                    key="tatami.title"/></a>
					<div class="nav-collapse">
						<ul class="nav">
							<li class="active"><a href="/tatami/"><i class="icon-home icon-white"></i>&nbsp;<fmt:message
                            key="tatami.home"/></a></li>
	                        <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<fmt:message
                            key="tatami.about"/></a></li>
						</ul>
						<ul class="nav pull-right">
							<li><a href="/tatami/logout"><i class="icon-user icon-white"></i>&nbsp;<fmt:message
                            key="tatami.logout"/></a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div id="mainMobileContainer" class="row-fluid noMargin">
		<div class="tabbable">
           <ul class="nav nav-tabs">
           		<li class="dropdown">
            		<a id="defaultTab" href="#homePanel" data-toggle="tab">
            			<img src="/assets/img/glyphicons_322_twitter.png"></img>&nbsp;<fmt:message key="tatami.new.status"/></a>
				</li>
				<li class="dropdown">
            		<a id="timelineTab" href="#timelinePanel" data-toggle="tab">
            			<img src="/assets/img/glyphicons_309_comments.png"></img>&nbsp;<fmt:message key="tatami.status"/></a>
				</li>
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown">
						<img src="/assets/img/glyphicons_153_more_windows.png"></img>&nbsp;<fmt:message key="tatami.more"/><b class="caret"></b></a>
		            <ul class="dropdown-menu">
		            	<li>
		            		<a id="profileTab" href="#profilePanel"  data-toggle="tab">
		            			<i class="icon-edit"></i>&nbsp;<fmt:message key="tatami.update.profile.mobile" /></a>
		            	</li>
		            	<li>
		            		<a id="favoriteTab" href="#favlinePanel"  data-toggle="tab">
		            			<i class="icon-star"></i>&nbsp;<fmt:message key="tatami.favorites.mobile" /></a>
		            	</li>
		            	<li>
		            		<a id="userlineTab" href="#userlinePanel" data-toggle="tab">
		            			<img src="/assets/img/glyphicons_024_parents.png"></img>&nbsp;<fmt:message key="tatami.userline.mobile" /></a>
		            	</li>
						<li>
		            		<a id="taglineTab" href="#taglinePanel" data-toggle="tab">
		            			<i class="icon-tags"></i>&nbsp;<fmt:message key="tatami.tagline.mobile" /></a>
		            	</li>
		            	<li>
		            		<a id="followTab" href="#followPanel"  data-toggle="tab">
		            			<i class="icon-random"></i>&nbsp;<fmt:message key="tatami.user.suggestions.mobile" /></a>
		            	</li>
		            </ul>
				</li>
			</ul>
			<div id="dataContentPanel" class="tab-content alert noPadding">
				<div class="tab-pane active alert-info" id="homePanel">
					<div id="homePanelUserDetails" class="row-fluid">
						<div id="userMain" class="span3 noMargin gravatar">
							<a href="#">
								<img id="picture" src="http://www.gravatar.com/avatar/${user.gravatar}?s=64'" data-user="${user.login}"></img>
							</a>
						</div>
						<div class="span9 noMargin">
							<h2>
								<span id="firstName">${user.firstName}</span> 
								<span id="lastName">${user.lastName}</span>
							</h2>
						</div>
					</div>
					<div id="homePanelUserStats" class="well well-small row-fluid noMargin noPadding">
						<div class="span4 noMargin noPadding center">
							<span id="statusCount" class="badge" data-user="${user.login}">${user.statusCount}</span><br/>Status
						</div>
						<div class="span4 noMargin noPadding center">
							<span id="friendsCount" class="badge">${user.friendsCount}</span><br/>Followed
						</div>
						<div class="span4 noMargin noPadding center">
							<span id="followersCount" class="badge">${user.followersCount}</span><br/>Followers
						</div>
					</div>
					<div id="homePanelStatus" class="row-fluid noMargin center">
						<div id="statusErrorPanel" class="alert alert-error noPadding" style="display: none;">
							<h4 class="alert-heading">Error!</h4>
							<span class="errorMessage"></span>
						</div>

						<table id="statusForm" class="center row-fluid noMargin noPadding">
							<tr>
								<td class="center">
									<textarea id="statusContent" class="focused"
										maxlength="500"
										name="content" 
										placeholder="Type a new status..."></textarea>
								</td>
							</tr>
							<tr>
								<td>
									<button id="statusButton" type="button" class="btn btn-primary"><fmt:message key="tatami.user.status" /></button>
								</td>
							</tr>
						</table>			
					</div>					 		
				</div>
				<div class="tab-pane alert-info" id="profilePanel">
					Profile				
				</div>
				<div class="tab-pane alert-info" id="followPanel">
					Follow								
				</div>				
				<div class="tab-pane alert-success" id="timelinePanel">
					Timeline					
				</div>
				<div class="tab-pane alert-success" id="favlinePanel">
					Favorites					
				</div>
				<div class="tab-pane alert-success" id="userlinePanel">
					Userline					
				</div>
				<div class="tab-pane alert-success" id="taglinePanel">
					Tagline					
				</div>																							
			</div>
		</div>
	</div>
	
	<div id="userTemplate" style="display: none;">
		<table>
			<tbody>
            	<tr id="emptyUserTemplate">
					<td colSpan="2">
						No new user to follow today...
					</td>
            	</tr>
            	<tr id="emptyUserSearchTemplate">
					<td colSpan="2" class="center">
						No user found for your search...
					</td>
            	</tr>            	
            	<tr id="fullUserTemplate">
            		<td style="width: 90%;">
            			<table class="internalUserTemplateTable" style="border: none; width: 100%;">
            				<td>
            					<img class="statusGravatar"
									src="http://www.gravatar.com/avatar/?s=32"
									data-user="">
								</img>
            				</td>
            				<td>
            					<a class="userLink" href="#" style="text-decoration:none;" data-user="" title="">
									<em>@login</em>
								</a>
            				</td>
            				<td>
            					<span class="userDetailsName">name</span>
            				</td>
            				<td>
            					Status<br/><span class="badge">1</span>
            				</td>
            			</table>
            		</td>
            		<td class="statusFriend">
            			<a href="#" data-follow="" title="Follow">
            				<i class="icon-eye-open"></i>
            			</a>&nbsp;
            		</td>
            	</tr>
			</tbody>
		</table>
	</div>

	<div id="statusTemplateContainer" style="display: none;">
		<table id="statusTemplate">
			<tbody>
				<tr class="data">
					<td class="statusGravatarColumn">
						<img class="statusGravatar"
							data-user="" src="http://www.gravatar.com/avatar/?s=32"></img>
					</td>
					<td>
						<article>
							<strong class="statusAuthor"></strong>
							<span class="statusText"></span>
						</article>
					</td>
					<td class="statusFriend">
					</td>
					<td class="statusDate">
						<aside>status.prettyPrintStatusDate</aside>
					</td>
				</tr>
			</tbody>
		</table>
		<table id="statusPaddingTemplate">
			<tbody>
				<tr style="display: none;">
					<td colspan="4"></td>
				</tr>
			</tbody>
		</table>
	</div>

    <div id="userProfileModal" class="modal" style="display: none;">
	    <div class="modal-header center userDetailsTitle">
			<span id="userProfileLogin">@login</span>
			<a class="close userProfileClose" data-dismiss="modal">&times;</a>
	    </div>
	    <div class="modal-body row-fluid noMargin noPadding">
			<div id="userProfileGravatar" class="span3">
				<img class="statusGravatar"
							data-user="" src="http://www.gravatar.com/avatar/?s=32"></img>
			</div>
	    	<div id="userProfileInfo" class="span9 noMargin">
	    		<div id="userProfileName" class="row-fluid noMargin">Name</div>
	    		<div id="userProfileLocation" class="row-fluid noMargin" style="display:none;">
	    			<span class="span3 userProfileLabel">Location:&nbsp;</span><span>Somewhere</span>
				</div>
    			<div id="userProfileWebsite" class="row-fluid noMargin" style="display:none;">
	    			<span class="span3  userProfileLabel">Website:&nbsp;</span><a href="" target="_blank">http://www.ippon.fr</a> 
    			</div>
	    		<div id="userProfileBio" class="row-fluid noMargin">
	    		</div>
	    	</div>
	    </div>
	    <div id="userProfileFooter" class="modal-footer row-fluid noMargin">
			<div class="span4 center">
				<span id="userProfileStatusCount" class="badge" data-modal-hide="#userProfileModal">1</span><br/>Status
			</div>
			<div class="span4 center">
				<span id="userProfileFriendsCount" class="badge">0</span><br/>Followed
			</div>
			<div class="span4 center">
				<span id="userProfileFollowersCount" class="badge">0</span><br/>Followers
			</div>
	    </div>
    </div>

	<div id="sessionTimeOutModal" class="modal" style="display: none;">
	    <div class="modal-header">
		    <a class="close" data-dismiss="modal">&times;</a>
		    <h3>Security Session Timeout</h3>
		</div>
		<div class="modal-body">
		    <p>Your security session has expired, do you want to login again ?</p>
		</div>
		<div class="modal-footer">
		    <a href="#" class="btn btn-primary redirectToLogin">Re-login</a>
		    <a href="#" class="btn" data-dismiss="modal">Ignore</a>
	    </div>
	</div>

	<jsp:include page="includes/footer.jsp"/>

	<div id="home-javascript">
		<script type="text/javascript">
			/*<![CDATA[*/
			
       		var login =  "<sec:authentication property="principal.username"/>";
           	
			// Retrieve the default Nb Status value from the server
			var DEFAULT_TWEET_LIST_SIZE = /*[[${DEFAULT_TWEET_LIST_SIZE}]]*/ 10;
			
			// Retrieve the default Nb Favorite value from the server				           
			var DEFAULT_FAVORITE_LIST_SIZE = /*[[${DEFAULT_FAVORITE_LIST_SIZE}]]*/ 10;
			
			// Retrieve the default Nb Tag value from the server				           
			var DEFAULT_TAG_LIST_SIZE = /*[[${DEFAULT_TAG_LIST_SIZE}]]*/ 10;

			// Retrieve the default status first fetch size value from the server
			var TWEET_FIRST_FETCH_SIZE = /*[[${TWEET_FIRST_FETCH_SIZE}]]*/ 5;
			
			// Retrieve the default status second fetch size value from the server
			var TWEET_SECOND_FETCH_SIZE = /*[[${TWEET_SECOND_FETCH_SIZE}]]*/ 10;
			
			// Retrieve the default status third fetch size value from the server
			var TWEET_THIRD_FETCH_SIZE = /*[[${TWEET_THIRD_FETCH_SIZE}]]*/ 20;
			
			var TWEET_NB_PATTERN = /*[[${TWEET_NB_PATTERN}]]*/ "__TWEET-NB__";
			var TWEET_NB_REGEXP = new RegExp(TWEET_NB_PATTERN, "g");
			
			var START_TWEET_INDEX_PATTERN = /*[[${START_TWEET_INDEX_PATTERN}]]*/ "__START__";
			var START_TWEET_INDEX_REGEXP = new RegExp(START_TWEET_INDEX_PATTERN, "g");
			
			var END_TWEET_INDEX_PATTERN = /*[[${END_TWEET_INDEX_PATTERN}]]*/ "__END__";
			var END_TWEET_INDEX_REGEXP = new RegExp(END_TWEET_INDEX_PATTERN, "g");
			
			var USER_LOGIN_PATTERN = /*[[${USER_LOGIN_PATTERN}]]*/ "__LOGIN__";
			var USER_LOGIN_REGEXP = new RegExp(USER_LOGIN_PATTERN, "g");
			
			var TAG_PATTERN = /*[[${TAG_PATTERN}]]*/ "__TAG__";
			var TAG_REGEXP = new RegExp(TAG_PATTERN, "g");
			
			var HTTP_GET = 'GET';
			
			var HTTP_POST = 'POST';
			
			var JSON_DATA = 'json';
			
			var JSON_CONTENT = 'application/json; charset=UTF-8';
           	/*]]>*/
       	</script>

		<script src="/assets/js/tatami/mobile/tatami-mobile.js"></script>        	 
	</div>
  </body>
  
</html> 