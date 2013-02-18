<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="search-category">
<@ if(cat.category == 'tags') {@>
    <li class="category <@= cat.category @>"><i class="icon-tags"></i></li>
<@} else if(cat.category == 'users') { @>
    <li class="category <@= cat.category @>"><i class="icon-user"></i></li>
<@} else { @>
    <li class="category <@= cat.category @>"><i class="icon-th-large"></i></li>
<@}@>
</script>

<script type="text/template" id="search-category-item">
<@ if(item.category == 'tags') {@>
    <li class="item tags" data-value="<@= item.label @>">
        <a href="#"><@= item.label @></a>
    </li>
<@} else if(item.category == 'users') { @>
    <li class="item users" data-value="<@= item.label @>">
        <img class="avatar  avatar-small" src="https://www.gravatar.com/avatar/<@= item.gravatar @>?s=32&d=mm">
        <h4><a href="#"><@= item.fullName @></a></h4>
        <p><@= item.label @></p>
    </li>
<@} else { @>
    <li class="item groups" data-value="<@= item.label @>" rel="<@= item.id @>">
        <img src="/img/default_image_profile.png" width="30px" height="30px">
        <h4><a href="#"><@= item.label @></a></h4>
        <p><@= item.nb @> <fmt:message key="tatami.group.counter"/></p>
    </li>
<@}@>
</script>