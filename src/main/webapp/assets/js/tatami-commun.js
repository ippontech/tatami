$(function() {

  /*
    Formulaire de recherche du header
  */

  var SearchFormHeaderView = Backbone.View.extend({
    initialize: function(){
    },

    events: {
      'submit' : 'submit'
    },

    submit: function(e) {
      e.preventDefault();

      var search = null;

      _.each($(e.target).serializeArray(), function(input){
        if(input.name === 'search')
          search = input.value;
      });
      if(search)
        window.location = '/tatami/#/search/' + search;
    }
  });

  /*
    Liaison de la vue avec le noeud
  */

  new SearchFormHeaderView({
    el: $('#searchHeader')
  });

});