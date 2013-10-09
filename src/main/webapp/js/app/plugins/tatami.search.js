(function(window, Tatami){

    Tatami.Search = function(){
        this.menu = '<ul class="typeahead dropdown-menu hasCategory"></ul>';

        this.source = function(query,process){
            $.getJSON('/tatami/rest/search/all', {q: query}, function(model){
                var data = [];
                data.push(model);
                return process(data);
            });
        };

        this.matcher = function (item) {
            return item;
        };

        this.sorter = function (items) {
            var data = [];
            items = items[0];

            items.tags.forEach(function(v){
                var obj = {};
                obj.label = '#'+ v.name;
                obj.category = "tags";
                data.push(obj);
            });

            items.users.forEach(function(v){
                var obj = {};
                obj.label = '@'+v.username;
                obj.fullName = v.firstName+' '+ v.lastName;
                obj.avatar = v.avatar;
                obj.activated = v.activated;
                obj.category = "users";
                data.push(obj);
            });

            items.groups.forEach(function(v){
                var obj = {};
                obj.label = v.name;
                obj.id = v.groupId;
                obj.nb = v.counter;
                obj.category = "groups";
                data.push(obj);
            });

            return data;
        };

        this.highlighter = function (item) {
           return true;
        };

        this.render = function(items){
            this.$menu.empty();

            var category = _.template($('#search-category').html()),
                templateItems = _.template($('#search-category-item').html()),
                self = this,
                currentCategory = "";

            _.each(items, function(item) {

                var menu, i;

                if ( item.category != currentCategory ) {
                     currentCategory = item.category;
                     menu = category({cat: item});
                     self.$menu.append(menu);
                }

                switch(currentCategory){
                    case 'users':
                        item.avatarURL = (new Tatami.Models.User({
                            avatar: item.avatar
                        })).getAvatarURL();
                        i = templateItems({item: item});
                    break;
                    case 'groups':
                        i = templateItems({item: item});
                    break;
                    default:
                        i = templateItems({item: item});
                    break;
                }
                self.$menu.append(i);
            });

            this.$menu.children('li.category').next().addClass('first');

            return this;
        };

        this.select = function () {
            var input = $('#fullSearchText').val();

            var val = this.$menu.find('.active').attr('data-value'),
                groupId =  this.$menu.find('.active').attr('rel');

            if (typeof val == 'undefined') {
                input = $('[name="search"]').val();
                Backbone.history.navigate('search/' + input, true);
                this.hide();
                return false;
            }
            switch(val.charAt(0)){
                case '#':
                    Backbone.history.navigate('tags/'+val.substr(1), true);
                break;
                case '@':
                    Backbone.history.navigate('users/'+val.substr(1), true);
                   break;
                default:
                    Backbone.history.navigate('groups/'+groupId, true);
                    break;
            }
            this.$element.val(this.updater(val)).change();
            return this.hide();
        };

        this.next = function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var next = active.next();

            if (!next.length) next = $(this.$menu.find('li')[0]);

            next.addClass('active');

            if(!next.hasClass('item')) this.next();
        };

        this.prev = function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var prev = active.prev();

            if (!prev.length) {
                prev = this.$menu.find('li').last();
            }

            prev.addClass('active');

            if(!prev.hasClass('item')) this.prev();
        };
    };
})(window, Tatami);