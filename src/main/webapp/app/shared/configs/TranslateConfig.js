TatamiApp.config(function($translateProvider) {
  
    $translateProvider.translations('en', {
        'tatami': {
            'welcome': {
                'title': 'Welcome to Tatami',
                'message': 'Your timeline is empty! Do you need help to learn how to use Tatami? Please click on the button below to launch a presentation.',
                'presentation': 'Launch presentation',
                'help': {
                    'title': 'Help',
                    'line1': 'Welcome to the online help!',
                    'line2':' Follow the next steps for a tour of the main Tatami features.'
                },
                'timeline': {
                    'title': 'Timeline',
                    'line1': 'This is your timeline. It displays all messages',
                    'bulletPoint1': 'mentioning you or sent privately to you',
                    'bulletPoint2': 'sent by users you follow',
                    'bulletPoint3': 'sent by yourself',
                    'bulletPoint4': 'sent to group you are subscribed to',
                    'afterBP1': 'If it\'s empty, don\'t worry, it will get updated as soon as you start following other users!',
                    'afterBP2': 'When viewing a message, you can reply to it and mark it as favorite to find it easily later.',
                    'afterBP3': 'If a message had already got some replies, you can see them all by clicking on details: this makes it easier to follow conversation on Tatami.'
                },
                'post': {
                    'title': 'Sending Message',
                    'line1': 'Here is where you write messages you want to share',
                    'bulletPoint1': 'all messages are public by default. They will be delivered to all users who follow you',
                    'bulletPoint2': 'when writing a message you should use #hashtags: this simply means adding a \'#\' at the beginning of important words that can be used to find your message',
                    'bulletPoint3': 'when mentioning, or replying to, other users, you should add a @ at the beginning of their name : they will be notified that you are talking to them'
                },
                'groups': {
                    'title': 'Groups',
                    'line1': 'This is the list of groups you are a member of.',
                    'line2': 'You can find, and subscribe to, public group in the Account/Groups page (top-right menu).',
                    'line3': 'There are also private groups : for these you cannot subscribe : the owner of the group must add you as a member.'
                },
                'trends': {
                    'title': 'Trends',
                    'line1': 'This list represents the #hashtag that are currently the most often used on Tatami. Use this to discover what\'s going on and what are the hottest topics on Tatami!'
                },
                'whoToFollow': {
                    'title': 'Suggested Users',
                    'line1': 'This is a list of users who share common interests with you and who you could follow.',
                    'line2': 'If you are a new user, this list is probably empty: Tatami needs some time to learn who you are in order to suggest you relevant users.',
                    'line3': 'And don\'t forget to use #hashtags in your messages, it makes everything easier!'
                },
                'next': 'Next',
                'previous': 'Prev',
                'end': 'End'
            },
            'error': 'An error has occurred.',
            'pageNotFound': 'Page not found.',
            // Login View
            'login': {
                'title': 'Login',
                'mainTitle': 'Welcome to Tatami',
                'subtitle': 'An open source enterprise social network',
                'moreInfo': 'More Info',
                'email': 'Email',
                'password': 'Password',
                'remember': 'Remember me',
                'forgotPassword': 'Forgot your password?',
                'resetPassword': 'Reset password',
                'tos': 'Terms of Service',
                'fail': 'Your authentication has failed! Are you sure you used the correct password?',
                'passwordEmailSent': 'An e-mail has been sent to you, with instructions to generate a new password.',
                'unregisteredEmail': 'This e-mail address is not registered in Tatami.',
                'register': {
                    'title': 'Register',
                    'line1': 'A confirmation email will be sent to the address you provide.',
                    'line2': "Your email's domain will determine the company space you join. For example, users with an email@ippon.fr address will join Ippon's private space.",
                    'line3': "If you are the first employee of your company to join Tatami, your company's private space will be automatically created."
                },
                'googleApps': {
                    'title': 'Google Apps Login',
                    'line1': 'This feature is for Google Apps for Work users, who have their work domain name managed by Google Apps.',
                    'link': 'For more information on Google Apps for Work click here.',
                    'line2': 'Whether or not you already have a Tatami account, you can sign in with your Google Apps account.',
                    'line3': "Your email will be provided by Google and your email's domain name will be used to allow you to join your company's private space.",
                    'login': 'Login using Google Apps'
                },

                'validation': 'E-mail validation',
                'passwordSuccess': 'Your e-mail has been validated. Your password will be e-mailed to you.',
                'returnHome': 'Go to the home page',
                'registrationEmail': 'Thank you! A registration e-mail has been sent to you.'
            },



            'about': {

                // Presentation Page
                'presentation': {
                    'title': 'What is Tatami?',
                    'devices': 'Devices',
                    'openSource': 'Open Source',
                    'row1': {
                        'title': 'A private, enterprise social network',
                        'line1': 'Update your status to inform your co-workers',
                        'line2': "Subscribe to other employees' time lines",
                        'line3': 'Share important information to your followers',
                        'line4': 'Discuss and reply to your colleagues',
                        'line5': 'Put important information into favorites',
                        'line6': 'Search useful information with our integrated search engine',
                        'line7': 'Use hashtags to find related information',
                        'line8': "Go to your co-workers' profiles to see what they are working on",
                        'line9': 'English and French versions available, adding other languages is easy'
                    },
                    'row2': {
                        'title': 'Works on all devices!',
                        'line1': 'Dynamic web application (HTML5): nothing to install, except a modern browser!',
                        'line2': "Works on mobile devices, tablets, or standard computers: the application adapts itself automatically to your device's screen",
                        'line3': 'Stay connected with your enterprise wherever you are'
                    },
                    'row3': {
                        'title': "Easy installation and integration with your company's IT infrastructure",
                        'line1': 'Standard Java application',
                        'line2': 'Your data belongs to you, not to your SaaS vendor!',
                        'line3': 'Integrates with your LDAP directory',
                        'line4': 'Integrates with Google Apps',
                        'line5': 'Fully Open Source, with a business-friendly Apache 2.0 license',
                        'line6': 'Easy to extend or modify according to your needs',
                        'line7': 'High performance (based on Apache Cassandra), even on small hardware',
                        'line8': 'Join the project and submit patches on our Github page:'
                    },
                    'row4': {
                        'title': "Also available in SaaS mode, fully managed by Ippon Technologies",
                        'line1': "If you do not want to install Tatami in your company, it's easy to use directly",
                        'line2': 'Secured multi-enterprise mode: every company has its own private space',
                        'line3': '256 bits SSL encryption: all data transfers are fully secured'
                    },
                    'row5': {
                        'title': 'Need more information on our product?',
                        'line1': 'Our sales team is looking forward to hearing from you! Call us at +33 01 46 12 48 48 or email us at'
                    }
                },

                'tos': {
                    'title': 'Terms of Service'
                },

                // License Page
                'license': {
                    'title': 'Source Code License',
                    'copyright': 'Copyright'
                }
            },

            // Home View
            'home': {
                'timeline': 'Timeline',
                'mentions': 'Mentions',
                'favorites': 'Favorites',
                'companyTimeline': 'Company Timeline',

                //Top Menu
                'menu': {
                    'logo': 'Ippon Technologies Logo',
                    'title': 'Tatami',
                    'about': {
                        'title': 'About',
                        'presentation': 'Presentation',
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
                        'companyTimeline': 'Company Timeline',
                        'logout': 'Logout'
                    }
                },

                // Post Modal
                'post': {
                    'mandatory': 'Comment is mandatory',
                    'content': {
                        'mandatory': 'Please fill out this field.'
                    },
                    'update': 'Update your status',
                    'replyTo': 'Reply',
                    'preview': 'Preview',
                    'edit': 'Edit',
                    'characters': {
                        'left': 'Characters Left:'
                    },
                    'options': 'Options',
                    'shareLocation': 'Share Location',
                    'group': 'Group',
                    'reply': 'Reply to this status',
                    'files': 'Files',
                    'drop': {
                        'file': 'Drop your files here'
                    },
                    'markdown': 'Markdown Supported',
                    'button': 'Post'
                },

                // Home Sidebar View
                'sidebar': {
                    'myGroups': 'My Groups',
                    'whoToFollow': 'Who To Follow',
                    'trends': 'Trends',
                    'public': 'PUB',
                    'private': 'PVT',
                    'archived': 'ARC',
                    'administrator': 'A',
                    'publicToolTip': 'Public Group',
                    'privateToolTip': 'Private Group',
                    'archivedToolTip': 'Archived Group',
                    'administratorToolTip': 'You administer this group.'
                },

                // Status List item or User List item
                'status': {
                    'replyTo': 'In reply to',
                    'private': 'Private Message',
                    'reply': 'Reply',
                    'share': 'Share',
                    'favorite': 'Favorite',
                    'delete': 'Delete',
                    'confirmDelete': 'Are you sure you want to delete this status?',
                    'sharedYour': 'shared your status',
                    'followed': 'followed you',
                    'shared': 'shared',
                    'groupAdmin': 'Group Administrator',
                    'announce': 'Announce',
                    'isAnnounced': 'Announced by'
                },

                // Tag View
                'tag': {
                    'title': 'Tag',
                    'follow': 'Follow',
                    'following': 'Following',
                    'unfollow': 'Unfollow'
                },

                // Group View
                'group': {
                    'join': 'Join',
                    'joined': 'Joined',
                    'leave': 'Leave',
                    'manage': 'Manage',
                    'statuses': 'Statuses',
                    'members': 'Members',
                    'membersSingular': '1 Member',
                    'membersPlural': '{{ amount }} Members'
                },

                // Profile View
                'profile': {
                    'statuses': 'Statuses',
                    'following': 'Following',
                    'followers': 'Followers',
                    'follow': 'Follow',
                    'unfollow': 'Unfollow',
                    'followsYou': 'Follows You',

                    'youStatusesSingular': 'Your 1 status',
                    'youStatusesPlural': 'Your {{ amount }} statuses',
                    'youFollowingSingular': 'You follow 1 person',
                    'youFollowingPlural': 'You follow {{ amount }} people',
                    'youFollowersSingular': 'Your 1 follower',
                    'youFollowersPlural': 'Your {{ amount }} followers',

                    'userStatusesSingular': '@{{ username }} posted 1 status',
                    'userStatusesPlural': '@{{ username }} posted {{ amount }} statuses',
                    'userFollowingSingular': '@{{ username }} follows 1 person',
                    'userFollowingPlural': '@{{ username }} follows {{ amount }} people',
                    'userFollowersSingular': '@{{ username }} has 1 follower',
                    'userFollowersPlural': '@{{ username }} has {{ amount }} followers',

                    'deactivatedUser': 'Deactivated User',

                    // Profile Sidebar View
                    'sidebar': {
                        'information': 'Information',
                        'statistics': 'Statistics',
                        'firstName': 'First Name',
                        'lastName': 'Last Name',
                        'email': 'Email',
                        'jobTitle': 'Job Title',
                        'phoneNumber': 'Phone Number',
                        'statuses': 'Statuses',
                        'following': 'Following',
                        'followers': 'Followers',
                        'trends': 'Trends'
                    }
                }
            },
            
            //Account View
            'account': {

                // Profile Tab
                'profile': {
                    'title': 'Profile',
                    'dropPhoto': 'Drop your photo here to update it',
                    'update': 'Update your profile',
                    'email': 'Email',
                    'firstName': 'First Name',
                    'lastName': 'Last Name',
                    'jobTitle': 'Job Title',
                    'phoneNumber': 'Phone Number',
                    'delete': 'Delete your account',
                    'confirmDelete': 'You are about to delete your account. Are you sure?',
                    'save': 'Your profile has been saved'
                },

                // Preferences Tab
                'preferences': {
                    'title': 'Preferences',
                    'notifications': 'Notifications',
                    'notification': {
                        'email': {
                            'mention': 'Get notified by email when you are mentioned',
                            'dailyDigest': 'Get a daily digest email',
                            'weeklyDigest': 'Get a weekly digest email'
                        },
                        'rss': {
                            'timeline': 'Allow RSS feed publication of your timeline',
                            'link': 'Link to your timeline RSS stream'
                        }
                    },
                    'save': 'Your preferences have been saved'
                },

                // Password Tab
                'password': {
                    'title': 'Password',
                    'update': 'Update your password',
                    'old': 'Old Password',
                    'new': 'New Password',
                    'confirm': 'Confirm New Password',
                    'save': 'Your password has been changed'
                },

                // Files Tab
                'files': {
                    'title': 'Files',
                    'filename': 'Filename',
                    'size': 'Size',
                    'date': 'Date',
                    'delete': 'Delete'
                },

                // Users Tab
                'users': {
                    'title': 'Users',
                    'following': 'Following',
                    'recommended': 'Recommended',
                    'search': 'Search',
                    'deactivated': 'This user is deactivated'
                },

                // Groups Tab
                'groups': {
                    'title': 'Groups',
                    'createNewGroup': 'Create a new group',
                    'name': 'Name',
                    'description': 'Description',
                    'public': 'Public',
                    'private': 'Private',
                    'publicWarning': 'Warning: If this group is public, everybody can access it',
                    'create': 'Create',
                    'myGroups': 'My Groups',
                    'recommended': 'Recommended',
                    'search': 'Search',
                    'group': 'Group',
                    'access': 'Access',
                    'members': 'Members',
                    'manage': 'Manage',
                    'update': 'Update group details',
                    'archive': 'Do you want to archive this group?',
                    'allowArchive': 'Yes, this group should be archived',
                    'denyArchive': 'No, this group is still in use',
                    'archiveWarning': 'Warning: Archived groups are read-only',
                    'addMember': 'Add a member',
                    'username': 'Username',
                    'role': 'Role',
                    'admin': 'Administrator',
                    'member': 'Member',
                    'join': 'Join',
                    'joined': 'Joined',
                    'leave': 'Leave',
                    'archived': 'Archived',
                    'add': 'Add',
                    'remove': 'Remove',
                    'save': 'Your group has been created'
                },

                // Tags Tab
                'tags': {
                    'title': 'Tags',
                    'trends': 'Trends',
                    'search': 'Search',
                    'tag': 'Tag',
                    'follow': 'Follow',
                    'following': 'Following',
                    'unfollow': 'Unfollow'
                },

                // Top Posters Tab
                'topPosters': {
                    'title': 'Top Posters',
                    'username': 'Username',
                    'count': 'Status Count'
                }
            },

            'form': {
                'cancel': 'Cancel',
                'save': 'Save',
                'success': 'The form has been successfully saved.',
                'fail': 'Failed to save form.',
                'deleted': 'Your file has been deleted.'
            },

            'admin': {
                'title': 'Administration Dashboard',
                'registered': 'Registered Enterprises',
                'domain': 'Domain',
                'count': '# of users',
                'environment': 'Environnement Variables (from tatami.properties)',
                'propery': 'Property',
                'value': 'Value',
                'reindex': 'Re-index Search Engine',
                'confirm': 'Are you sure you want to re-index Search Engine?',
                'success': 'Search engine re-indexation has succeeded.',
                'deactivate': 'Deactivate',
                'activate': 'Activate'
            }
        }
    });

    $translateProvider.translations('fr', {

    });

    $translateProvider.preferredLanguage('en');
});