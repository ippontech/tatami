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
		addFavoriteStatus(target);
		return false;
	});

	$target.find('a[data-unlike]').click(function(e)
	{
		var target = $(e.currentTarget).attr('data-unlike');
		removeFavoriteStatus(target);
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
	$target.find('img.statusGravatar[data-user],#picture').click(function(e)
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

function registerFetchStatusHandlers($target)
{
	$target.find('.statusPagingButton').click(function(event)
	{
		var statusNb = $(event.target).closest('footer').find('.pageSelector option').filter(':selected').val();
		var currentStatusNb = $(event.target).closest('footer').closest('div').find('.lineContent tr.data').size();
		var targetLine =  $(event.target).closest('div.tab-pane.active').attr('id');
		
		refreshLine(targetLine,currentStatusNb+1,parseInt(currentStatusNb)+parseInt(statusNb),false);
				
		return false;
	});
}

function fillStatusTemplate(status,data_line_type)
{
	$newStatusLine = $('#statusTemplate').clone().attr('id','');
	
	$newStatusLine.find('.statusGravatar').attr('data-user',status.login).attr('src','http://www.gravatar.com/avatar/'+status.gravatar+'?s=32');
	
	if(data_line_type != 'userline')
	{
		if(login != status.login)
		{
			$newStatusLine.find('article strong').empty().html(status.firstName+' '+status.lastName+' &nbsp;')
			.after('<a class="statusAuthor" href="#" data-user="'+status.login+'" title="Show '+status.login+' status"><em>@'+status.login+'</em></a><br/>');
		}
	}	
	else
	{
		$newStatusLine.find('article strong').empty().html(status.firstName+' '+status.lastName+'<br/>');
	}
	
	$newStatusLine.find('article span').html(status.content);
	
	// Conditional rendering of Follow icon
	if(data_line_type != 'timeline' && status.authorFollow)
	{	
		$newStatusLine.find('.statusFriend').append('<a href="#" title="Follow" data-follow="'+status.login+'"><i class="frame icon-eye-open"></i></a>&nbsp;&nbsp;');
	}
	
	// Conditional rendering of unfollow icon
	if(status.authorForget)
	{
		$newStatusLine.find('.statusFriend').append('<a href="#" title="Stop following" data-unfollow="'+status.login+'"><i class="frame icon-eye-close"></i></a>&nbsp;&nbsp;');
	}	
	
	// Conditional rendering for like icon
	if(data_line_type != 'favoriteline' && status.addToFavorite)
	{
		$newStatusLine.find('.statusFriend').append('<a href="#" title="Like" data-like="'+status.statusId+'"><i class="frame icon-star"></i></a>&nbsp;&nbsp;');
	}

	// Conditional rendering for unlike icon
	if(data_line_type == 'favoriteline' && !status.addToFavorite)
	{
		$newStatusLine.find('.statusFriend').append('<a href="#" title="Stop liking" data-unlike="'+status.statusId+'"><i class="frame icon-star-empty"></i></a>&nbsp;&nbsp;');
	}	
	
	
	$newStatusLine.find('.statusDate aside').empty().html(status.prettyPrintStatusDate);

	bindListeners($newStatusLine);
	return $newStatusLine.find('tr');
}

function fillUserTemplate(user)
{
	$newUserLine = $('#fullUserTemplate').clone().attr('id','');
	
	$newUserLine
	.find('.statusGravatar').attr('data-user',user.login).attr('src','http://www.gravatar.com/avatar/'+user.gravatar+'?s=32').attr('data-modal-highlight','#userProfileModal').end()
	.find('.userLink').attr('data-user',user.login).attr('title','Show '+user.login+' status').end()
	.find('em').html('@'+user.login).end()
	.find('.userDetailsName').html(user.firstName+' '+user.lastName).end()
	.find('.badge').html(user.statusCount);
	
	if(user.follow)
	{
		$newUserLine.find('.statusFriend a').attr('data-follow',user.login).attr('title','Follow '+user.login).end();
	}
	else
	{
		$newUserLine.find('.statusFriend a').removeAttr('data-follow').attr('data-unfollow',user.login)
		.attr('title','Stop following '+user.login).find('i').removeClass().addClass('icon-eye-close');
	}	
	bindListeners($newUserLine);
	return $newUserLine;
	
}
