TatamiApp.config(['$translateProvider', function($translateProvider) {
  
    $translateProvider.translations('en', {
        'tatami': {
            'pageNotFound': 'Page not found.',
            'error': 'An error has occurred.',

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
                    'afterBP2': 'When viewing a message, you can reply to it and mark it as a favorite to find it easily later.',
                    'afterBP3': 'If a message already has some replies, you can see them all by clicking on the timestamp or clicking \'View Conversation\'.'
                },
                'post': {
                    'title': 'Posting Messages',
                    'line1': 'Here is where you write messages you want to share',
                    'bulletPoint1': 'All messages are public by default. They will be delivered to all users who follow you.',
                    'bulletPoint2': 'When writing a message you should use <\i>#hashtags</i>. This simply means adding a # at the beginning of important words that can be used to find your message.',
                    'bulletPoint3': 'When mentioning or replying to other users you should add a @ at the beginning of their name. They will be notified that you are talking to them.'
                },
                'groups': {
                    'title': 'Groups',
                    'line1': 'This is the list of groups you are a member of.',
                    'line2': 'You can find and subscribe to public groups in the Account/Groups page (top-right menu).',
                    'line3': 'There are also private groups. You cannot subscribe to these. The owner of the group must add you as a member.'
                },
                'trends': {
                    'title': 'Trends',
                    'line1': 'This list represents the #hashtags that are currently the most often used on Tatami. Use this to discover what\'s going on and what are the hottest topics on Tatami!'
                },
                'whoToFollow': {
                    'title': 'Who To Follow',
                    'line1': 'This is a list of users who share common interests with you and who you could follow.',
                    'line2': 'If you are a new user, this list is probably empty. Tatami needs some time to learn who you are in order to suggest relevant users.',
                    'line3': 'And don\'t forget to use #hashtags in your messages. It makes everything easier!'
                },
                'next': 'Next',
                'previous': 'Prev',
                'end': 'End'
            },

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

                // Terms of Service Page
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

                'newMessage': 'New Message',
                'newMessages': 'New Messages',

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
                    'isAnnounced': 'Announced by',
                    'viewConversation': 'View Conversation',
                    'shares': 'Shares'
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
                },

                'searchPage': {
                    'title': 'Search',
                    'statusesWith': 'Statuses with'
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
        'tatami': {
            'error': 'Il y a une erreur',
            'pageNotFound': 'Page non trouvée.',

            'welcome': {
                'title': 'Bienvenue à Tatami',
                'message': 'Votre timeline est vide! Avez-vous besoin d\'aide pour apprendre à utilizer Tatami? Veuillez clicker sur le bouton ci-dessous pour lancer une présentation.',
                'presentation': 'Lancer la présentation',
                'help': {
                    'title': 'Aide',
                    'line1': 'Bienvenue à l\'aide en ligne!',
                    'line2':' Suivez les étapes suivantes pour une tournée des principales caractéristiques de Tatami .'
                },
                'timeline': {
                    'title': 'Timeline',
                    'line1': 'Ceci est votre timeline. Il affiche tous les messages',
                    'bulletPoint1': 'vous mentionner ou envoyé en privé à vous',
                    'bulletPoint2': 'envoyé par les utilisateurs que vous suivez',
                    'bulletPoint3': 'envoyé par vous-même ',
                    'bulletPoint4': 'envoyé à un groupe que vous êtes abonné',
                    'afterBP1': 'Si elle est vide, ne vous inquiétez pas, elle sera mise à jour dès que vous commencez à suivre d\'autres utilisateurs!',
                    'afterBP2': 'Lors de l\'affichage d\'un message, vous pouvez y répondre et la marquer comme favori pour le retrouver plus facilement.',
                    'afterBP3': 'Si un message avait déjà obtenu quelques réponses, vous pouvez voir tous les détails en cliquant sur detail: ce sera plus facile de suivre la conversation sur Tatami.'
                },
                'post': {
                    'title': 'Envoyer un message',
                    'line1': 'C\'est ici que vous écrivez vos messages que vous souhaitez partager',
                    'bulletPoint1': 'tous les messages sont publiques par défaut. Ils seront livrés à tous les utilisateurs qui vous suivent',
                    'bulletPoint2': 'pour écrire un message, vous devez utiliser #hashtags: cela signifie tout simplement l\'ajout d\'un «#» au début de mots importants qui peut être utilisé pour trouver votre message',
                    'bulletPoint3': 'en mentionnant, ou répondre à d\'autres utilisateurs, vous devez ajouter un @ au début de leur nom: ils seront informés que vous vous adressez à eux'
                },
                'groups': {
                    'title': 'Groupes',
                    'line1': 'Ceci est la liste des groupes que vous êtes un membre de.',
                    'line2': 'Vous pouvez trouver et vous abonner à, groupe public dans la page Account/Groupes (menu en haut à droite).',
                    'line3': 'Il y a aussi des groupes privés: pour eux vous ne pouvez pas vous inscrire: le propriétaire du groupe doit vous ajouter en tant que membre.'
                },
                'trends': {
                    'title': 'Tendances',
                    'line1': 'Cette liste représente les #hashtag qui sont les plus souvent utilisés sur Tatami. Utilisez-le pour découvrir ce qui ce passe et quels sont les sujets les plus chauds sur Tatami!'
                },
                'whoToFollow': {
                    'title': 'Utilisateurs suggérées',
                    'line1': 'Ceci est une liste d\'utilisateurs qui partagent des intérêts communs avec vous et que vous pourriez suivre.',
                    'line2': 'Si vous êtes un nouvel utilisateur, cette liste est probablement vide: Tatami a besoin de temps pour apprendre qui vous êtes afin de vous proposer des utilisateurs',
                    'line3': 'Et n\'oubliez pas d\'utiliser des #hashtags dans vos messages, il rend tout plus facile!'
                },
                'next': 'Suivant',
                'previous': 'Précédent',
                'end': 'Fin'
            },

            // Login View
            'login': {
                'title': 'Login',
                'mainTitle': 'Bienvenue à Tatami',
                'subtitle': 'Un réseau social d\'entreprise open source',
                'moreInfo': 'Plus d\'info',
                'email': 'Email',
                'password': 'Mot de passe',
                'remember': 'Souviens-moi',
                'forgotPassword': 'Mot de passe oublié?',
                'resetPassword': 'Nouveau mot de passe',
                'tos': 'Conditions de service',
                'fail': 'Votre authentification a échoué! Etes-vous sûr que vous avez utilisé un mot de passe correct?',
                'passwordEmailSent': 'Un e-mail vous a été envoyé, avec des instructions pour générer un nouveau mot de passe.',
                'unregisteredEmail': 'Cette adresse e-mail n\'est pas enregistré avec Tatami.',
                'register': {
                    'title': 'Enregistré',
                    'line1': 'Un email de confirmation sera envoyé à l\'adresse que vous fournissez.',
                    'line2': "Le domaine de votre email détermine l'espace de l'entreprise que vous allez rejoindre. Par exemple, les utilisateurs ayant une adresse email@ippon.fr vont joindre l'espace privées de Ippon.",
                    'line3': "Si vous êtes le premier employé de votre entreprise à se joindre à Tatami, l'espace privé de votre entreprise sera automatiquement créé."
                },
                'googleApps': {
                    'title': 'Google Apps Login',
                    'line1': 'Cette fonction est pour les utilisateurs de Google Apps pour de travail, qui ont leur nom de domaine de travail géré par Google Apps.',
                    'link': 'Pour plus d\'informations sur Google Apps pour le travail, cliquez ici.',
                    'line2': 'Si oui ou non vous avez déjà un compte Tatami, vous pouvez vous connecter avec votre compte Google Apps.',
                    'line3': "Votre e-mail sera fourni par Google et le nom du domaine de votre e-mail sera utilisé pour vous permettre de rejoindre l'espace privé de votre entreprise.",
                    'login': 'Login avec Google Apps'
                },

                'validation': 'Validation e-mail',
                'passwordSuccess': 'Votre e-mail a été validé. Votre mot de passe sera envoyé par e-mail à vous.',
                'returnHome': 'Allez à la page d\'accueil',
                'registrationEmail': 'Merci! Une inscription e-mail a été envoyé vers vous.'
            },

            'about': {
                // Presentation Page
                'presentation': {
                    'title': 'Qu\'est-ce que c\'est Tatami?',
                    'devices': 'Appareils',
                    'openSource': 'Open Source',
                    'row1': {
                        'title': 'Un réseau social d\'entreprise privée',
                        'line1': 'Mettre à jour votre statut afin d\'informer vos collègues',
                        'line2': "Abonnez-vous aux timeline des autres employés",
                        'line3': 'Partager des informations importantes au personnes qui vous suivent',
                        'line4': 'Discuter et répondre à vos collègues',
                        'line5': 'Mettez des informations importantes à vos favoris',
                        'line6': 'Rechercher des informations utiles avec notre moteur de recherche intégré',
                        'line7': 'Utilisez hashtags trouver des informations associé',
                        'line8': "Aller aux profils de vos collègues pour voir ce qu'ils travaillent sur",
                        'line9': 'Des version Anglaise et Française sont disponible, c\'est aussi facile d\'ajouter d\'autre langue'
                    },
                    'row2': {
                        'title': 'Fonctionne sur tous les appareils!',
                        'line1': 'Application web dynamique (HTML5): rien à installer, à l\'exception d\'un navigateur moderne!',
                        'line2': "Fonctionne sur les appareils mobiles, des tablets ou des ordinateurs: l'application s'adapte automatiquement à l'écran de votre appareil",
                        'line3': 'Restez connecté avec votre entreprise où que vous soyez'
                    },
                    'row3': {
                        'title': "Installation et intégration facile avec l'infrastructure informatique de votre entreprise",
                        'line1': 'Application standard Java',
                        'line2': 'Vos données vous appartient, pas à votre fournisseur SaaS!',
                        'line3': 'Intégration avec votre dossier LDAP',
                        'line4': 'Intégration avec Google Apps',
                        'line5': 'Entièrement Open Source, avec une licence Apache 2.0, qui est sympa pour les entreprises',
                        'line6': 'Facile à étendre ou modifier selon vos besoins',
                        'line7': 'Haute performance (basé sur Cassandra d\'Apache), même sur les petits hardware',
                        'line8': 'Rejoignez le projet et proposer des patches sur notre page Github:'
                    },
                    'row4': {
                        'title': "Egalement disponible en mode SaaS, entièrement géré par Ippon Technologies",
                        'line1': "Si vous ne souhaitez pas installer Tatami dans votre entreprise, il est facile de l'utiliser directement",
                        'line2': 'Mode multi-entreprise sécurisé: chaque entreprise dispose de son propre espace privé',
                        'line3': 'Cryptage SSL 256 bits: tous les transferts de données sont entièrement sécurisé'
                    },
                    'row5': {
                        'title': 'Besoin de plus d\'informations sur notre produit?',
                        'line1': 'Notre équipe de vente est impatient de vous entendre! Appelez-nous au +33 01 46 12 48 48 ou par courriel à'
                    }
                },

                // Terms of Service Page
                'tos': {
                    'title': 'Conditions de service'
                },

                // License Page
                'license': {
                    'title': 'Licence du source code',
                    'copyright': 'Droit d\'auteur'
                }
            },

            // Home View
            'home': {
                'timeline': 'Timeline',
                'mentions': 'Mentions',
                'favorites': 'Favoris',
                'companyTimeline': 'Timeline de votre entreprise',

                'newMessage': 'Nouveau Message',
                'newMessages': 'Nouveau Messages',

                //Top Menu
                'menu': {
                    'logo': 'Ippon Technologies Logo',
                    'title': 'Tatami',
                    'about': {
                        'title': 'Information',
                        'presentation': 'Présentation',
                        'tos': 'Conditions de service',
                        'language': {
                            'language': 'Language',
                            'en': 'English',
                            'fr': 'Français'
                        },
                        'license': 'License du source code',
                        'github': {
                            'issues': 'Envoyer un rapport de bug',
                            'fork': 'Fork Tatami sur Github'
                        },
                        'ippon': {
                            'website': 'Site d\'Ippon Technologies',
                            'blog': 'Blog d\'Ippon Technologies Blog',
                            'twitter': 'Suivez @ippontech sur Twitter'
                        }
                    },
                    'search': 'Recherchez',
                    'help': 'Aide',
                    'account': {
                        'title': 'Compte',
                        'companyTimeline': 'Timeline de votre enterprise',
                        'logout': 'Déconnexion'
                    }
                },

                // Post Modal
                'post': {
                    'mandatory': 'Commentaire est obligatoire',
                    'content': {
                        'mandatory': 'S\'il vous plaît remplir ce champ..'
                    },
                    'update': 'Mettre à jour votre statut',
                    'replyTo': 'Répondre',
                    'preview': 'Prévisualisation',
                    'edit': 'Editer',
                    'characters': {
                        'left': 'Caractères restants:'
                    },
                    'options': 'Options',
                    'shareLocation': 'Partager votre localisation',
                    'group': 'Groupe',
                    'reply': 'Répondre à ce statut',
                    'files': 'Fichiers',
                    'drop': {
                        'file': 'Déposez vos fichiers ici'
                    },
                    'markdown': 'Markdown Supported',
                    'button': 'Post'
                },

                // Home Sidebar View
                'sidebar': {
                    'myGroups': 'Mes Groupes',
                    'whoToFollow': 'Qui Suivre',
                    'trends': 'Tendances',
                    'public': 'PUB',
                    'private': 'PVT',
                    'archived': 'ARC',
                    'administrator': 'A',
                    'publicToolTip': 'Groupe public',
                    'privateToolTip': 'Groupe privé',
                    'archivedToolTip': 'Groupe archivé',
                    'administratorToolTip': 'Vous administrez ce groupe.'
                },

                // Status List item or User List item
                'status': {
                    'replyTo': 'En réponse à',
                    'private': 'Message privé',
                    'reply': 'Répondre',
                    'share': 'Partager',
                    'favorite': 'Favoris',
                    'delete': 'Suprimez',
                    'confirmDelete': 'Êtes-vous sûr de vouloir supprimer ce statut?',
                    'sharedYour': 'a partagé votre statut',
                    'followed': 'vous suit',
                    'shared': 'partagé',
                    'groupAdmin': 'Administrateur du groupe',
                    'announce': 'Annoncer',
                    'isAnnounced': 'Annoncé par',
                    'viewConversation': 'Voir La Conversation',
                    'shares': 'Partages'
                },

                // Tag View
                'tag': {
                    'title': 'Tag',
                    'follow': 'Abonnés',
                    'following': 'Abonnements',
                    'unfollow': 'Se désabonné'
                },

                // Group View
                'group': {
                    'join': 'Joindre',
                    'joined': 'Joined',
                    'leave': 'Quitter',
                    'manage': 'Gérer',
                    'statuses': 'Statuts',
                    'members': 'Membres',
                    'membersSingular': '1 Membre',
                    'membersPlural': '{{ amount }} Membres'
                },

                // Profile View
                'profile': {
                    'statuses': 'Statuts',
                    'following': 'Abonnement',
                    'followers': 'Abonnés',
                    'follow': 'Suivre',
                    'unfollow': 'Se désabonner',
                    'followsYou': 'Vous suivre',

                    'youStatusesSingular': 'Votre 1 statut',
                    'youStatusesPlural': 'Vos {{ amount }} statuts',
                    'youFollowingSingular': 'Vous êtes abonné à 1 personne',
                    'youFollowingPlural': 'Vous êtes abonné à {{ amount }} personnes',
                    'youFollowersSingular': '1 personne vous suivre',
                    'youFollowersPlural': '{{ amount }} personnes vous suivre',

                    'userStatusesSingular': '@{{ username }} a partagé un statut',
                    'userStatusesPlural': '@{{ username }} a partagé {{ amount }} statuts',
                    'userFollowingSingular': '@{{ username }} suit 1 personne',
                    'userFollowingPlural': '@{{ username }} suit {{ amount }} personnes',
                    'userFollowersSingular': '@{{ username }} a 1 abonnement',
                    'userFollowersPlural': '@{{ username }} a {{ amount }} abonnements',

                    'deactivatedUser': 'Désactivé l\'utilisateur',

                    // Profile Sidebar View
                    'sidebar': {
                        'information': 'Information',
                        'statistics': 'Statistiques',
                        'firstName': 'Prénom',
                        'lastName': 'Nom',
                        'email': 'Email',
                        'jobTitle': 'Titre du travail',
                        'phoneNumber': 'Numero de telephone',
                        'statuses': 'Statuts',
                        'following': 'Abonnement',
                        'followers': 'Abonné',
                        'trends': 'Tendances'
                    }
                },

                'searchPage': {
                    'title': 'Recherchez',
                    'statusesWith': 'Statuts avec'
                }
            },

            //Account View
            'account': {
                // Profile Tab
                'profile': {
                    'title': 'Profil',
                    'dropPhoto': 'Déposez votre photo ici pour la mettre à jour',
                    'update': 'Mettez à jour votre profil',
                    'email': 'Email',
                    'firstName': 'Prénom',
                    'lastName': 'Nom',
                    'jobTitle': 'Titre de travail',
                    'phoneNumber': 'Numero de telephone',
                    'delete': 'Supprimez votre compte',
                    'confirmDelete': 'Vous êtes sur le point de supprimer votre compte. Êtes-vous sûr?',
                    'save': 'Votre profil a été sauvé'
                },

                // Preferences Tab
                'preferences': {
                    'title': 'Preferences',
                    'notifications': 'Notifications',
                    'notification': {
                        'email': {
                            'mention': 'Recevez une notification par email lorsque vous êtes mentionné',
                            'dailyDigest': 'Obtenez un résumé quotidien email',
                            'weeklyDigest': 'Obtenez un sommaire hebdomadaire email'
                        },
                        'rss': {
                            'timeline': 'Autoriser RSS publication de votre fils d\'actualité',
                            'link': 'Lien de votre RSS fils d\'actualité'
                        }
                    },
                    'save': 'Vos préférences ont été sauvegardées'
                },

                // Password Tab
                'password': {
                    'title': 'Mot de passe',
                    'update': 'Changez votre mot de passe',
                    'old': 'Ancien mot de passe',
                    'new': 'Nouveau mot de passe',
                    'confirm': 'Confirmer votre nouveau mot de passe',
                    'save': 'Votre mot de passe a été changé'
                },

                // Files Tab
                'files': {
                    'title': 'Fichier',
                    'filename': 'Nom de fichier',
                    'size': 'Taille',
                    'date': 'Date',
                    'delete': 'Supprimez'
                },

                // Users Tab
                'users': {
                    'title': 'Utilisateur',
                    'following': 'Abonné',
                    'recommended': 'Recommendé',
                    'search': 'Recherchez',
                    'deactivated': 'Cet utilisateur est désactivé'
                },

                // Groups Tab
                'groups': {
                    'title': 'Groupes',
                    'createNewGroup': 'Créer un nouveau groupe',
                    'name': 'Nom',
                    'description': 'Description',
                    'public': 'Public',
                    'private': 'Privé',
                    'publicWarning': 'Attention: Si ce groupe est public, tout le monde peut y accéder',
                    'create': 'Créer',
                    'myGroups': 'Mes Groupes',
                    'recommended': 'Recommandé',
                    'search': 'Rechercher',
                    'group': 'Groupe',
                    'access': 'Accès',
                    'members': 'Membres',
                    'manage': 'Gérer',
                    'update': 'Mettre à jour let détails de votre groupe',
                    'archive': 'Voulez-vous archiver ce groupe?',
                    'allowArchive': 'Oui, ce groupe devrait être archivée',
                    'denyArchive': 'Non, ce groupe est encore en usage',
                    'archiveWarning': 'Attention: Groupe archivé sont en lecture seule',
                    'addMember': 'Ajouter un member',
                    'username': 'Username',
                    'role': 'Rôle',
                    'admin': 'Administrator',
                    'member': 'Membre',
                    'join': 'Joindre',
                    'joined': 'Joignit',
                    'leave': 'Quitter',
                    'archived': 'Archivé',
                    'add': 'Ajouter',
                    'remove': 'Supprimer',
                    'save': 'Votre groupe a été créé'
                },

                // Tags Tab
                'tags': {
                    'title': 'Tags',
                    'trends': 'Tendances',
                    'search': 'Recherchez',
                    'tag': 'Tag',
                    'follow': 'Abonné',
                    'following': 'Abonnement',
                    'unfollow': 'Se désabonné'
                },

                // Top Posters Tab
                'topPosters': {
                    'title': 'Top Posters',
                    'username': 'Username',
                    'count': 'Combien de Statuts'
                }
            },

            'form': {
                'cancel': 'Annuler',
                'save': 'Sauvegarder',
                'success': 'Le formulaire a été enregistré avec succès.',
                'fail': 'Impossible de sauvegarder le formulaire.',
                'deleted': 'Votre fichier a été supprimé.'
            },

            'admin': {
                'title': 'Dashboard d\'administration',
                'registered': 'Entreprises enregistrées',
                'domain': 'Domaine',
                'count': '# d\'utilisateur(s)',
                'environment': 'Variables d\'environnement (de tatami.properties)',
                'propery': 'Property',
                'value': 'Valeur',
                'reindex': 'Ré-indexation du moteur de recherche',
                'confirm': 'Êtes-vous sûr que vous voulez ré-indexer les moteurs de recherche?',
                'success': 'La ré-indexation du moteur de recherche a réussi.',
                'deactivate': 'Désactiver',
                'activate': 'Activer'
            }
        }
    });

    $translateProvider.useCookieStorage();
    $translateProvider.registerAvailableLanguageKeys(['en', 'fr']);
    $translateProvider.fallbackLanguage('en');
    $translateProvider.determinePreferredLanguage();
}]);