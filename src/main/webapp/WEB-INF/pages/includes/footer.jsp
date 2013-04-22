<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="templates-commons.jsp"/>

<c:if test="${wro4jEnabled eq false}">
    <script src="/js/jquery.js"></script>
    <script src="/js/jquery-ui.min.js"></script>
    <script src="/js/bootstrap.js"></script>
    <script src="/js/bootstrap-tour.js"></script>
    <script src="/js/underscore.js"></script>
    <script src="/js/underscore-polyfill.js"></script>
    <script src="/js/backbone.js"></script>
    <script src="/js/backbone.localStorage-min.js"></script>
    <script src="/js/jquery-charcount.js"></script>
    <script src="/js/jquery-timeago.js"></script>
    <script src="/js/jquery-tatami-infinitiScroll.js"></script>
    <script src="/js/marked.js"></script>
    <script src="/js/jquery.ui.widget.js"></script>
    <script src="/js/jquery.iframe-transport.js"></script>
    <script src="/js/jquery.fileupload.js"></script>
    <script src="/js/d3.js"></script>
    <script src="/js/d3.layout.cloud.js"></script>
    <script src="/js/tatami-commons.js"></script>
    <script src="/js/tatami-search.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static-wro4j/${version}/all.js"></script>
</c:if>
<c:if test="${googleAnalyticsKey ne ''}">
    <script type="text/javascript">
        $(document).on('ajaxComplete', function (event, request, settings) {
            _gaq.push(['_trackEvent', event.currentTarget.URL, settings.url, login, request.status]);
        });
    </script>
</c:if>

