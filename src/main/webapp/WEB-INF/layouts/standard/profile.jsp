<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div class="container-fluid mainPanel">
    <c:choose>
        <c:when test="${not empty user}">
            <div class="container mainPanel">
              <div class="row">
                <div class="span12">
                  <div class="well">
                    <div class="row-fluid">
                      <div class="span4 text-center">
                        <a href="/tatami/profile/${user.username}/" title="<fmt:message key="tatami.user.profile.show"/> ${user.firstName} ${user.lastName}">
                          <img class="pull-left nomargin avatar" src="http://www.gravatar.com/avatar/${user.gravatar}?s=64" alt="${user.firstName} ${user.lastName}">
                          ${user.firstName} ${user.lastName}
                          <br>
                          @${user.username}
                        </a>
                        <br/>
                        <div id='follow-action'></div>
                      </div>
                      <div class="span8">
                        <table class="table table-center hidden-phone nomargin">
                          <thead>
                            <tr>
                              <th><fmt:message key="tatami.badge.status"/></th>
                              <th><fmt:message key="tatami.badge.followed"/></th>
                              <th><fmt:message key="tatami.badge.followers"/></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><span class="badge badge-info">${nbStatus}</span></td>
                              <td><span class="badge badge-info">${nbFollowed}</span></td>
                              <td><span class="badge badge-info">${nbFollowers}</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="span12">
                  <div class="row-fluid">
                    <div class="span4">
                      <div class="alert alert-info">
                        <div class="row-fluid">
                          <div class="span12">
                            <ul class="nav nav-pills nav-stacked profilMenu">
                              <li><a href="#/status"><fmt:message key="tatami.badge.status"/></a></li>
                              <li><a href="#/followers"><fmt:message key="tatami.badge.followed"/></a></li>
                              <li><a href="#/followed"><fmt:message key="tatami.badge.followers"/></a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="span8">
                      <div id="tab-content"></div>
                      <!-- <div class="row-fluid">
                        <div class="span12">
                          <div class="alert alert-info">
                            <div class="row-fluid">
                              <div class="span12">
                                <a href="/tatami/profile/arthur.weber/" class="userStatus" title="Show profile of @arthur.weber Arthur Weber"><img class="avatar avatar-small" src="http://www.gravatar.com/avatar/e1ae9d08f38dcca2cee4a88c76d28706?s=64" alt="Arthur Weber">
                                  Arthur Weber <em>@arthur.weber</em>
                                </a>
                                <p class="pull-right"><span class="btn btn-primary">Suivre</span></p>
                              </div>    
                            </div>
                          </div>
                        </div>
                      </div> -->
                    </div>
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


<jsp:include page="includes/templates-profile.jsp"/>
<jsp:include page="includes/footer.jsp"/>

<sec:authentication property="principal.username" var="login"/>
<script type="text/javascript">
    var test = "${user.login}";
    var username = "${user.username}";
    var page = "profile";
    var followed = ${followed};
    var owner = ${user.login eq login};
</script>

<script src="/assets/js/tatami-profile.js"></script>

</body>
</html>