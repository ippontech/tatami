angular.module('tatami')

    .factory('LineItems', function() {
        // Some fake testing data
        var lineItems = [
            {
                activated: true,
                attachmentIds: null,
                attachments: null,
                avatar: "72ae6ec0-814c-11e5-ada7-fe54008898dc",
                content: "#tatami Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam placerat risus dictum mi molestie sollicitudin. Quisque venenatis auctor tortor eget iaculis. Sed vehicula diam lectus, id porttitor nibh pretium nec.",
                detailsAvailable: true,
                favorite: false,
                firstName: "Pierre",
                geoLocalization: "",
                groupId: null,
                groupName: null,
                iso8601StatusDate: "2016-01-05T14:36:36.191+01:00",
                lastName: "French",
                prettyPrintStatusDate: "5 Jan",
                publicGroup: false,
                replyTo: "",
                replyToUsername: "",
                shareByMe: false,
                sharedByUsername: null,
                statusDate: 1452000996191,
                statusId: "576b47e0-b3b1-11e5-ada7-fe54008898dc",
                statusPrivate: false,
                timelineId: "576b47e0-b3b1-11e5-ada7-fe54008898dc",
                type: "STATUS",
                username: "pfrench"
            },
            {
                activated: true,
                attachmentIds: null,
                attachments: null,
                avatar: "72ae6ec0-814c-11e5-ada7-fe54008898dc",
                content: "Etiam vulputate urna in lacus sollicitudin, ut ultricies diam condimentum. Nulla eu eros porta, pulvinar massa et, tristique erat. #awesome",
                detailsAvailable: true,
                favorite: false,
                firstName: "John",
                geoLocalization: "",
                groupId: null,
                groupName: null,
                iso8601StatusDate: "2015-02-06T15:03:26+01:00",
                lastName: "Doe",
                prettyPrintStatusDate: "6 Feb",
                publicGroup: false,
                replyTo: "",
                replyToUsername: "",
                shareByMe: false,
                sharedByUsername: null,
                statusDate: 1452000996191,
                statusId: "576b47e0-b3b1-11e5-ada7-gf65127787cb",
                statusPrivate: false,
                timelineId: "576b47e0-b3b1-11e5-ada7-gf65127787cb",
                type: "STATUS",
                username: "jdoe"
            },
            {
                activated: true,
                attachmentIds: null,
                attachments: null,
                avatar: "72ae6ec0-814c-11e5-ada7-fe54008898dc",
                content: "Quisque augue neque, scelerisque at maximus sit amet, fringilla quis eros. Aliquam commodo gravida sem eget blandit.",
                detailsAvailable: true,
                favorite: false,
                firstName: "Jane",
                geoLocalization: "",
                groupId: null,
                groupName: null,
                iso8601StatusDate: "2016-01-05T14:36:36.191+01:00",
                lastName: "Bailey",
                prettyPrintStatusDate: "5 Jan",
                publicGroup: false,
                replyTo: "",
                replyToUsername: "",
                shareByMe: false,
                sharedByUsername: null,
                statusDate: 1452000996191,
                statusId: "576b47e0-b3b1-11e5-ada7-ab12345677cd",
                statusPrivate: false,
                timelineId: "576b47e0-b3b1-11e5-ada7-ab12345677cd",
                type: "STATUS",
                username: "jbailey"
            }
        ];


        return {
            all: function() {
                return lineItems;
            },
            remove: function(lineItem) {
                lineItems.splice(lineItems.indexOf(lineItem), 1);
            },
            get: function(lineItemId) {
                for (var i = 0; i < lineItems.length; i++) {
                    if (lineItems[i].timelineId === lineItemId) {
                        return lineItems[i];
                    }
                }
                return null;
            }
        };
    });
