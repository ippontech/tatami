/**
 * Tatami charts.
 */

function makePieChartsList(data, dest) {
	var dt = new google.visualization.DataTable();
	dt.addColumn('string', 'User name');
	dt.addColumn('number', 'Status per Day');

	$.each(data, function(entryIndex, entry) {
		dt.addRow(['@' + entry['username'], entry['statusCount']]);
	});

	var chart = new google.visualization.PieChart(document.getElementById(dest.attr('id')));
	chart.draw(dt, { 'title': "Today's status sharing", 'width':dest.width(), 'height':dest.height() });

	google.visualization.events.addListener(chart, 'select', function() {
		  var username = dt.getValue(chart.getSelection()[0].row, 0).substring(1);
          window.location = "/tatami/profile/" + username;
	});
}

function makePunchChartsList(data, dest) {
	dest.empty();

	// Grab the data
	var axisx = [], axisy = [], dt = new Array();
	$.each(data, function(i, entry) {
		axisx.push(entry['day']);
		dt[i] = new Array();
		$.each(entry['stats'], function(j, value) {
			if (i == 0)	axisy.push(value['username']);
			dt[i][j] = parseFloat(value['statusCount'], 10);
		});
	});

	// Draw the chart
	var width = dest.width(), height = dest.height(),
		leftgutter = 30, bottomgutter = 20,
		r = Raphael(dest.attr('id'), width, height),
		txt = {"font": '12px Fontin-Sans, Arial', stroke: "none", fill: "#08c"},
		X = (width - leftgutter) / axisx.length,
		Y = (height - bottomgutter) / axisy.length,
		max = Math.round(X / 2) - 1;
	r.rect(0, 0, width, height, 5).attr({fill: "#fff", stroke: "none"});
	for (var i=0; i < axisx.length; i++) {
		r.text(leftgutter + X * (i + .5), height * .98, axisx[i]).attr(txt);
	}
	for (var j=0; j < axisy.length; j++) {
		r.text(leftgutter, Y * (j + .5), '@' + axisy[j]).attr(txt)
		// Make Y labels interactive
			.data('username', axisy[j]).click(function () {
				window.location = "/tatami/profile/" + this.data('username');
			})
		// Add help tooltip
			.attr({title: 'Show ' + axisy[j] + ' status'});
	}

	for (var i = 0; i < axisx.length; i++) {
		for (var j = 0; j < axisy.length; j++) {
			var R = dt[i][j] && Math.min(Math.round(Math.sqrt(dt[i][j] / Math.PI) * 4), max);
			if (R) {
				(function (dx, dy, R, value) {
					var color = "hsb(" + [(1 - R / max) * .5, 1, .75] + ")";
					// Draw the punch
					var punch = r.circle(dx + 60 + R, dy + 10, R).attr({stroke: "none", fill: color});
					if (R < 6) {
						var bg = r.circle(dx + 60 + R, dy + 10, 6).attr({stroke: "none", fill: "#000", opacity: .4}).hide();
					}
					// Show punch values as integrated tooltips
					var lbl = r.text(dx + 60 + R, dy + 10, dt[i][j])
							.attr({"font": '10px Fontin-Sans, Arial', stroke: "none", fill: "#fff"}).hide();
					var dot = r.circle(dx + 60 + R, dy + 10, max).attr({stroke: "none", fill: "#000", opacity: 0});
					dot[0].onmouseover = function () {
						if (bg) {
							bg.show();
						} else {
							var clr = Raphael.rgb2hsb(color);
							clr.b = .5;
							punch.attr("fill", Raphael.hsb2rgb(clr).hex);
						}
						lbl.show();
					};
					dot[0].onmouseout = function () {
						if (bg) {
							bg.hide();
						} else {
							punch.attr("fill", color);
						}
						lbl.hide();
					};
				})(leftgutter + X * (i + .5) - 60 - R, Y * (j + .5) - 10, R, dt[i][j]);
			}
		}
	}
}
