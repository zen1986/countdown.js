(function () {
    // my namespace
    var Countdown = {};
    
    // stroke class constructor
    var Stroke = function (x,y,z,g,color) {
        this.stroke = g.append("svg:rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", x)
            .attr("height", y)
            .attr("rx", z)
            .attr("fill", color)
            .attr("ry", z);
    };

    Stroke.prototype.fill = function (color) {
        if (color) {
            this.stroke.attr("opacity", 1);
            this.stroke.attr("fill", color);
        }
        else
            this.stroke.attr("opacity", 0);

    }
    
    // number model class constructor 
    var Model = function (container, clas) {
        this.w= 100;
        this.h= 150;
        this.bgColor = "black";
        this.model = container.append("svg:svg")
            .style("width", this.w)
            .style("height", this.h);

        // background
        this.bg = this.model.append("svg:rect")
            .attr("class", "background")
            .attr("width", this.w)
            .attr("height", this.h)
            .attr("fill", this.bgColor);

        if (clas) this.model.attr("class", clas);

        // initialize, draw the strokes
        this.initModel();
        this.makeNumber(0);
    };

    Model.prototype.initModel = function () {
        var x = this.w/10, y = this.h/3, z=x, m=(this.w - 2*y+3*x)/2, color=this.bgColor;

        this.strokes =new Array(8); 

        var g = this.model.append("svg:g")
                    .attr("transform", "translate("+m+","+m+")");

        var g1 = g.append("svg:g")
                    .attr("transform", "translate(0, "+x+")");
        this.strokes[1] = new Stroke(x, y, z, g1, color);

        var g2 = g.append("svg:g")
                    .attr("transform", "translate(0, "+(y+2*x)+")");
        this.strokes[2] = new Stroke(x, y, z, g2, color);

        var g3 = g.append("svg:g")
                    .attr("transform", "rotate(270) translate(-"+(2*y+3*x)+", "+x+")");
        this.strokes[3] = new Stroke(x, y, z, g3, color);

        var g4 = g.append("svg:g")
                    .attr("transform", "translate("+(x+y)+", "+(y+2*x)+")");
        this.strokes[4] = new Stroke(x, y, z, g4, color);

        var g5 = g.append("svg:g")
                    .attr("transform", "translate("+(x+y)+", "+x+")");
        this.strokes[5] = new Stroke(x, y, z, g5, color);

        var g6 = g.append("svg:g")
                    .attr("transform", "rotate(270) translate(-"+x+", "+x+")");
        this.strokes[6] = new Stroke(x, y, z, g6, color);

        var g7 = g.append("svg:g")
                    .attr("transform", "rotate(270) translate(-"+(y+2*x)+", "+x+")");
        this.strokes[7] = new Stroke(x, y, z, g7, color);

    };

    Model.prototype.makeNumber = function (num) {
        var strokesOn;
        this.fill = "white";

        switch (num) {
            case 0:
                strokesOn = [1,2,3,4,5,6];
                break;
            case 1:
                strokesOn = [5,4];
                break;
            case 2:
                strokesOn = [6,7,2,3,5];
                break;
            case 3:
                strokesOn = [6,7,5,3,4];
                break;
            case 4:
                strokesOn = [1,7,5,4];
                break;
            case 5:
                strokesOn = [6,1,7,3,4];
                break;
            case 6:
                strokesOn = [2,1,5,3,4,6,7];
                break;
            case 7:
                strokesOn = [4,6,5];
                break;
            case 8:
                strokesOn = [2,1,5,3,4,6,7];
                break;
            case 9:
                strokesOn = [1,5,3,4,6,7];
                break;
            default:
                break;
        }

        var self=this;
        // reset first
        this.strokes.forEach(function (s) {s.fill();});
        strokesOn.forEach(function (s) {self.strokes[s].fill(self.fill);});
    }

    Countdown.init = function () {
        var clock, days, hours, minutes, seconds;

        clock = d3.select("body").append("div").attr("class", "clock");
        days = clock.append("div").attr("class", "days");
        hours = clock.append("div").attr("class", "hours");
        minutes = clock.append("div").attr("class", "minutes");
        seconds = clock.append("div").attr("class", "seconds");
        
        this.clock = {};

        this.clock.blink = function () {
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

        this.clock.days = {};
        this.clock.days.thousand = new Model(days, "thousand");
        this.clock.days.hundred= new Model(days, "hundred");
        this.clock.days.ten= new Model(days, "ten");
        this.clock.days.one= new Model(days, "one");

        this.clock.hours= {};
        this.clock.hours.ten= new Model(hours, "ten");
        this.clock.hours.one= new Model(hours, "one");

        this.clock.minutes= {};
        this.clock.minutes.ten = new Model(minutes, "ten");
        this.clock.minutes.one = new Model(minutes, "one");

        this.clock.seconds= {};
        this.clock.seconds.ten = new Model(seconds, "ten");
        this.clock.seconds.one = new Model(seconds, "one");
    };

    Countdown.updateClock = function (targetTime) {
        var nowTime, diffTime;
        nowTime = Date.now();

        if (targetTime <= nowTime ) {
            this.timeUp();
            return;
        }

        diffTime = targetTime - nowTime;

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

        this.clock.days.thousand.makeNumber(~~(days/1000));
        this.clock.days.hundred.makeNumber(~~(days%1000/100));
        this.clock.days.ten.makeNumber(~~(days%100/10));
        this.clock.days.one.makeNumber(days%10);

        this.clock.hours.ten.makeNumber(~~(hours/10));
        this.clock.hours.one.makeNumber(hours%10);

        this.clock.minutes.ten.makeNumber(~~(minutes/10));
        this.clock.minutes.one.makeNumber(minutes%10);

        this.clock.seconds.ten.makeNumber(~~(seconds/10));
        this.clock.seconds.one.makeNumber(seconds%10);
    }


    Countdown.timeUp = function () {
        if (this.timer!=undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
            this.clock.blink();
        }
    }

    Countdown.runClock = function (date) {
        var self = this;
        var targetTime = date.getTime();
        this.timer = setInterval(function () {
            self.updateClock(targetTime);
            },1000);
    }


    var date = new Date(2012, 1, 23, 18, 21);
    Countdown.init();
    Countdown.runClock(date);
})();
