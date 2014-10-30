tatamiApp.config(function ($translateProvider) {
  
    $translateProvider.translations('en', {
        'tatami' : {
            'timeline' : 'Timeline',
            'mentions' : 'Mentions',
            'favorites' : 'Favorites',

            'status' : {
                'replyto' : 'In reply to',
                'private' : 'Private Message',
                'view' : 'View',
                'reply' : 'Reply',
                'delete' : 'Delete',
                'share' : 'Share',
                'favorite' : 'Favorite'
            }
        }
    });

    $translateProvider.translations('fr', {

    });

    $translateProvider.preferredLanguage('en');
});