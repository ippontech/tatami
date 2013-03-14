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
            <div id="mainPanel" class="container">
              <div class="row">
                <div class="span12">
                  <div class="alert alert-status">
                    <div class="row-fluid">
                      <div class="span4 text-center avatar-float-left-container">
                        <a class="pull-left avatar-float-left" href="/tatami/profile/${user.username}/" title="<fmt:message key="tatami.user.profile.show"/> @${user.username} ${user.firstName} ${user.lastName}">
                          <img class="nomargin avatar" src="https://www.gravatar.com/avatar/${user.gravatar}?s=64&d=mm" alt="@${user.username} ${user.firstName} ${user.lastName}">
                        </a>
                        <div class="profile-title">
                          <div>
                            <a href="/tatami/profile/${user.username}/" title="<fmt:message key="tatami.user.profile.show"/> @${user.username}">
                              <h4>${user.firstName} ${user.lastName}</h4>
                            </a>
                            <a href="/tatami/profile/${user.username}/" title="<fmt:message key="tatami.user.profile.show"/> @${user.username}">
                              @${user.username}
                            </a>
                          </div>
                          <div id="is-follow-you"></div>
                          <div id='follow-action'></div>
                        </div>
                      </div>
                      <div class="span8">
                        <table class="table profile-infos hidden-phone nomargin">
                          <thead>
                            <tr>
                              <th>
                                <a href="/tatami/profile/${user.username}/#/status" title="<fmt:message key="tatami.user.profile.show"/> @${user.username} ${user.firstName} ${user.lastName}">
                                  <fmt:message key="tatami.badge.status"/>
                                </a>
                              </th>
                              <th>
                                <a href="/tatami/profile/${user.username}/#/followed" title="<fmt:message key="tatami.user.profile.show"/> @${user.username} ${user.firstName} ${user.lastName}">
                                  <fmt:message key="tatami.badge.followed"/>
                                </a>
                              </th>
                              <th>
                                <a href="/tatami/profile/${user.username}/#/followers" title="<fmt:message key="tatami.user.profile.show"/> @${user.username} ${user.firstName} ${user.lastName}">
                                  <fmt:message key="tatami.badge.followers"/>
                                </a>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <a href="/tatami/profile/${user.username}/#/status" title="<fmt:message key="tatami.user.profile.show"/> @${user.username} ${user.firstName} ${user.lastName}">
                                  <span class="badge badge-info">${nbStatus}</span>
                                </a>
                              </td>
                              <td>
                                <a href="/tatami/profile/${user.username}/#/followed" title="<fmt:message key="tatami.user.profile.show"/> @${user.username} ${user.firstName} ${user.lastName}">
                                  <span class="badge badge-info">${nbFollowed}</span>
                                </a>
                              </td>
                              <td>
                                <a href="/tatami/profile/${user.username}/#/followers" title="<fmt:message key="tatami.user.profile.show"/> @${user.username} ${user.firstName} ${user.lastName}">
                                  <span class="badge badge-info">${nbFollowers}</span>
                                </a>
                              </td>
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
                      <div class="alert alert-status">
                        <div><b><fmt:message key="tatami.user.email"/> :</b> <a href="mailto:${user.login}">${user.login}</a></div>
                        <div><b><fmt:message key="tatami.user.jobTitle"/> :</b> ${user.jobTitle}</div>
                        <div><b><fmt:message key="tatami.user.phoneNumber"/> :</b> ${user.phoneNumber}</div>
                      </div>
				 	  <div class="alert alert-status">
                        <div class="row-fluid">
                            <ul class="nav nav-pills nav-stacked profilMenu">
                              <li><a href="#/status"><fmt:message key="tatami.badge.status"/></a></li>
                              <li><a href="#/followed"><fmt:message key="tatami.badge.followed"/></a></li>
                              <li><a href="#/followers"><fmt:message key="tatami.badge.followers"/></a></li>
                            </ul>
                        </div>
                      </div> 
                      <div class="alert alert-status">
                        <div id="div-update"></div>
                      </div>
                        <!-- Trends -->
                        <div id="userTrends" class="alert alert-status hidden-phone">
                            <div>
                                <label><i class="icon-fire"></i> <fmt:message key="tatami.trends.user.title"/></label>
                            </div>
                            <div class="row-fluid">
                                <div id="trends">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="span8">
                      <div id="tab-content"></div>
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

<sec:authentication property="principal.username" var="currentUserLogin"/>
<script type="text/javascript">
    var login = "<sec:authentication property="principal.username"/>";
    var test = "${user.login}";
    var username = "${user.username}";
    var authenticatedUsername = "${authenticatedUsername}";
    var page = "profile";
    var followed = ${followed};
    var owner = ${user.login eq currentUserLogin};

    var text_characters_left="<fmt:message key="tatami.status.characters.left"/>";
</script>

<c:if test="${wro4jEnabled eq false}">
    <script src="/js/tatami-profile.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static/${version}/tatami-profile.js"></script>
</c:if>

</body>
</html>