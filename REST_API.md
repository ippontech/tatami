Tatami REST API
=========================

fr.ippon.tatami.web.rest.AccountController
------------------

* Account's profile

[ GET, PUT, DELETE ] /rest/account/profile

* Account's preferences

[ GET, POST ] /rest/account/preferences

* password is managed by LDAP

[ GET, POST ] /rest/account/password

* All users of domain

[ GET ] /rest/visit


fr.ippon.tatami.web.rest.AttachmentController
------------------

* Attachments list

[ GET, DELETE ] /rest/attachments
optional : {attachmentId}

* Quota in % for the domain

[ GET ] /rest/attachments/quota


fr.ippon.tatami.web.rest.CompanyWallController
------------------

* Public statuses of the current company

[ GET ] /rest/company


fr.ippon.tatami.web.rest.FavoritesController
------------------

* favorite status of the current user

[ GET ] /rest/favorites


















