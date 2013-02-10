

<script src="/js/bootstrap-tour.js"></script>
<script src="/js/jquery.cookie.js"></script>

<style>
  #profileHelp {
    width : 400px;
  }
  #profileHelp {
    width : 400px;
  }
  #updateStatusContentHelp {
    width : 400px;
  }
</style>
<script >
jQuery(function($) {
	var tour = new Tour({
	  labels: {
            end: 'End tour',
            next: 'Next fr &raquo;',
            prev: '&laquo; Prev fr'
        }
	});

	tour.addStep({
	  element: "#profileContent", /* html element next to which the step popover should be shown */
	  placement: "right",
          stepId: "profileHelp",
	  title: "<b>Profile</b>", /* title of the popover */
	  content: "This is information about your activity on tatami,"+
		   "it display how many messages you have shared" + 
		   "how many people you follow, how many people you are following and how many " 
	});
	tour.addStep({
	  element: "#updateStatusContent", 
	  placement: "bottom",
          stepId: "updateStatusContentHelp",
	  title: "<b>Sending messages</b>",
	  content: "Here is where you write messages you want to share, " +
                   "<ul><li>all messages are public by default. They will be delivered "+
                   " to all users who follow you </li>"+
		   "<li>when writing a message you should use <i>#hashtags</i> : this simply means adding a \'#\' at the begining of important word that can be used to find your message </li>" +
 		   "<li>when mentionning, or replying to, other users, you should add "+
 		   "a @ at the beginning of their name : they will be notified that "+ 
		   " you are talking to them </li>"  +
		   "</ul>"
		
	});


	tour.addStep({
	  element: "#groupsList", /* html element next to which the step popover should be shown */
	  title: "title 2", /* title of the popover */
	  content: "content 2" /* content of the popover */
	});
	tour.setCurrentStep(0);

	tour.start(true);
});

</script>
