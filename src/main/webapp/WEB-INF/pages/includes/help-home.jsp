<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script src="/js/bootstrap-tour.js"></script>
<script src="/js/jquery.cookie.js"></script>

<style>
    #profileHelp {
        width : 400px;
    }
    #profileHelp {
        width : 400px;
    }
    #updateStatusContentHelp {
        width : 400px;
    }
    #timelineHelp {
        width: 400px;
    }
</style>
<script >
    jQuery(function($) {
        var tour = new Tour({
            labels: {
                end: 'End tour',
                next: '<fmt:message key="tatami.help.next"/>',
                prev: '<fmt:message key="tatami.help.previous"/>'
            }
        });

        tour.addStep({
            element: "#tab-content",
            placement: "bottom",
            stepId: "timelineHelp",
            title: "<fmt:message key="tatami.help.home.timeline.title"/>",
            content: "<fmt:message key="tatami.help.home.timeline.content"/>"
        });

        tour.addStep({
            element: "#updateStatusContent",
            placement: "bottom",
            stepId: "updateStatusContentHelp",
            title: "<fmt:message key="tatami.help.home.updatestatus.title"/>",
            content: "<fmt:message key="tatami.help.home.updatestatus.content"/>"
        });

        tour.addStep({
            element: "#groupsList",
            placement: "right",
            stepId: "groupsHelp",
            title: "<fmt:message key="tatami.help.home.groups.title"/>",
            content: "<fmt:message key="tatami.help.home.groups.content"/>"
        });

        tour.addStep({
            element: "#follow-suggest",
            placement: "right",
            stepId: "follow-suggestHelp",
            title: "<fmt:message key="tatami.help.home.follow-suggest.title"/>",
            content: "<fmt:message key="tatami.help.home.follow-suggest.content"/>"
        });

        tour.addStep({
            element: "#profileTrends",
            placement: "right",
            stepId: "profileTrendsHelp",
            title: "<fmt:message key="tatami.help.home.profileTrends.title"/>",
            content: "<fmt:message key="tatami.help.home.profileTrends.content"/>"
        });

    tour.setCurrentStep(0);
    tour.start(true);
    });

</script>
