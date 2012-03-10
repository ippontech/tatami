<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<html lang="en">
  <head>
	<meta charset="utf-8">
	<title>TaTaMi - profile</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="Ippon Technologies">

	<!-- Le styles -->
	<link href="/assets/css/bootstrap.css" rel="stylesheet">
	<style>
	  body {
		padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
	  }
	</style>
	<link href="/assets/css/bootstrap-responsive.css" rel="stylesheet">

	<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
	<!--[if lt IE 9]>
	  <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

	<!-- Le fav and touch icons -->
	<link rel="shortcut icon" href="../images/ippon.ico">
  </head>

  <body>

	<div class="navbar navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container">
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</a>
				<a class="brand" href="#">TaTaMi</a>
				<div class="nav-collapse">
					<ul class="nav">
						<li><a href="/tatami/"><i class="icon-home icon-white"></i> Home</a></li>
						<li class="active"><a href="#"><i class="icon-user icon-white"></i> Profile</a></li>
                        <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i> About</a></li>
					</ul>
					<ul class="nav pull-right">
						<li class="divider-vertical"></li>
						<li class="close"><a href="/tatami/logout"> logout &times;</a></li>
					</ul>
				</div><!--/.nav-collapse -->
			</div>
		</div>
	</div>

    <div class="alert alert-success">
        <h1>User profile update</h1>
    </div>
    <div class="container-fluid">
        <div class="row-fluid">
            <div class="span4" style="text-align: center;">Picture (from <a href="http://www.gravatar.com/">Gravatar</a>) <br/><br/><span
                    id="picture"></span></div>
            <div class="span4">
                <form id="updateUserForm" class="well">

                    <label>Email :</label> <input id="email" name="email" type="email"
                                                  placeholder="Enter e-mail..."/>
                    <fieldset>
                        <label>First name :</label> <input id="firstName" name="firstName" type="text"
                                                           placeholder="Enter first name..."/>
                        <label>Last name :</label> <input id="lastName" name="lastName" type="text"
                                                          placeholder="Enter last name..."/>
                    </fieldset>

                    <button onclick="updateProfile()" type="button" class="btn btn-primary">Update</button>
                </form>
            </div>
            <div class="span4"></div>
        </div>
    </div>


	<!-- Le javascript
	================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="/assets/js/jquery.js"></script>
	<script src="/assets/js/bootstrap-tab.js"></script>

	<script type="text/javascript">
        var login = "<sec:authentication property="principal.username"/>";

        $.fn.serializeObject = function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };

		function updateProfile() {
			$.ajax({
				type: 'POST',
				url: "rest/users/" + login,
				contentType: "application/json",
				data: JSON.stringify($("#updateUserForm").serializeObject()),
				dataType: "json",
                success: displayProfile()
			});
		}

        function displayProfile() {
			$.ajax({
				type: 'GET',
				url: "rest/users/" + login,
				dataType: "json",
				success: function(data) {
                    $("#picture").replaceWith('<img src="http://www.gravatar.com/avatar/' + data.gravatar + '?s=150"/>');
					$("#email").val(data.email);
					$("#firstName").val(data.firstName);
					$("#lastName").val(data.lastName);
				}
			});
		}

		$(document).ready(function() {
		    displayProfile();
		});
	</script>
  </body>
</html>
