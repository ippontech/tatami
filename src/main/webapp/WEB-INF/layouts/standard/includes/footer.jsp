<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<footer>
    <div id="footer" class="navbar navbar-fixed-bottom">
        <a href="http://www.ippon.fr" id="footer_ippon"><fmt:message key="tatami.copyright"/> <fmt:message key="tatami.ippon.technologies"/></a> |
        <a href="https://github.com/ippontech/tatami" id="footer_github"><fmt:message key="tatami.github.fork"/></a> |
        <a href="http://blog.ippon.fr" id="footer_blog"><fmt:message key="tatami.ippon.blog"/></a> |
        <a href="https://twitter.com/#!/ippontech" id="footer_twitter"><fmt:message key="tatami.ippon.twitter.follow"/></a>
    </div>
</footer>

<!-- Le javascript -->

<!-- Placed at the end of the document so the pages load faster -->
<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
<script>!window.jQuery && document.write(unescape('%3Cscript src="/assets/js/jquery/jquery-1.7.2.min.js"%3E%3C/script%3E'))</script>

<c:if test="${wro4jEnabled eq false}">
    <script src="/assets/js/jquery-min.js"></script>
    <script src="/assets/js/jquery-tagLinker.js"></script>
    <script src="/assets/js/jquery-usernameLinker.js"></script>
    <script src="/assets/js/bootstrap-min.js"></script>
    <script src="/assets/js/underscore-min.js"></script>
    <script src="/assets/js/backbone-min.js"></script>

    <sec:authorize access="isAuthenticated()" >
        <script src="/assets/js/tatami-commun.js"></script>
    </sec:authorize>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static/${version}/all.js"></script>
</c:if>