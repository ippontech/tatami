function bindListeners($target)
{
	$target.find('a[data-follow]').click(function(e)
	{
		var target = $(e.currentTarget).attr('data-follow');
		followUser(target);
		return false;
	});
	
	$target.find('a[data-unfollow]').click(function(e)
	{
		var target = $(e.currentTarget).attr('data-unfollow');
		removeFriend(target);
		return false;
	});
	
	$target.find('a[data-like]').click(function(e)
	{
		var target = $(e.currentTarget).attr('data-like');
		addFavoriteTweet(target);
		return false;
	});

	$target.find('a[data-unlike]').click(function(e)
	{
		var target = $(e.currentTarget).attr('data-unlike');
		removeFavoriteTweet(target);
		return false;
	});

	$target.find('a[data-user],span[data-user]').click(function(e)
	{
		var target = $(e.currentTarget).attr('data-user');
		loadUserline(target);
		return false;
	});
	
	$target.find('a[data-tag]').click(function(e)
	{
		var target = $(e.currentTarget).attr('data-tag');
		loadTagsline(target);
		return false;
	});

	$target.find('[data-modal-hide]').click(function(e)
	{
		var modal = $(e.currentTarget).attr('data-modal-hide');
		if(modal!= null)
		{
			$(''+modal).modal('hide');
		}
		
	});
	
	//Bind click on gravatar to display user profile modal
	$target.find('img.tweetGravatar[data-user],#picture').click(function(e)
	{
		//First hide popover
		if($(e.currentTarget).data('popover') != null)
		{
			$(e.currentTarget).popover('hide');	
		}
		var modal = $(e.currentTarget).attr('data-modal-highlight');
		var login = $(e.currentTarget).attr('data-user');
		showUserProfile(login);
		if(modal!= null)
		{
			$(modal).css('z-index',5000);
		}
		return false;
	});


}

function sessionTimeOutPopup()
{
	$('#sessionTimeOutModal').modal('show');
	$('#sessionTimeOutModal').css('z-index',6000);
}

function errorHandler($targetErrorPanel)
{
	return function(jqXHR, textStatus, errorThrown)
	{
		$targetErrorPanel.find('.errorMessage').empty().html(jqXHR.responseText).end().show();
	};
}


function registerRefreshLineListeners($target)
{
	$target.find('.refreshLineIcon').click(refreshCurrentLine);
}

function registerFetchTweetHandlers($target)
{
	$target.find('.tweetPagingButton').click(function(event)
	{
		var tweetsNb = $(event.target).closest('footer').find('.pageSelector option').filter(':selected').val(); 
		var currentTweetsNb = $(event.target).closest('footer').closest('div').find('.lineContent tr.data').size();
		var targetLine =  $(event.target).closest('div.tab-pane.active').attr('id');
		
		refreshLine(targetLine,currentTweetsNb+1,parseInt(currentTweetsNb)+parseInt(tweetsNb),false);
				
		return false;
	});
}

function fillTweetTemplate(tweet,data_line_type)
{
	$newTweetLine = $('#tweetTemplate').clone().attr('id','');
	
	$newTweetLine.find('.tweetGravatar').attr('data-user',tweet.login).attr('src','http://www.gravatar.com/avatar/'+tweet.gravatar+'?s=32');
	
	if(data_line_type != 'userline')
	{
		if(login != tweet.login)
		{
			$newTweetLine.find('article strong').empty().html(tweet.firstName+' '+tweet.lastName+' &nbsp;')
			.after('<a class="tweetAuthor" href="#" data-user="'+tweet.login+'" title="Show '+tweet.login+' tweets"><em>@'+tweet.login+'</em></a><br/>');
		}
	}	
	else
	{
		$newTweetLine.find('article strong').empty().html(tweet.firstName+' '+tweet.lastName+'<br/>');
	}
	
	$newTweetLine.find('article span').html(tweet.content);
	
	// Conditional rendering of Follow icon
	if(data_line_type != 'timeline' && tweet.authorFollow)
	{	
		$newTweetLine.find('.tweetFriend').append('<a href="#" title="Follow" data-follow="'+tweet.login+'"><i class="frame icon-eye-open"></i></a>&nbsp;&nbsp;');
	}
	
	// Conditional rendering of unfollow icon
	if(tweet.authorForget)
	{
		$newTweetLine.find('.tweetFriend').append('<a href="#" title="Stop following" data-unfollow="'+tweet.login+'"><i class="frame icon-eye-close"></i></a>&nbsp;&nbsp;');
	}	
	
	// Conditional rendering for like icon
	if(data_line_type != 'favoriteline' && tweet.addToFavorite)
	{
		$newTweetLine.find('.tweetFriend').append('<a href="#" title="Like" data-like="'+tweet.tweetId+'"><i class="frame icon-star"></i></a>&nbsp;&nbsp;');
	}

	// Conditional rendering for unlike icon
	if(data_line_type == 'favoriteline' && !tweet.addToFavorite)
	{
		$newTweetLine.find('.tweetFriend').append('<a href="#" title="Stop liking" data-unlike="'+tweet.tweetId+'"><i class="frame icon-star-empty"></i></a>&nbsp;&nbsp;');
	}	
	
	
	$newTweetLine.find('.tweetDate aside').empty().html(tweet.prettyPrintTweetDate);

	bindListeners($newTweetLine);
	return $newTweetLine.find('tr');
}

function fillUserTemplate(user)
{
	$newUserLine = $('#fullUserTemplate').clone().attr('id','');
	
	$newUserLine
	.find('.tweetGravatar').attr('data-user',user.login).attr('src','http://www.gravatar.com/avatar/'+user.gravatar+'?s=32').attr('data-modal-highlight','#userProfileModal').end()
	.find('.userLink').attr('data-user',user.login).attr('title','Show '+user.login+' tweets').end()
	.find('em').html('@'+user.login).end()
	.find('.userDetailsName').html(user.firstName+' '+user.lastName).end()
	.find('.badge').html(user.tweetCount);
	
	if(user.follow)
	{
		$newUserLine.find('.tweetFriend a').attr('data-follow',user.login).attr('title','Follow '+user.login).end();
	}
	else
	{
		$newUserLine.find('.tweetFriend a').removeAttr('data-follow').attr('data-unfollow',user.login)
		.attr('title','Stop following '+user.login).find('i').removeClass().addClass('icon-eye-close');
	}	
	bindListeners($newUserLine);
	return $newUserLine;
	
}
