<script type="text/template" id="search-tags">
    <li class="item tags" data-value="<@= tag.label @>">
        <a href="#"><@= tag.label @></a>
    </li>
</script>

<script type="text/template" id="search-users">
    <li class="item users" data-value="<@= user.label @>">
        <img src="/img/default_image_profile.png" width="30px" height="30px">
        <h4><a href="#"><@= user.fullName @></a></h4>
        <p><@= user.label @></p>
    </li>
</script>

<script type="text/template" id="search-groups">
    <li class="item groups" data-value="<@= group.label @>" rel="<@= group.id @>">
        <img src="/img/default_image_profile.png" width="30px" height="30px">
        <h4><a href="#"><@= group.label @></a></h4>
        <p><@= group.nb @> <fmt:message key="tatami.group.counter"/></p>
    </li>
</script>

<script type="text/template" id="search-category">
    <li class="category <@= current @>"><@= category @></li>
</script>
