/**
* jQuery-pie for Tatami
* by Arthur Weber
*/

Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        if(startAngle%360 === endAngle%360)
            return paper.circle(cx, cy, r).attr(params);
        else {
            var x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad);
            return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle >= 180), 0, x2, y2, "z"]).attr(params);
        }
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = Raphael.hsb(start, 0.75, 1),
                ms = 500,
                delta = 30,
                bcolor = Raphael.hsb(start, 1, 1),
                p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3}),
                txt = paper.text(cx + (r + delta + 35) * Math.cos(-popangle * rad), cy + (r + delta + 15) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0.3, "font-size": 13});
            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
                txt.stop().animate({opacity: 1, "font-size": 15}, ms, "elastic");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "elastic");
                txt.stop().animate({opacity: 0.3, "font-size": 13}, ms);
            }).click(function(){
                window.location = '/tatami/profile/' + labels[j] + '/';
            });
            angle += angleplus;
            chart.push(p);
            chart.push(txt);
            start += 0.1;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};

(function($) {
  $.fn.pie = function(values, labels) {
    this.each(function(){
        var w = $(this).width();
        var h =  w * 0.75;
        var r = Math.min(h/2, w/2) * 0.8;
        $(this).empty();
        Raphael(this, w, h).pieChart(w/2, h/2, r, values, labels, "#fff");
    });
    return this;
  };
}(jQuery));