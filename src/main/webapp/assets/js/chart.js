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
	google.load("visualization", "1", { packages:["corechart"] });	// API lazy loading
    google.setOnLoadCallback(function () {							// drawing when API loading completed
        var dt = new google.visualization.DataTable();
        dt.addColumn('string', 'Login');
        dt.addColumn('number', 'Tweets per Day');

        $.each(data, function(entryIndex, entry) {
        	alert(entry['login'] + ' ' + entry['tweetsCount']);
    		dt.addRow([entry['login'], entry['tweetsCount']]);
    	});

	    var chart = new google.visualization.PieChart(dest);
	    chart.draw(dt, { 'title': "Today's tweets repartition", 'width':dest.width(), 'height':dest.height() });
	});
}
