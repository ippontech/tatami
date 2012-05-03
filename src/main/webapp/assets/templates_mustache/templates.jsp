
<script id='template_tweets' type='text/template'>
<tr	tweetId='{{tweetId}}'
	class='tweet id-{{tweetId}}'
	onmouseover='showActions("{{tweetId}}")'
	onmouseout='hideActions("{{tweetId}}")'>

	<!-- avatar -->
	<td class='avatar'>
		{{&userlineLink}}
		<img src='http://www.gravatar.com/avatar/{{gravatar}}?s=32' />
	{{#userlineLink}}</a>{{/userlineLink}}
	{{^userlineLink}}</td>{{/userlineLink}}

	<!-- tweet content -->
	<td>
		<article>
			{{&userlineLink}}
			{{firstName}}&nbsp;{{lastName}}
			{{#userlineLink}}</a>{{/userlineLink}}&nbsp;<em>@{{userLogin}}</em><br/>
			{{content}}
		</article>
	</td>

	<!-- actions -->
	<td class='tweetActions'>
		<div class='hide {{tweetId}}-actions'>
			<a id='{{tweetId}}-favorite' href='#' title='Favorite'></a>
			{{#isUserLogin}}
				<a href='#' onclick='removeTweet("{{tweetId}}")' title='Remove'>
					<i class='icon-remove' />
				</a>
			{{/isUserLogin}}
		</div>
	</td>

	<!-- tweet date -->
	<td class='tweetDate'>
		<aside>
			{{prettyPrintTweetDate}}
		</aside>
	</td>
</tr>
</script>