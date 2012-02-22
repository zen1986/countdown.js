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
        this.stroke.attr("fill", color);
    }
    
    // number model class constructor 
    var Model = function (container) {
        this.w= 200;
        this.h= 300;
        this.bgColor = "black";
        this.model = container.append("svg:svg")
            .attr("class", "number_model")
            .style("width", this.w)
            .style("height", this.h)
            .style("background-color", this.bgColor);

        // initialize, draw the strokes
        this.initModel();
    };

    Model.prototype.initModel = function () {
        var x = 15, y = 100, z=6, color=this.bgColor;

        var g = this.model.append("svg:g")
                    .attr("transform", "translate(40, 40)");

        var g1 = g.append("svg:g")
                    .attr("transform", "translate(0, "+x+")");
        this.s1 = new Stroke(x, y, z, g1, color);

        var g2 = g.append("svg:g")
                    .attr("transform", "translate(0, "+(y+2*x)+")");
        this.s2 = new Stroke(x, y, z, g2, color);

        var g3 = g.append("svg:g")
                    .attr("transform", "rotate(270) translate(-"+(2*y+3*x)+", "+x+")");
        this.s3 = new Stroke(x, y, z, g3, color);

        var g4 = g.append("svg:g")
                    .attr("transform", "translate("+(x+y)+", "+(y+2*x)+")");
        this.s4 = new Stroke(x, y, z, g4, color);

        var g5 = g.append("svg:g")
                    .attr("transform", "translate("+(x+y)+", "+x+")");
        this.s5 = new Stroke(x, y, z, g5, color);

        var g6 = g.append("svg:g")
                    .attr("transform", "rotate(270) translate(-"+x+", "+x+")");
        this.s6 = new Stroke(x, y, z, g6, color);

        var g7 = g.append("svg:g")
                    .attr("transform", "rotate(270) translate(-"+(y+2*x)+", "+x+")");
        this.s7 = new Stroke(x, y, z, g7, color);

    };

    Model.prototype.makeNumber = function (num) {
        this.fill = "white";

        switch (num) {
            case 0:
                this.s1.fill(this.fill);
                this.s2.fill(this.fill);
                this.s3.fill(this.fill);
                this.s4.fill(this.fill);
                this.s5.fill(this.fill);
                this.s6.fill(this.fill);
                break;
            case 1:
                this.s5.fill(this.fill);
                this.s4.fill(this.fill);
                break;
            case 2:
                this.s6.fill(this.fill);
                this.s5.fill(this.fill);
                this.s7.fill(this.fill);
                this.s2.fill(this.fill);
                this.s3.fill(this.fill);
                break;
            case 3:
                this.s6.fill(this.fill);
                this.s5.fill(this.fill);
                this.s7.fill(this.fill);
                this.s4.fill(this.fill);
                this.s3.fill(this.fill);
                break;
            case 4:
                this.s1.fill(this.fill);
                this.s7.fill(this.fill);
                this.s5.fill(this.fill);
                this.s4.fill(this.fill);
                break;
            case 5:
                this.s6.fill(this.fill);
                this.s1.fill(this.fill);
                this.s7.fill(this.fill);
                this.s4.fill(this.fill);
                this.s3.fill(this.fill);
                break;
            case 6:
                this.s1.fill(this.fill);
                this.s2.fill(this.fill);
                this.s3.fill(this.fill);
                this.s4.fill(this.fill);
                this.s6.fill(this.fill);
                this.s7.fill(this.fill);
                break;
            case 7:
                this.s4.fill(this.fill);
                this.s5.fill(this.fill);
                this.s6.fill(this.fill);
                break;
            case 8:
                this.s1.fill(this.fill);
                this.s2.fill(this.fill);
                this.s3.fill(this.fill);
                this.s4.fill(this.fill);
                this.s5.fill(this.fill);
                this.s6.fill(this.fill);
                this.s7.fill(this.fill);
                break;
            case 9:
                this.s1.fill(this.fill);
                this.s3.fill(this.fill);
                this.s4.fill(this.fill);
                this.s5.fill(this.fill);
                this.s6.fill(this.fill);
                this.s7.fill(this.fill);
                break;
            default:
            break;
        }
    }

    var container = d3.select("#content");
     new Model(container).makeNumber(1);
     new Model(container).makeNumber(2);
     new Model(container).makeNumber(3);
     new Model(container).makeNumber(4);
     new Model(container).makeNumber(5);
     new Model(container).makeNumber(6);
     new Model(container).makeNumber(7);
     new Model(container).makeNumber(8);
     new Model(container).makeNumber(9);

})();
