<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div class="container-fluid mainPanel">
<c:choose>
<c:when test="${not empty user}">

    <div id="userProfileDesc" class="row-fluid">
        <div class="span1">
            <img id="userPicture" src="http://www.gravatar.com/avatar/${user.gravatar}/>?s=64"/>
        </div>
        <div class="span7" style="width: 250px">
            <a href="/tatami/profile/${user.username}/"><h3>${user.firstName}&nbsp;${user.lastName}</h3>
                @${user.username}</a>
        </div>
    </div>

    <div class="row-fluid">
        <div id="menuContent" class="span4">
            <div class="alert alert-info">
                <ul class="nav nav-pills nav-stacked">
                    <li>
                        <a id="profileTab" href="/tatami/account"><i
                                class="icon-user"></i>&nbsp;<fmt:message
                                key="tatami.menu.profile"/></a>
                    </li>
                    <li><a id="passwordTab" href="/tatami/account/password"><i
                            class="icon-lock"></i>&nbsp;<fmt:message
                            key="tatami.menu.password"/></a></li>
                    <li class="active"><a id="enterpriseTab" href="#"><i
                            class="icon-globe"></i>&nbsp;<fmt:message
                            key="tatami.menu.enterprise"/></a>
                    </li>
                </ul>
            </div>
        </div>
        <div id="mainContent" class="span8">
            <div class="tab-content">
                <div class="tab-pane" id="profile">


                </div>
                <div class="tab-pane" id="password">


                </div>
                <div class="tab-pane active" id="enterprise">
                    <h2>Entreprise</h2>
                </div>
            </div>
        </div>
    </div>


</c:when>
<c:otherwise>

    <div class="row-fluid">
        <fmt:message key="tatami.user.undefined"/>
    </div>

</c:otherwise>
</c:choose>
</div>


<jsp:include page="includes/footer.jsp"/>

<script type="text/javascript">
    var login = "<sec:authentication property="principal.username"/>";
    var username = "${user.username}";
    var page = "account";

    $(document).ready(function () {
        initAccount();
    });
</script>
</body>
</html>