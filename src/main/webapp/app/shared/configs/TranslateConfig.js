TatamiApp.config(function($translateProvider) {
  
    $translateProvider.translations('en', {
        'tatami': {
            'search': 'Search',
            'account': {
                'update': {
                    'title': 'User profile',
                    'legend': 'Update your profile'
                },
                'login': 'E-mail',
                'tags': {
                    'myTags': 'My tags'
                }
            },
            'group': {
                'add': 'Create a new group',
                'title': 'Name of the group',
                'description': 'Description',
                'access': 'Access',
                'public': 'Public',
                'private': 'Private',
                'warnPublic': 'Warning! If this group is public, everybody can access it',
                'name': 'Group',
                'counter': 'Members',
                'manage': 'Manage'
            },
            'password': 'Password',
            'user': {
                'password': {
                    'legend': 'Update your password',
                    'old': 'Old password',
                    'new': 'New password',
                    'confirm': 'New password confirmation'
                },
                'firstName': 'First name',
                'lastName': 'Last name',
                'jobTitle': 'Job title',
                'phoneNumber': 'Phone number',
                'confirmDelete': 'You are about to delete your account. Are you sure?',
                'delete': 'Delete the current user account',
                'follow': 'Follow',
                'followed': 'Followed'
            },
            'preferences': {
                'notification': {
                    'email': {
                        'mention': 'Get notified by e-mail when you are mentioned',
                        'dailyDigest': 'Get a daily digest e-mail',
                        'weeklyDigest': 'Get a weekly digest e-mail'
                    },
                    'rss': {
                        'timeline': 'Allow RSS feed publication of your timeline',
                        'link': 'Link to your timeline RSS stream'
                    }
                },
                'notifications': 'Notifications'
            },
            'timeline': 'Timeline',
            
            'home': {    
                'mentions': 'Mentions',
                'favorites': 'Favorites'
            },
            'tatam': {
                'mandatory': 'Comment is mandatory',
                'content': {
                    'mandatory': 'Please fill out this field.'
                }
            },

            'status': {
                'replyto': 'In reply to',
                'private': 'Private Message',
                'view': 'View',
                'reply': 'Reply',
                'delete': 'Delete',
                'share': 'Share',
                'favorite': 'Favorite',
                'update': 'Update your status',
                'drop': {
                    'file': 'Drop your files here'
                },
                'geoLocalization': 'Geolocalization',
                'options': 'Options',
                'statusReply': 'Reply to this status',
                'characters': {
                    'left': 'Characters left:'
                },
                'preview': 'Preview',
                'editor': 'Edit',
                'markdown': 'Markdown Supported'
            },

            'menu': {
                'groups': 'Group',
                'preferences': 'Preferences',
                'logo': 'Ippon Technologies Logo',
                'title': 'Tatami',
                'about': {
                    'about': 'About',
                    'presentation': 'Presentation',
                    'tos': 'Terms of Service',
                    'language': {
                        'language': 'Language',
                        'en': 'English',
                        'fr': 'Français' // Change to French?
                    },
                    'license': 'Software License',
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
                    'account': 'Account',
                    'profile': 'Profile',
                    'preferences': 'Preferences',
                    'password': 'Password',
                    'files': 'Files',
                    'users': 'Users',
                    'groups': 'Groups',
                    'tags': 'Tags',
                    'sotd': 'Statuses of the Day',
                    'companywall': 'Company Wall',
                    'logout': 'Logout'
                },
                'post': 'Post',
                'files': 'Files'
            },
            'form': {
                'cancel': 'Cancel',
                'post': 'Post',
                'save': 'Save'
            },
            'trends': {
                'title': 'Trends'
            }
        }
    });

    $translateProvider.translations('fr', {

    });

    $translateProvider.preferredLanguage('en');
});