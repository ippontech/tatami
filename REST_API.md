Tatami REST API
=================

Account
------------------
Get account's profile

```
GET  /rest/account/profile
```
```json
[ 
  {
    "username":"adupuis",
    "avatar":null,
    "firstName":"Alexandre",
    "lastName":"DUPUIS",
    "jobTitle":"",
    "phoneNumber":"",
    "attachmentsSize":0,
    "statusCount":2,
    "friendsCount":0,
    "followersCount":0
  }
]
```

Update account's profile

```
PUT  /rest/account/profile
```

```
DELETE /rest/account/profile
```
Get account's preferences

```
GET  /rest/account/preferences
```
```json
[ 
  {
    "mentionEmail":true,
    "weeklyDigest":true,
    "dailyDigest":null,
    "theme":"bootstrap",
    "rssUidActive":false,
    "rssUid":null,
    "themesList":[
                  "bootstrap",
                  "cerulean",
                  "cosmo",
                  "journal",
                  "readable",
                  "simplex",
                  "spacelab",
                  "spruce",
                  "superhero",
                  "united"
                  ]
  }
]
```

```
POST  /rest/account/preferences
```

Password is managed by LDAP

```
GET  /rest/account/password
```
```
POST  /rest/account/password
```

All users of domain

```
GET  /rest/visit
```
FileUpload
------------------
Upload files
```
POST  /rest/fileupload
```
```json
[ 
  {
    attachmentId: "33a61c70-a5c9-11e2-8ca3-20c9d0d4b14b"
    delete_type: null
    delete_url: null
    name: "Garden.jpg"
    size: 516424
    thumbnail_url: null
    url: "http://localhost:8080/tatami/file/33a61c70-a5c9-11e2-8ca3-20c9d0d4b14b/Garden.jpg"
  }
]
```
Get file by url
```
GET  /file/:attachmentId/*
```
Parameters:

+ `attachmentId` (required) - The ID of an attachment




Attachment
------------------
Get Attachment by ID

```
GET  /rest/attachments/:attachmentId
```
Delete Attachment by ID

```
DELETE  /rest/attachments/:attachmentId
```
Parameters:

+ `attachmentId` (required) - The ID of an attachment

Quota in % for the domain

```
GET  /rest/attachments/quota
```

CompanyWall
------------------
Public statuses of the current company

```
GET  /rest/company
```

Favorites
------------------
Favorite status of the current user

```
GET /rest/favorites
```

















