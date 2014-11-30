TatamiApp.config(function($translateProvider) {
  
    $translateProvider.translations('en', {
        'tatami': {

            //Top Menu Text
            'menu': {
                'logo': 'Ippon Technologies Logo',
                'title': 'Tatami',
                'about': {
                    'title': 'About',
                    'tos': 'Terms of Service',
                    'language': {
                        'language': 'Language',
                        'en': 'English',
                        'fr': 'Français'
                    },
                    'license': 'Source Code License',
                    'github': {
                        'issues': 'Submit a Bug Report',
                        'fork': 'Fork Tatami on Github'
                    },
                    'ippon': {
                        'website': 'Ippon Technologies Website',
                        'blog': 'Ippon Technologies Blog',
                        'twitter': 'Follow @ippontech on Twitter'
                    }
                },
                'search': 'Search',
                'help': 'Help',
                'account': {
                    'title': 'Account',
                    'companyWall': 'Company Wall',
                    'logout': 'Logout'
                }
            },
            'post': {
                'mandatory': 'Comment is mandatory',
                'content': {
                    'mandatory': 'Please fill out this field.'
                },
                'update': 'Update your status',
                'preview': 'Preview',
                'edit': 'Edit',
                'characters': {
                    'left': 'Characters left:'
                },
                'geoLocalization': 'Geolocalization',
                'options': 'Options',
                'reply': 'Reply to this status',
                'drop': {
                    'file': 'Drop your files here'
                },
                'markdown': 'Markdown Supported',
                'button': 'Post'
            },
            'home': {
                'timeline': 'Timeline',
                'mentions': 'Mentions',
                'favorites': 'Favorites'
            },
            'status': {
                'replyto': 'In reply to',
                'private': 'Private Message',
                'view': 'View',
                'reply': 'Reply',
                'share': 'Share',
                'favorite': 'Favorite',
                'delete': 'Delete'
            },

            'presentation': {
                'title': 'Presentation'
            },

            //Account Text
            'profile': {
                'title': 'Profile',
                'dropPhoto': 'Drop your photo here to update it',
                'update': 'Update your profile',
                'email': 'Email',
                'firstName': 'First Name',
                'lastName': 'Last Name',
                'jobTitle': 'Job Title',
                'phoneNumber': 'Phone Number',
                'delete': 'Delete the current user account',
                'confirmDelete': 'You are about to delete your account. Are you sure?'
            },
            'preferences': {
                'title': 'Preferences',
                'notifications': 'Notifications',
                'notification': {
                    'email': {
                        'mention': 'Get notified by e-mail when you are mentioned',
                        'dailyDigest': 'Get a daily digest e-mail',
                        'weeklyDigest': 'Get a weekly digest e-mail'
                    },
                    'rss': {
                        'timeline': 'Allow RSS feed publication of your timeline'
                    }
                }
            },
            'password': {
                'title': 'Password',
                'update': 'Update your password',
                'old': 'Old Password',
                'new': 'New Password',
                'confirm': 'Confirm New Password'
            },
            'files': {
                'title': 'Files',
                'filename': 'Filename',
                'size': 'Size',
                'date': 'Date',
                'delete': 'Delete'
            },
            'users': {
                'title': 'Users',
                'myFriends': 'My Friends',
                'recommend': 'Recommended',
                'search': 'Search'
            },
            'groups': {
                'title': 'Groups',
                'create': 'Create a new group',
                'name': 'Name',
                'description': 'Description',
                'public': 'Public',
                'private': 'Private',
                'publicWarning': 'Warning! If this group is public, everybody can access it',
                'myGroups': 'My Groups',
                'recommended': 'Recommended',
                'search': 'Search',
                'group': 'Group',
                'access': 'Access',
                'members': 'Members',
                'manage': 'Manage',
                'updateDetails': 'Update group details',
                'archive': 'Do you want to archive this group?',
                'yes': 'Yes, this group should be archived',
                'no': 'No, this group is still in use',
                'archivedInfo': 'Archived groups are read-only',
                'addMember': 'Add a member',
                'username': 'Username',
                'role': 'Role'
            },
            'tags': {
                'title': 'Tags',
                'myTags': 'My Tags',
                'trends': 'Trends',
                'search': 'Search',
                'tag': 'Tag',
                'follow': 'Follow',
                'followed': 'Followed'
            },
            'sotd': {
                'title': 'Status of the Day'
            },


            'form': {
                'cancel': 'Cancel',
                'save': 'Save'
            }
        }
    });

    $translateProvider.translations('fr', {

    });

    $translateProvider.preferredLanguage('en');
});