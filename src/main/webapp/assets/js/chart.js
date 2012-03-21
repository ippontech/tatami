function refreshChart() {
	$.ajax({
		type: 'GET',
		url: "rest/tweetStats",
		dataType: "json",
		success: function(data) {
			makeChartsList(data, $('#chart_div'));
			$('#chartTab').tab('show');
		}
	});
}

function makeChartsList(data, dest) {
    var dt = new google.visualization.DataTable();
    dt.addColumn('string', 'Login');
    dt.addColumn('number', 'Tweets per Day');

    $.each(data, function(entryIndex, entry) {
		dt.addRow(['@' + entry['login'], entry['tweetsCount']]);
	});

    var chart = new google.visualization.PieChart(document.getElementById(dest.attr('id')));
    chart.draw(dt, { 'title': "Today's tweets sharing", 'width':dest.width(), 'height':dest.height() });

    google.visualization.events.addListener(chart, 'select', function() {
    	  var login = dt.getValue(chart.getSelection()[0].row, 0).substring(1);
    	  listUserTweets(login);
    });
}
