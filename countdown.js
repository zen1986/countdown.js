(function () {
    
    // stroke class constructor
    var Stroke = function (x,y,z,g,color) {

        this.stroke = g.append("svg:rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", x)
            .attr("height", y)
            .attr("rx", z)
            .attr("fill", color)
			.attr("class", "stroke")
            .attr("ry", z);
    };


    Stroke.prototype.fill = function (color) {
        if (color) {
            this.stroke.attr("opacity", 1);
            this.stroke.attr("fill", color);
        }
        else {
            this.stroke.attr("opacity", 0);
        }
    }
    
    // number model class constructor 
    var Model = function (container, clas) {
        this.bgColor = "black";

        this.model = container.append("svg:svg")
            .style("width", this.w)
			.attr("class", "model "+clas)
            .style("height", this.h);

        // background
        this.bg = this.model.append("svg:rect")
            .attr("class", "background")
            .attr("width", this.w)
            .attr("height", this.h)
            .attr("fill", this.bgColor);

        // initialize, draw the strokes
        this.initModel();
        this.makeNumber(0);
    };

    Model.prototype.initModel = function () {
        var x = this.w/10, y = this.h/3, z=x, m=(this.w - 2*y+3*x)/2, color=this.bgColor;

        this.strokes =new Array(8); 

        var g = this.model.append("svg:g").attr("transform", "translate("+m+","+m+")");

        var g1 = g.append("svg:g").attr("transform", "translate(0, "+x+")");
        this.strokes[1] = new Stroke(x, y, z, g1, color);

        var g2 = g.append("svg:g").attr("transform", "translate(0, "+(y+2*x)+")");
        this.strokes[2] = new Stroke(x, y, z, g2, color);

        var g3 = g.append("svg:g").attr("transform", "rotate(270) translate(-"+(2*y+3*x)+", "+x+")");
        this.strokes[3] = new Stroke(x, y, z, g3, color);

        var g4 = g.append("svg:g").attr("transform", "translate("+(x+y)+", "+(y+2*x)+")");
        this.strokes[4] = new Stroke(x, y, z, g4, color);

        var g5 = g.append("svg:g").attr("transform", "translate("+(x+y)+", "+x+")");
        this.strokes[5] = new Stroke(x, y, z, g5, color);

        var g6 = g.append("svg:g").attr("transform", "rotate(270) translate(-"+x+", "+x+")");
        this.strokes[6] = new Stroke(x, y, z, g6, color);

        var g7 = g.append("svg:g").attr("transform", "rotate(270) translate(-"+(y+2*x)+", "+x+")");
        this.strokes[7] = new Stroke(x, y, z, g7, color);

    };

    Model.prototype.makeNumber = function (num) {
        this.fill = "white";

        var strokMap = [
            [1,2,3,4,5,6],
            [5,4],
            [6,7,2,3,5],
            [6,7,5,3,4],
            [1,7,5,4],
            [6,1,7,3,4],
            [2,1,3,4,6,7],
            [4,6,5],
            [2,1,5,3,4,6,7],
            [1,5,3,4,6,7],
            ];
        
        var strokesOn=strokMap[num];
        var self=this;

        // reset first
        this.strokes.forEach(function (s) {s.fill();});
        strokesOn.forEach(function (s) {self.strokes[s].fill(self.fill);});
    };

	// there is only one instance of clock
    var Clock= {};

    Clock.init = function () {
        var clock, days, hours, minutes, seconds, modelHeight=150, modelWidth=100;
		
		// remove clock
		d3.select("#clock").selectAll(".clock").remove();

		// remove timer
		if (this.timer) 
			clearInterval(this.timer);

		// append clock div
        clock = d3.select("#clock").append("div").attr("class", "center clock");
        days = clock.append("div").attr("class", "days");
		dot1 = clock.append("div").attr("class", "dot");
        hours = clock.append("div").attr("class", "hours");
		dot2 = clock.append("div").attr("class", "dot");
        minutes = clock.append("div").attr("class", "minutes");
		dot3 = clock.append("div").attr("class", "dot");
        seconds = clock.append("div").attr("class", "seconds");

		// append label 
        days.append("h3").text("days");
        hours.append("h3").text("hours");
        minutes.append("h3").text("minutes");
        seconds.append("h3").text("seconds");

		Model.prototype.w = modelWidth;
		Model.prototype.h = modelHeight;

		// display object
		this.display = {};

        this.display.days = {
			thousand : new Model(days, "thousand"),
			hundred  : new Model(days, "hundred"),
			ten      : new Model(days, "ten"),
			one      : new Model(days, "one"),
			};

        this.display.hours= {
			ten	: new Model(hours, "ten"),
			one : new Model(hours, "one"),
			};

        this.display.minutes= {
			ten : new Model(minutes, "ten"),
			one : new Model(minutes, "one"),
			};

        this.display.seconds= {
			ten : new Model(seconds, "ten"),
			one : new Model(seconds, "one"),
			};

		d3.selectAll("div.dot").style("width", 10).style("height", modelHeight);
    };

	Clock.normal = function (diffTime) {


        var days, hours, minutes, seconds, remainder;

        remainder = diffTime;

        days = remainder / (1000 * 60 * 60 * 24);
        remainder = remainder % (1000 * 60 * 60 * 24);

        hours = remainder / (1000 * 60 * 60);
        remainder = remainder % (1000 * 60 * 60);

        minutes = remainder / (1000 * 60);
        remainder = remainder % (1000 * 60);

        seconds = remainder / (1000);
        remainder = remainder % (1000);

        days = ~~days;
        hours = ~~hours;
        minutes = ~~minutes;
        seconds = ~~seconds;

        this.display.days.thousand.makeNumber(~~(days/1000));
        this.display.days.hundred.makeNumber(~~(days%1000/100));
        this.display.days.ten.makeNumber(~~(days%100/10));
        this.display.days.one.makeNumber(days%10);

        this.display.hours.ten.makeNumber(~~(hours/10));
        this.display.hours.one.makeNumber(hours%10);

        this.display.minutes.ten.makeNumber(~~(minutes/10));
        this.display.minutes.one.makeNumber(minutes%10);

        this.display.seconds.ten.makeNumber(~~(seconds/10));
        this.display.seconds.one.makeNumber(seconds%10);
	};

	// redraw the clock in interval
    Clock.update= function (targetTime) {
        var nowTime, diffTime;
        nowTime = Date.now();

        if (targetTime <= nowTime ) {
            this.timeUp();
            return;
        }

        diffTime = targetTime - nowTime;

		this.normal(diffTime);
    };

    Clock.timeUp = function () {
        var blink = function () {
            // specify 2 colors
            var colors=[], count=100, dura=100, times=20;
            colors.push("black");
            colors.push("green");

            function anim() {
                d3.select(this).transition().duration(dura).attr("fill", colors[0]);
            }

            // start immediately
            d3.selectAll("rect.background").transition().duration(dura).attr("fill", colors[1]).each("end", anim);

            var i = setInterval(function () {
                d3.selectAll("rect.background").transition().duration(dura).attr("fill", colors[1]).each("end", anim);
            }, dura*2);

            setTimeout(function () {
                clearInterval(i);
            }, dura*2*times);
        }

        if (this.timer!=undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
            blink();
        }
    };

    Clock.run= function (targetTime) {
        var self = this;

		// start immediately
		this.update(targetTime);
        this.timer = setInterval(function () {
            self.update(targetTime);
            },1000);
    };


///testing aread/////////////////////////////
///testing aread/////////////////////////////
///testing aread/////////////////////////////
///testing aread/////////////////////////////

	var data = [
		{text: "Run 350 pack collection", time: new Date(2012, 3, 6).getTime()},
		{text: "ZengQiang's Birthday",  time: new Date(2012, 08, 18).getTime()},
		{text: "Flight to Guangzhou",  time: new Date(2012, 03, 28).getTime()},
		{text: "Xiaomao's Birthday",  time: new Date(2013, 01, 07).getTime()},
	];

	//title
	d3.select("#widget").insert("h1", "#clock").attr("class", "title clock").text(data[0].text+" : You have left");

    Clock.init();
	Clock.run(data[0].time);

	var loadListing = function (data) {
		var listing = d3.select("#widget").append("div").attr("class", "listing").append("ul");
		listing.selectAll("li.item")
				.data(data).enter().append("li")
				.attr("class", function (d, i) {if (i==0) return "selected item";else return "item";})
				.html(function (d) {return "<span class='item_text'>"+d.text+"</span> : <span class='item_time'>"+ new Date(d.time).toDateString()+"</span>";})
				.on("click", function (d) {
					Clock.init();
					Clock.run(d.time);
					d3.select(".clock.title").text(d.text+" : You have left");
					d3.selectAll("li.item").classed("selected", false);
					d3.select(this).classed("selected", true);
				});
	}

	//listing area
	loadListing(data);
})();
