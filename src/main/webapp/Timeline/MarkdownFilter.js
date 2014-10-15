tatami.filter('markdown', function() {
  return function(content) {
    return marked(content);
  };
});