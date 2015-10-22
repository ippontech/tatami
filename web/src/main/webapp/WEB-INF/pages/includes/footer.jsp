<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${wro4jEnabled eq false}">
    <script src="/js/vendor/jquery.js"></script>
    <script src="/js/vendor/bootstrap.js"></script>
    <script src="/js/vendor/bootstrap-tour.js"></script>
    <script src="/js/vendor/underscore.js"></script>
    <script src="/js/vendor/underscore-polyfill.js"></script>
    <script src="/js/vendor/backbone.js"></script>
    <script src="/js/vendor/marked.js"></script>
    <script src="/js/vendor/backbone.marionette.js"></script>
    <script src="/js/vendor/modernizr.js"></script>
    <script src="/js/vendor/jquery.ui.widget.js"></script>
    <script src="/js/vendor/jquery.iframe-transport.js"></script>
    <script src="/js/vendor/jquery.fileupload.js"></script>
    <script src="/js/vendor/jquery.atmosphere.js"></script>
    <script src="/js/vendor/jquery-timeago.js"></script>
    <script src="/js/vendor/jquery.placeholder.js"></script>
    <script src="/js/app/plugins/tatami.atmosphere.js"></script>
    <script src="/js/app/plugins/bootstrap-filestyle.min.js"></script>
    <script src="/js/vendor/jquery.jgrowl.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static-wro4j/${version}/tatami-vendor.js"></script>
</c:if>

