var draggingPoint = -1;
var canvas = null;

var points = null;

function resized() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

function loaded() {
  var cx = window.innerWidth/2;
  var cy = window.innerHeight/2;
  points = [
    new window.bezierjs.Point(cx-50, cy+50),
    new window.bezierjs.Point(cx, cy-50),
    new window.bezierjs.Point(cx+50, cy+50)
  ];
  canvas = document.getElementById('canvas');
  resized();
}

function mouseDown() {
  var pos = new window.bezierjs.Point(event.clientX, event.clientY);
  for (var i = 0, len = points.length; i < len; ++i) {
    if (pos.dist(points[i]) < 15) {
      draggingPoint = i;
      break;
    }
  }
}

function mouseUp() {
  draggingPoint = -1;
}

function mouseMove() {
  if (draggingPoint < 0) {
    return;
  }
  points[draggingPoint] = new window.bezierjs.Point(event.clientX, event.clientY);
  draw();
}

function draw() {
  var ctx = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  
  ctx.strokeStyle = 'black';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5;
  ctx.beginPath();
  
  var bezier = window.bezierjs.makeCurve(points);
  var p0 = bezier(0);
  ctx.moveTo(p0.x, p0.y);
  for (var t = 0.01; t < 1; t += 0.01) {
    var p = bezier(t);
    ctx.lineTo(p.x, p.y);
  }
  ctx.lineTo(bezier(1).x, bezier(1).y);
  ctx.stroke();
  ctx.closePath();
  
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (var i = 0, len = points.length; i < len; ++i) {
    var p = points[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

function addPoint() {
  // TODO: use degree elevation algorithm.
  if (points.length > 7) {
    alert("That's a lot of points. You may proceed but things may get laggy.");
  }
  var usableWidth = window.innerWidth - 200;
  points.push(new window.bezierjs.Point(Math.random()*usableWidth+200,
    Math.random()*window.innerHeight));
  draw();
}

function removePoint() {
  if (points.length > 2) {
    points.splice(points.length-1, 1);
    draw();
  }
}

function rotate() {
  var center = shapeCenter();
  for (var i = 0, len = points.length; i < len; ++i) {
    var p = points[i].subtract(center);
    var newX = -p.y;
    var newY = p.x;
    points[i] = new window.bezierjs.Point(newX, newY).add(center);
  }
  draw();
}

function shapeCenter() {
  var minX = window.innerWidth, minY = window.innerHeight;
  var maxX = 0, maxY = 0;
  for (var i = 0, len = points.length; i < len; ++i) {
    var point = points[i];
    minX = Math.min(point.x, minX);
    minY = Math.min(point.y, minY);
    maxX = Math.max(point.x, maxX);
    maxY = Math.max(point.y, maxY);
  }
  return new window.bezierjs.Point((minX+maxX)/2, (minY+maxY)/2);
}
