<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="tags-followed-template">

</script>

<script type="text/template" id="tags-followed-template-item">
<div class="<@= tags.name @>">
	<span class="label label-success pull-left tags-followed"><a href="/tatami/#/tags/<@= tags.name @>"><@= tags.name @></a>&nbsp;<i class="icon-remove"></i></span>
</div>
</script>

<script type="text/template" id="popular-tags-template">

</script>

<script type="text/template" id="popular-tags-template-item">
<div class="<@= tags.name @>">
	<span class="label label-success pull-left tags-followed"><a href="/tatami/#/tags/<@= tags.name @>"><@= tags.name @></a></span>
</div>
</script>

<script type="text/template" id="tags-directory-template">
  		<p class="tags-cloud">#<@= tags.tag @>&nbsp;<span class="label label-success">Follow</span></p>
</script>

<script type="text/template" id="own-groups-template">

</script>

<script type="text/template" id="own-groups-template-item">
<td>
	<@= groups.name @>
</td>
<td>
	<@ if (groups.publicGroup) { @>
<span class="label label-warning"><fmt:message key="tatami.group.add.public"/></span>
	<@ } else { @> 
<span class="label label-info"><fmt:message key="tatami.group.add.private"/></span>
	<@ } @>
</td>
<td>
	<@= groups.counter @>
</td>
<td>
	<@ if (groups == group) { @>
	<button type="submit" class="btn-small btn-info" onclick="window.location = 'groups/edit?groupId=<@= groups.groupId @>'"> 
		<fmt:message key="tatami.group.edit.link"/>
	</button>
	<@ } else { @> 
	<button type="submit" class="btn-small btn-info">
		<fmt:message key="tatami.group.edit.quit"/>
	</button>
	<@ } @>
</td>
</script>