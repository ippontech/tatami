<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div id="topmenu" class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand" href="/tatami/"><img
                    src="${request.getContextPath}/assets/img/ippon-logo.png">&nbsp;<spring:message
                    code="tatami.title"/></a>

            <div class="nav-collapse">
                <ul class="nav">
                    <li class="active"><a href="/tatami/"><i class="icon-home icon-white"></i>&nbsp;<spring:message
                            code="tatami.home"/></a></li>
                    <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message
                            code="tatami.about"/></a></li>
                </ul>
                <ul class="nav pull-right">
                    <li class="divider-vertical"></li>
                    <li><a href="/tatami/logout"><i class="icon-user icon-white"></i>&nbsp;<spring:message
                            code="tatami.logout"/></a></li>
                </ul>
                <ul class="nav pull-right">
					<form id="global-tweet-search" class="well form-search" style="padding:4px 2px 4px 2px;margin:3px 0px;background-color:#2C2C2C;" action="/tatami/rest/search" method="post">
					  <input type="hidden" name="page" value="0" />
					  <input type="hidden" name="rpp" value="20" />
					  <input type="text" name="q" class="input-medium search-query" placeholder="<spring:message code="tatami.search.placeholder"/>">
					  <button type="submit" class="btn" style="margin-top:0px;"><spring:message code="tatami.search.button"/></button>
					</form>
                </ul>
            </div>
        </div>
    </div>
</div>