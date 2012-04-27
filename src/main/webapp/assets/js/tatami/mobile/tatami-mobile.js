function registerUserSearchListener() {
	$("#userSearchForm button").click(
			function() {
				$("#searchErrorPanel").hide();
				$.ajax({
					type : HTTP_GET,
		            url: "/tatami/rest/users/search?q=" + $.trim($("#followUserInput").val()),
					contentType : "application/json;  charset=UTF-8",
					data : JSON.stringify({
						searchString : $.trim($("#followUserInput").val())
					}),
					dataType : JSON_DATA,
					success : function(a) {
						var b = $("#userSearchList");
						b.empty();
						if (a.length > 0) {
							$.each(a, function(a, c) {
								b.append(fillUserTemplate(c))
							})
						} else {
							$newUserLine = $("#emptyUserSearchTemplate")
									.clone().attr("id", "").appendTo(b)
						}
						$("#userSearchPanel").show()
					},
					error : errorHandler($("#searchErrorPanel"))
				});
				return false
			})
}
function updateUserProfileModal(a) {
	var b = $(window).width();
	var c = $(window).height();
	console.log("currentWidth = " + b);
	console.log("currentHeight = " + c);
	$("#userProfileModal").find("#userProfileLogin").html("@" + a.login).end()
			.find("#userProfileGravatar .tweetGravatar").attr("src",
					"http://www.gravatar.com/avatar/" + a.gravatar + "?s=64")
			.end().find("#userProfileName")
			.html(a.firstName + " " + a.lastName).end().find(
					"#userProfileLocation span:nth-child(2)").html(a.location)
			.end().find("#userProfileWebsite a").html(a.website).attr("href",
					a.website).end().find("#userProfileBio").html(a.biography)
			.end().find("#userProfileTweetsCount").html(a.tweetCount).end()
			.find("#userProfileFriendsCount").html(a.friendsCount).end().find(
					"#userProfileFollowersCount").html(a.followersCount);
	$("#userProfileFooter").unbind("click");
	bindListeners($("#userProfileFooter"))
}
function showUserProfile(a) {
	$.ajax({
		type : HTTP_GET,
		url: "/tatami/rest/users/show?screen_name=" + a,
		dataType : JSON_DATA,
		success : function(a) {
			updateUserProfileModal(a);
			$("#userProfileModal").modal("show")
		}
	})
}
function tweet() {
	$("#tweetErrorPanel").hide();
	$.ajax({
		type : HTTP_POST,
		url : "/tatami/rest/statuses/update",
		async : false,
		contentType : "application/json;  charset=UTF-8",
		data : $.trim($("#tweetContent").val()),
		dataType : JSON_DATA,
		success : function(a) {
			setTimeout(function() {
				$("#tweetContent").slideUp().val("").slideDown("fast");
				updateUserCounters();
				refreshTimeline();
				refreshUserSuggestions()
			}, 300)
		},
		error : errorHandler($("#tweetErrorPanel"))
	});
	return false
}
function updateUserCounters() {
	$.ajax({
		type : HTTP_GET,
		url: "/tatami/rest/users/show?screen_name=" + login,
		dataType : JSON_DATA,
		success : function(a) {
			$("#tweetCount").text(a.tweetCount);
			$("#friendsCount").text(a.friendsCount);
			$("#followersCount").text(a.followersCount)
		}
	})
}
function loadProfile() {
	$("#profilePanel").empty();
	$("#profilePanel").load(
			"/assets/fragments/mobile/profile.html #profileContent",
			function() {
				$("#profilePanel").find('button[type="submit"]').click(
						updateProfile)
			})
}
function updateProfile() {
	$("#userProfileErrorPanel").hide();
	$.ajax({
		type : HTTP_POST,
		url : "/tatami/rest/account/update_profile",
		contentType : JSON_CONTENT,
		data : JSON.stringify($("#updateUserForm").serializeObject()),
		dataType : JSON_DATA,
		success : function(a) {
			$("#defaultTab").tab("show");
			setTimeout(function() {
				refreshHome();
				updateUserCounters()
			}, 300)
		},
		error : errorHandler($("#userProfileErrorPanel"))
	});
	return false
}
function refreshHome() {
	$.ajax({
		type : HTTP_GET,
		url: "/tatami/rest/users/show?screen_name=" + a,
		dataType : JSON_DATA,
		success : function(a) {
			$("#homePanel").find("#picture").attr("src",
					"http://www.gravatar.com/avatar/" + a.gravatar + "?s=64")
					.end().find("#firstName").html(a.firstName).end().find(
							"#latName").html(a.lastName).end().find(
							"#tweetCount").html(a.tweetCount).end().find(
							"#friendsCount").html(a.friendsCount).end().find(
							"#followersCount").html(a.followersCount).end();
			bindListeners($("#homePanel"))
		}
	})
}
function loadTagsline(a) {
	if (a != null) {
		$("#tagTweetsList").empty();
		clickFromLink = true;
		$("#taglineTab").tab("show");
		jQuery.ajaxSetup({
			async : false
		});
		refreshLine("taglinePanel", 1, DEFAULT_TAG_LIST_SIZE, true, null, a);
		clickFromLink = false;
		jQuery.ajaxSetup({
			async : true
		})
	}
}
function loadUserline(a) {
	if (a != null) {
		$("#userTweetsList").empty();
		clickFromLink = true;
		$("#userlineTab").tab("show");
		jQuery.ajaxSetup({
			async : false
		});
		refreshLine("userlinePanel", 1, DEFAULT_TWEET_LIST_SIZE, true, a, null);
		clickFromLink = false;
		jQuery.ajaxSetup({
			async : true
		})
	}
}
function removeFavoriteTweet(a) {
    if (true) {
    	alert('To be implemented');
    	return;
    }
	$.ajax({
		type : HTTP_GET,
		url : "rest/unlikeTweet/" + a,
		dataType : JSON_DATA,
		success : function() {
			setTimeout(function() {
				$("#favoriteTab").tab("show");
				refreshCurrentLine()
			}, 300)
		}
	});
	return false
}
function addFavoriteTweet(a) {
	$.ajax({
		type : HTTP_GET,
		url: "/tatami/rest/favorites/create/" + a,
		dataType : JSON_DATA,
		success : function() {
			setTimeout(function() {
				$("#favoriteTab").tab("show");
				refreshCurrentLine()
			}, 300)
		}
	});
	return false
}
function refreshLine(a, b, c, d, e, f) {
	var g = $("#" + a + " footer").attr("data-rest-url");
	var h = $("#" + a + " footer").attr("data-line-type");
	var i = $("#" + a + " .lineContent");
	if (h == "timeline") {
		g = g.replace(START_TWEET_INDEX_REGEXP, b).replace(
				END_TWEET_INDEX_REGEXP, c)
	} else if (h == "favoriteline") {
		g = g.replace(START_TWEET_INDEX_REGEXP, b).replace(
				END_TWEET_INDEX_REGEXP, c)
	} else if (h == "userline") {
		var j = "";
		if (e != null) {
			j = e
		} else {
			j = $("#" + a).closest("div.tab-pane").find(".lineContent").find(
					"tr.data").filter(":last").find("img[data-user]").attr(
					"data-user")
		}
		g = g.replace(START_TWEET_INDEX_REGEXP, b).replace(
				END_TWEET_INDEX_REGEXP, c).replace(USER_LOGIN_REGEXP, j)
	} else if (h == "tagline") {
		var k = "";
		if (f != null) {
			k = f
		} else {
			k = $("#" + a).closest("div.tab-pane").find(".lineContent").find(
					"tr.data").filter(":last").find("a[data-tag]").attr(
					"data-tag")
		}
		g = g.replace(START_TWEET_INDEX_REGEXP, b).replace(
				END_TWEET_INDEX_REGEXP, c).replace(TAG_REGEXP, k)
	}
	$.ajax({
		type : HTTP_GET,
		url : g,
		dataType : JSON_DATA,
		success : function(a) {
			if (a.length > 0) {
				if (d) {
					i.empty();
					$("#tweetPaddingTemplate tr").clone().appendTo(i);
					$("#tweetPaddingTemplate tr").clone().appendTo(i)
				} else {
					i.find("tr:last-child").remove()
				}
				$.each(a, function(a, b) {
					i.append(fillTweetTemplate(b, h))
				});
				$("#tweetPaddingTemplate tr").clone().css("display", "")
						.appendTo(i)
			} else if (d) {
				i.empty()
			}
		}
	})
}
function refreshCurrentLine() {
	var a = $("#dataContentPanel div.tab-pane.active tbody tr.data").size();
	var b = $("#dataContentPanel div.tab-pane.active").attr("id");
	refreshLine(b, 1, a, true, null, null);
	return false
}
function refreshTimeline() {
	$("#timelineTab").tab("show");
	refreshCurrentLine()
}
function loadEmptyLines() {
	$("#timelinePanel").load("/assets/fragments/mobile/timeline.html #timeline",
			function() {
				initTimeline();
				bindListeners($("#tweetsList"));
				registerRefreshLineListeners($("#timelinePanel"));
				registerFetchTweetHandlers($("#timelinePanel"))
			});
	$("#favlinePanel").load("/assets/fragments/mobile/favline.html #favline",
			function() {
				initFavoritesline();
				bindListeners($("#favTweetsList"));
				registerRefreshLineListeners($("#favlinePanel"));
				registerFetchTweetHandlers($("#favlinePanel"))
			});
	$("#userlinePanel").load("/assets/fragments/mobile/userline.html #userline",
			function() {
				registerRefreshLineListeners($("#userlinePanel"));
				registerFetchTweetHandlers($("#userlinePanel"))
			});
	$("#taglinePanel").load("/assets/fragments/mobile/tagline.html #tagline",
			function() {
				registerRefreshLineListeners($("#taglinePanel"));
				registerFetchTweetHandlers($("#taglinePanel"))
			})
}
function initFavoritesline() {
	refreshLine("favlinePanel", 1, DEFAULT_TAG_LIST_SIZE, true, null, null)
}
function initTimeline() {
	refreshLine("timelinePanel", 1, DEFAULT_TWEET_LIST_SIZE, true, null, null)
}
function removeFriend(a) {
	$("#followErrorPanel").hide();
	$.ajax({
		type : HTTP_POST,
		url: "/tatami/rest/friendships/destroy",
		contentType : "application/json;  charset=UTF-8",
        data: '{"login":"' + a + '"}',
		dataType : JSON_DATA,
		success : function(a) {
			setTimeout(function() {
				updateUserCounters();
				refreshUserSuggestions()
			}, 300)
		},
		error : errorHandler($("#followErrorPanel"))
	})
}
function followUser(a) {
	$("#followErrorPanel").hide();
	$.ajax({
		type : HTTP_POST,
		url: "/tatami/rest/friendships/create",
		contentType : JSON_CONTENT,
		data: '{"login":"' + a + '"}',
		dataType : JSON_DATA,
		success : function(a) {
			setTimeout(function() {
				$("#followUserInput").val("");
				updateUserCounters();
				refreshUserSuggestions()
			}, 300)
		},
		error : errorHandler($("#followErrorPanel"))
	});
	return false
}
function refreshUserSuggestions() {
	$.ajax({
		type : HTTP_GET,
		url: "/tatami/rest/users/suggestions",
		dataType : JSON_DATA,
		success : function(a) {
			var b = $("#userSuggestions");
			b.empty();
			if (a.length > 0) {
				$.each(a, function(a, c) {
					b.append(fillUserTemplate(c))
				})
			} else {
				$newUserLine = $("#emptyUserTemplate").clone().attr("id", "")
						.appendTo(b)
			}
		}
	})
}
function loadWhoToFollow() {
	$("#followPanel").empty();
	$("#followPanel").load("/assets/fragments/mobile/suggestions.html #followline",
			function() {
				refreshUserSuggestions();
				registerUserSearchListener()
			})
}
function fillUserTemplate(a) {
	$newUserLine = $("#fullUserTemplate").clone().attr("id", "");
	$newUserLine.find(".tweetGravatar").attr("data-user", a.login).attr("src",
			"http://www.gravatar.com/avatar/" + a.gravatar + "?s=32").attr(
			"data-modal-highlight", "#userProfileModal").end()
			.find(".userLink").attr("data-user", a.login).attr("title",
					"Show " + a.login + " tweets").end().find("em").html(
					"@" + a.login).end().find(".userDetailsName").html(
					a.firstName + " " + a.lastName).end().find(".badge").html(
					a.tweetCount);
	if (a.follow) {
		$newUserLine.find(".tweetFriend a").attr("data-follow", a.login).attr(
				"title", "Follow " + a.login).end()
	} else {
		$newUserLine.find(".tweetFriend a").removeAttr("data-follow").attr(
				"data-unfollow", a.login).attr("title",
				"Stop following " + a.login).find("i").removeClass().addClass(
				"icon-eye-close")
	}
	bindListeners($newUserLine);
	return $newUserLine
}
function fillTweetTemplate(a, b) {
	$newTweetLine = $("#tweetTemplate").clone().attr("id", "");
	$newTweetLine.find(".tweetGravatar").attr("data-user", a.login).attr("src",
			"http://www.gravatar.com/avatar/" + a.gravatar + "?s=32");
	if (b != "userline") {
		if (login != a.login) {
			$newTweetLine.find("article strong").empty().html(
					a.firstName + " " + a.lastName + "  ").after(
					'<a class="tweetAuthor" href="#" data-user="' + a.login
							+ '" title="Show ' + a.login + ' tweets"><em>@'
							+ a.login + "</em></a><br/>")
		}
	} else {
		$newTweetLine.find("article strong").empty().html(
				a.firstName + " " + a.lastName + "<br/>")
	}
	$newTweetLine.find("article span").html(a.content);
	if (b != "timeline" && a.authorFollow) {
		$newTweetLine.find(".tweetFriend").append(
				'<a href="#" title="Follow" data-follow="' + a.login
						+ '"><i class="frame icon-eye-open"></i></a>  ')
	}
	if (a.authorForget) {
		$newTweetLine.find(".tweetFriend").append(
				'<a href="#" title="Stop following" data-unfollow="' + a.login
						+ '"><i class="frame icon-eye-close"></i></a>  ')
	}
	if (b != "favoriteline" && a.addToFavorite) {
		$newTweetLine.find(".tweetFriend").append(
				'<a href="#" title="Like" data-like="' + a.tweetId
						+ '"><i class="frame icon-star"></i></a>  ')
	}
	if (b == "favoriteline" && !a.addToFavorite) {
		$newTweetLine.find(".tweetFriend").append(
				'<a href="#" title="Stop liking" data-unlike="' + a.tweetId
						+ '"><i class="frame icon-star-empty"></i></a>  ')
	}
	$newTweetLine.find(".tweetDate aside").empty().html(a.prettyPrintTweetDate);
	bindListeners($newTweetLine);
	return $newTweetLine.find("tr")
}
function registerFetchTweetHandlers(a) {
	a.find(".tweetPagingButton").click(
			function(a) {
				var b = $(a.target).closest("footer").find(
						".pageSelector option").filter(":selected").val();
				var c = $(a.target).closest("footer").closest("div").find(
						".lineContent tr.data").size();
				var d = $(a.target).closest("div.tab-pane.active").attr("id");
				refreshLine(d, c + 1, parseInt(c) + parseInt(b), true);
				return false
			})
}
function registerRefreshLineListeners(a) {
	a.find(".refreshLineIcon").click(refreshCurrentLine)
}
function errorHandler(a) {
	return function(b, c, d) {
		a.find(".errorMessage").empty().html(b.responseText).end().show()
	}
}
function sessionTimeOutPopup() {
	$("#sessionTimeOutModal").modal("show");
	$("#sessionTimeOutModal").css("z-index", 6e3)
}
function bindListeners(a) {
	a.find("a[data-follow]").click(function(a) {
		var b = $(a.currentTarget).attr("data-follow");
		followUser(b);
		return false
	});
	a.find("a[data-unfollow]").click(function(a) {
		var b = $(a.currentTarget).attr("data-unfollow");
		removeFriend(b);
		return false
	});
	a.find("a[data-like]").click(function(a) {
		var b = $(a.currentTarget).attr("data-like");
		addFavoriteTweet(b);
		return false
	});
	a.find("a[data-unlike]").click(function(a) {
		var b = $(a.currentTarget).attr("data-unlike");
		removeFavoriteTweet(b);
		return false
	});
	a.find("a[data-user],span[data-user]").click(function(a) {
		var b = $(a.currentTarget).attr("data-user");
		loadUserline(b);
		return false
	});
	a.find("a[data-tag]").click(function(a) {
		var b = $(a.currentTarget).attr("data-tag");
		loadTagsline(b);
		return false
	});
	a.find("[data-modal-hide]").click(function(a) {
		var b = $(a.currentTarget).attr("data-modal-hide");
		if (b != null) {
			$("" + b).modal("hide")
		}
	});
	a.find("img.tweetGravatar[data-user],#picture").click(function(a) {
		if ($(a.currentTarget).data("popover") != null) {
			$(a.currentTarget).popover("hide")
		}
		var b = $(a.currentTarget).attr("data-modal-highlight");
		var c = $(a.currentTarget).attr("data-user");
		showUserProfile(c);
		if (b != null) {
			$(b).css("z-index", 5e3)
		}
		return false
	})
}
var clickFromLink = false;
!function(a) {
	loadProfile();
	loadWhoToFollow();
	a('a[data-toggle="tab"]').on(
			"show",
			function(a) {
				if (a.target.hash == "#timelinePanel"
						|| a.target.hash == "#userlinePanel"
						|| a.target.hash == "#taglinePanel") {
					if (!clickFromLink) {
						setTimeout(refreshCurrentLine, 10)
					}
				}
			});
	a(function() {
		a.ajaxSetup({
			statusCode : {
				901 : sessionTimeOutPopup
			}
		});
		a("#tweetButton").click(tweet);
		loadEmptyLines();
		a("#picture").click(function() {
			var b = a("#picture").attr("data-user");
			showUserProfile(b);
			return false
		})
	})
}(window.jQuery);
$.fn.serializeObject = function() {
	var a = {};
	var b = this.serializeArray();
	$.each(b, function() {
		if (a[this.name] !== undefined) {
			if (!a[this.name].push) {
				a[this.name] = [ a[this.name] ]
			}
			a[this.name].push($.trim(this.value) || "")
		} else {
			a[this.name] = $.trim(this.value) || ""
		}
	});
	return a
}