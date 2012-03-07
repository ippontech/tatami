<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<html>
<head></head>
<body>
<h1>Welcome</h1>

<form action="login" method="post">

    <table>
			<tr>
				<td>Login :</td>
				<td><input type='text' name='j_username' value=''>
				</td>
			</tr>
			<tr>
				<td>Password :</td>
				<td><input type='password' name='j_password' />
				</td>
			</tr>
            <tr>
				<td>Remember for 30 days :</td>
				<td><input type='checkbox' name='_spring_security_remember_me' id="_spring_security_remember_me"
                               value="true" checked="true"/>
				</td>
			</tr>
			<tr>
				<td colspan='2'><input name="submit" type="submit"
					value="submit" />
				</td>
			</tr>
			<tr>
				<td colspan='2'><input name="reset" type="reset" />
				</td>
			</tr>
		</table>

</form>
</body>
</html>