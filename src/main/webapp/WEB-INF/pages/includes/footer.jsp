<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="templates-commons.jsp"/>

<footer>
    <div id="footer" class="navbar navbar-fixed-bottom">
        <a href="http://www.ippon.fr" id="footer_ippon"><fmt:message key="tatami.copyright"/> <fmt:message key="tatami.ippon.technologies"/></a> |
        <a href="https://github.com/ippontech/tatami" id="footer_github"><fmt:message key="tatami.github.fork"/></a> |
        <a href="http://blog.ippon.fr" id="footer_blog"><fmt:message key="tatami.ippon.blog"/></a> |
        <a href="https://twitter.com/#!/ippontech" id="footer_twitter"><fmt:message key="tatami.ippon.twitter.follow"/></a>
    </div>
</footer>

<!-- Le javascript -->

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>

<script src="/js/raphael-min.js"></script>

<c:if test="${wro4jEnabled eq false}">
    <script src="/js/bootstrap-min.js"></script>
    <script src="/js/underscore-min.js"></script>
    <script src="/js/backbone-min.js"></script>
    <script src="/js/jquery-tatami-tagLinker.js"></script>
    <script src="/js/jquery-tatami-usernameLinker.js"></script>
    <script src="/js/jquery-raphael-tatami-pie.js"></script>
    <script src="/js/jquery-tatami-infinitiScroll.js"></script>
    <script src="/js/tatami-commons.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static/${version}/all.js"></script>
</c:if>
