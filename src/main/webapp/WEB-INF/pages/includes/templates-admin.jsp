<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<script type="text/template" id="tags-followed-template-item">
<div class="<@= elem.name @>">
	<span class="label label-success pull-left tags-followed"><a href="/tatami/#/tags/<@= elem.name @>"><@= elem.name @></a>&nbsp;<i class="icon-remove"></i></span>
</div>
</script>

<script type="text/template" id="popular-tags-template-item">
<div class="<@= elem.name @>">
	<span class="label label-success pull-left tags-followed"><a href="/tatami/#/tags/<@= elem.name @>"><@= elem.name @></a></span>
</div>
</script>

<script type="text/template" id="tags-directory-template">
  		<p class="tags-cloud">#<@= elem.name @>&nbsp;<span class="label label-success">Follow</span></p>
</script>

<script type="text/template" id="own-groups-template">
<thead>
	<tr>
	<th><fmt:message key="tatami.menu.groups"/></th>
	<th><fmt:message key="tatami.group.add.access"/></th>
	<th><fmt:message key="tatami.group.counter"/></th>
	</tr>
</thead>
</script>

<script type="text/template" id="own-groups-template-item">
<td>
	<@= elem.name @>
</td>
<td>
	<@ if (elem.publicGroup) { @>
        <span class="label label-warning"><fmt:message key="tatami.group.add.public"/></span>
	<@ } else { @> 
        <span class="label label-info"><fmt:message key="tatami.group.add.private"/></span>
	<@ } @>
</td>
<td>
	<@= elem.counter @>
</td>
<td>
	<@ if (elem.admin === true) { @>
	<button type="submit" class="btn-small btn-info" onclick="window.location = 'edit?groupId=<@= elem.groupId @>'">
		<fmt:message key="tatami.group.edit.link"/>
	</button>
	<@ } else { @> 
	<button type="submit" class="btn-small btn-info">
		<fmt:message key="tatami.group.edit.quit"/>
	</button>
	<@ } @>
</td>
</script>


<script type="text/template" id="global-users-template">
<thead>
<tr>
	<th><fmt:message key="tatami.username"/></th>
	<th class="hidden-phone"><fmt:message key="tatami.user.firstName"/></th>
	<th class="hidden-phone"><fmt:message key="tatami.user.lastName"/></th>
	<th><fmt:message key="tatami.badge.status"/></th>
	<th class="hidden-phone"><fmt:message key="tatami.badge.followed"/></th>
	<th><fmt:message key="tatami.badge.followers"/></th>
</tr>
</thead>
</script>

<script type="text/template" id="global-users-template-item">
	<td>
	<a href="/tatami/profile/<@= elem.username @>/" title="<fmt:message key="tatami.user.profile.show"/> 
	<@= elem.username @><@= elem.firstName @><@= elem.lastName @>">
	<img class="pull-left nomargin avatar avatar-small" src="https://www.gravatar.com/avatar/?s=64&d=mm" alt="<@= elem.firstName @><@= elem.lastName @>"/>
	<@= elem.username @>
	</a>
	</td>
	<td class="hidden-phone">
	<@= elem.firstName @>
	</td>
	<td class="hidden-phone">
	<@= elem.lastName @>
	</td>
	<td>
	<@= elem.statusCount @>
	</td>
	<td class="hidden-phone">
	<@= elem.friendsCount @>
	</td>
	<td>
	<@= elem.followersCount @>
	</td>
</script>

