
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="nomargin well row avatar-float-left-container">
    <div class="col-span-5 text-center">
        <a href="/tatami/home/users/${user.username}/">
            <c:if test="${empty user.avatar}">
                <img class="pull-left nomargin avatar avatar-float-left" src="/img/default_image_profile.png" alt="">
            </c:if>
            <c:if test="${not empty user.avatar}">
                <img class="pull-left nomargin avatar avatar-float-left" src="/tatami/avatar/${user.avatar}/photo.jpg" alt="">
            </c:if>
            <h3 class="user-profile">${user.firstName} ${user.lastName}</h3>
            <p>@${user.username}</p>
        </a>
    </div>
</div>