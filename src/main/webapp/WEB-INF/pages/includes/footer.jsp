<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="templates-commons.jsp"/>

<c:if test="${wro4jEnabled eq false}">
    <script src="/js/jquery.min.js"></script>
    <script src="/js/jquery-ui.min.js"></script>
    <script src="/js/bootstrap-min.js"></script>
    <script src="/js/underscore-min.js"></script>
    <script src="/js/backbone-min.js"></script>
    <script src="/js/jquery-charcount.js"></script>
    <script src="/js/jquery-tatami-tagLinker.js"></script>
    <script src="/js/jquery-tatami-usernameLinker.js"></script>
    <script src="/js/jquery-tatami-infinitiScroll.js"></script>
    <script src="/js/tatami-commons.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static/${version}/all.js"></script>
</c:if>
