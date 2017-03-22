(function ($) {
    $.fn.circleGraphic = function (options) {
        $.fn.circleGraphic.defaults = {
            color: '#F90',
            startAngle: 0,
            //endAngle:50
        };

        var opts = $.extend({}, $.fn.circleGraphic.defaults, options);

        var percentage = this.attr("data-target");
        var ID = "c" + percentage + Math.random();
        //alert(ID);

        this.append("<canvas id='" + ID + "'></canvas>");

        var canvas = document.getElementById(ID),
                context = canvas.getContext('2d');

        var Width = 200;
        this.height(Width);
        var Height = 200;

        canvas.width = Width;
        canvas.height = Height;

        var startAngle = opts.startAngle,
                
                endAngle = percentage / 100,
                angle = startAngle,
                radius = Width * 0.3;

        function drawTrackArc() {
            context.beginPath();
            context.strokeStyle = '#FF0000';
            context.lineWidth = 5;
            context.arc(Width / 2, Height / 2, radius, (Math.PI / 180) * (startAngle * 360 - 90), (Math.PI / 180) * (endAngle * 360 + 270), false);
            context.stroke();
            context.closePath();
        }

        function drawOuterArc(_angle, _color) {
            var angle = _angle;
            var color = _color;
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = 14;
            context.arc(Width / 2, Height / 2, radius, (Math.PI / 180) * (startAngle * 360 - 90), (Math.PI / 180) * (angle * 360 - 90), false);
            context.stroke();
            context.closePath();
        }

        function numOfPercentage(_angle) {
            if (percentage == "0")
            {
            
                var angle = Math.floor(_angle * 100);
//			var color=_color;
                context.font = "25px fantasy";
                context.fillStyle = "black";
                var metrics = context.measureText(angle);
                var textWidth = metrics.width;
                var xPos = Width / 2 - textWidth / 2,
                        yPos = Height / 2 + textWidth / 2;
                context.fillText(angle + "%", xPos, yPos);
            
        }
        else
        {
             var angle = Math.floor(_angle * 100) + 1;
//			var color=_color;
                context.font = "25px fantasy";
                context.fillStyle = "black";
                var metrics = context.measureText(angle);
                var textWidth = metrics.width;
                var xPos = Width / 2 - textWidth / 2,
                        yPos = Height / 2 + textWidth / 2;
                context.fillText(angle + "%", xPos, yPos);
        }
    }
        function draw() {
            var loop = setInterval(function () {
                context.clearRect(0, 0, Width, Height);
                drawTrackArc();
                
                drawOuterArc(angle, opts.color);
                numOfPercentage(angle, opts.color);
                angle += 0.001;
                if (angle > endAngle) {
                    clearInterval(loop);
                }

            }, 100 / 60);
        }
        draw();
        return this;
    };
})(jQuery);