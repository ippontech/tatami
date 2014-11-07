TatamiApp.config(function($translateProvider) {
  
    $translateProvider.translations('en', {
        'tatami': {
            'timeline': 'Timeline',
            
            'home': {    
                'mentions': 'Mentions',
                'favorites': 'Favorites'
            },

            'status': {
                'replyto': 'In reply to',
                'private': 'Private Message',
                'view': 'View',
                'reply': 'Reply',
                'delete': 'Delete',
                'share': 'Share',
                'favorite': 'Favorite'
            },

            'menu': {
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
                'post': 'Post'
            }
        }
    });

    $translateProvider.translations('fr', {

    });

    $translateProvider.preferredLanguage('en');
});