<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<script >
    jQuery(function($) {
        var tour = new Tour({
            labels: {
                end: '<fmt:message key="tatami.help.end"/>',
                next: '<fmt:message key="tatami.help.next"/>',
                prev: '<fmt:message key="tatami.help.previous"/>'
            },
            backdrop: true,
            useLocalStorage: true
        });

        tour.addStep({
            element: "#help-tour",
            placement: "bottom",
            stepId: "presentationHelp",
            title: "<fmt:message key="tatami.help.home.presentation.title"/>",
            content: "<fmt:message key="tatami.help.home.presentation.content"/>"
        });

        tour.addStep({
            element: "#tatamiBody",
            placement: "left",
            stepId: "timelineHelp",
            title: "<fmt:message key="tatami.help.home.timeline.title"/>",
            content: "<fmt:message key="tatami.help.home.timeline.content"/>"
        });

        tour.addStep({
            element: "#editTatam",
            placement: "left",
            stepId: "updateStatusContentHelp",
            title: "<fmt:message key="tatami.help.home.updatestatus.title"/>",
            content: "<fmt:message key="tatami.help.home.updatestatus.content"/>"
        });

        tour.addStep({
            element: "#groups-list-title",
            placement: "right",
            stepId: "groupsHelp",
            title: "<fmt:message key="tatami.help.home.groups.title"/>",
            content: "<fmt:message key="tatami.help.home.groups.content"/>",
            container: "#tatamiBody"
        });

        tour.addStep({
            element: "#follow-suggest-title",
            placement: "right",
            stepId: "follow-suggestHelp",
            title: "<fmt:message key="tatami.help.home.follow-suggest.title"/>",
            content: "<fmt:message key="tatami.help.home.follow-suggest.content"/>",
            container: "#tatamiBody"
        });

        tour.addStep({
            element: "#profile-trends-title",
            placement: "right",
            stepId: "profileTrendsHelp",
            title: "<fmt:message key="tatami.help.home.profileTrends.title"/>",
            content: "<fmt:message key="tatami.help.home.profileTrends.content"/>",
            container: "#tatamiBody"
        });


        $("#help-menu").show();

        $("#help-tour").click(function (e) {
            e.preventDefault();
            tour.setCurrentStep(0);
            tour.start(true);
            $(this).parents(".alert").alert("close");
        });
    });

</script>
