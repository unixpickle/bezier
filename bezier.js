(function() {

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.dist = function(p) {
    return Math.sqrt(Math.pow(p.x-this.x, 2) + Math.pow(p.y-this.y, 2));
  };

  function pointBetween(p1, p2, t) {
    return new Point(p1.x*(1-t)+p2.x*t, p1.y*(1-t)+p2.y*t);
  }

  function makeCurve(points) {
    // TODO: use the fast formula instead of the recursive formula.
    if (points.length < 1) {
      throw new Error('invalid number of points');
    } else if (points.length === 1) {
      return function(t) {
        return points[0];
      };
    } else {
      var curve1 = makeCurve(points.slice(0, points.length-1));
      var curve2 = makeCurve(points.slice(1));
      return function(t) {
        return pointBetween(curve1(t), curve2(t), t);
      };
    }
  }

  window.bezierjs = {
    Point: Point,
    makeCurve: makeCurve
  }

})();
