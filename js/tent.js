const OutlineType = {
  Pyramid: "pyramid",
  Dome: "dome",
};

gUsePanelPullouts = true;
gCanvasScale = 1.0;
gXOff = 0;
gDiagonal = false;
function ptX(x) {
  return gXOff + x * gCanvasScale;
}

function ptY(y) {
  return gCanvas.height - y * gCanvasScale - gCanvasBottomPadding;
}

function length(l) {
  return l * gCanvasScale;
}

function setSideXOff(tent) {
  gXOff = (gCanvas.width / 2 - length(tent.maxLength)) / 2;
}

function setFrontXOff(tent, compareTent) {
  gXOff = gCanvas.width * 3/4 -
          length(tent.maxWidth / 2);
  if (tent.outlineType == OutlineType.Dome) {
    gXOff += length(tent.rainflyWidth);
  }
  if (compareTent) {
    gXOff += length(profile.frontSittingOffset(tent) -
                    profile.frontSittingOffset(compareTent));
  }
}

function formatInches(h) {
  var feet = Math.floor(h / 12);
  var inches = Math.round(h - feet * 12);
  if (inches >= 12) {
    feet += 1;
    inches -= 12;
  }
  return feet + "'" + inches + "\"";
}

// Tent contains all information to describe a tent.
//
// There are a few classes of information about each tent:
// - Metadata includes brand, name, weight, etc. This is information about
//   a tent.
// - Usable space data is used for computing the tent's usable state. It is
//   mostly computed from sleepingLength, sittingLength and sittingWidth.
//   isInnerNet and walls also have a small effect.
// - Cosmetic data includes everything else. 
class Tent {
  constructor(brand, name, outlineType, outline, frontOutline, sleepingLength, sittingLength, sittingWidth) {
    // Metadata
    this.brand = brand;
    this.name = name;
    this.isTarp = false;
    this.weight = false;
    this.price = false;
    this.url = false;
    this.panelPullouts = false;
    this.estimated = false;
    this.note = false;
    
    // Usable space data
    this.sleepingLength = sleepingLength;
    this.sittingLength = sittingLength;
    this.sittingWidth = sittingWidth;
    this.isInnerNet = false;
    this.walls = 1;

    // Cosmetic data
    this.outlineType = outlineType;
    this.sideOutline = outline;
    this.frontOutline = frontOutline;
    this.layingHeight = 12;
    this.interiorPeakWidth = 0;
    this.interiorPeakHeight = false;
    this.frontInteriorPeakWidth = 0;
    this.frontInteriorPeakOffset = false;
    this.frontSittingOffset = false;
    this.rainflyWidth = 0;

    // Compute max width and height of this.
    var peakTotal = 0;
    var peakCount = 0;
    var p;
    if (outlineType == OutlineType.Pyramid) {
      this.maxLength = 0;
      this.maxWidth = 0;
      this.maxHeight = 0;
      for (var c = 0; c < outline.length; c++) {
        p = outline[c];
        this.maxHeight = Math.max(this.maxHeight, p[1]);
        this.maxLength = Math.max(this.maxLength, p[0]);
      }

      // Peak offset from the side.
      this.sidePeakOffset = 0;
      peakTotal = 0;
      peakCount = 0;
      for (c = 0; c < outline.length; c++) {
        p = outline[c];
        if (this.maxHeight == p[1]) {
          peakTotal += p[0];
          peakCount++;
        }
      }
      if (peakCount > 0) {
        this.sidePeakOffset = peakTotal / peakCount;
      }

      // Peak offset when facing from the front.
      this.frontPeakOffset = 0;
      peakTotal = 0;
      peakCount = 0;
      for (c = 0; c < frontOutline.length; c++) {
        p = frontOutline[c];
        this.maxWidth = Math.max(this.maxWidth, p[0]);
        if (this.maxHeight == p[1]) {
          peakTotal += p[0];
          peakCount++;
        }
      }
      if (peakCount > 0) {
        this.frontPeakOffset = peakTotal / peakCount;
      }
    } else if (outlineType == OutlineType.Dome) {
      this.maxHeight = outline[1];
      this.maxLength = outline[0];
      this.maxWidth = frontOutline[0];
      this.sidePeakOffset = this.maxLength / 2;
      this.frontPeakOffset = this.maxWidth / 2;
    }

    this.layingLengthStart = 0;
    this.layingLengthEnd = this.maxLength;
    this.sittingWidthStart = 0;
    this.sittingWidthEnd = this.maxWidth;
  }

  setLayingHeight(height) {
    this.layingHeight = height;
    return this;
  }

  setSideFootprint(layingLengthStart, layingLengthEnd) {
    this.layingLengthStart = layingLengthStart;
    this.layingLengthEnd = layingLengthEnd;
    return this;
  }

  setFrontFootprint(sittingWidthStart, sittingWidthEnd) {
    this.sittingWidthStart = sittingWidthStart;
    this.sittingWidthEnd = sittingWidthEnd;
    if (this.outlineType == OutlineType.Pyramid) {
      this.rainflyWidth = sittingWidthStart;
    }
    return this;
  }

  // Interior does not end at top of interior outline.
  setInteriorPeakHeight(interiorPeakHeight) {
    this.interiorPeakHeight = interiorPeakHeight;
    return this;
  }

  // Interior peak is not a point, has width.
  setInteriorPeakWidth(interiorPeakWidth) {
    this.interiorPeakWidth = interiorPeakWidth;
    return this;
  }

  // Interior peak is not a point, has width.
  setFrontInteriorPeakWidth(frontInteriorPeakWidth) {
    this.frontInteriorPeakWidth = frontInteriorPeakWidth;
    return this;
  }

  // Used for mids like Lanshan 1. Left interior area starts here.
  setFrontInteriorPeakOffset(frontInteriorPeakOffset) {
    this.frontInteriorPeakOffset = frontInteriorPeakOffset;
    return this;
  }

  setFrontSittingOffset(frontSittingOffset) {
    this.frontSittingOffset = frontSittingOffset;
    return this;
  }

  setInner(inner) {
    this.isInnerNet = inner;
    return this;
  }

  // Only used for dome tents. Width of rainfly on either end.
  setRainflyWidth(width) {
    this.rainflyWidth = width;
    this.maxWidth += width * 2;
    return this;
  }
    
  setIsTarp() {
    this.isTarp = true;
    return this;
  }

  setWalls(walls) {
    this.walls = walls;
    return this;
  }
  
  setPanelPullouts() {
    this.panelPullouts = true;
    return this;
  }

  setWeight(weight) {
    this.weight = weight;
    return this;
  }

  setPrice(price) {
    this.price = price;
    return this;
  }
  
  setUrl(url) {
    this.url = url;
    return this;
  }
    
  setEstimated() {
    this.estimated = true;
    return this;
  }
  
  addNote(note) {
    this.note = note;
    return this;
  }

  getInteriorPeakHeight() {
    var peak = this.maxHeight;
    if (this.interiorPeakHeight) {
      peak = this.interiorPeakHeight;
    }
    return peak;
  }

  getFrontSittingHeadXs(height) {
    var leftX = 0;
    var rightX = 0;
    var int = 0;
    if (height > this.getInteriorPeakHeight()) {
      return [this.frontPeakOffset, this.frontPeakOffset];
    } else if (height > 36) {
      // Interpolate 36 inches to interior peak.
      int = (height - 36) / (this.getInteriorPeakHeight() - 36);
      var frontPts = this.frontPeakPoints();
      var leftPeak = -1;
      var rightPeak = -1;
      if (frontPts.length == 1) {
        leftPeak = frontPts[0][0];
        rightPeak = frontPts[0][0];
      } else {
        leftPeak = frontPts[0][0];
        rightPeak = frontPts[1][0];
      }
      leftX = (this.frontLeftSittingOffset()) * (1.0 - int) + leftPeak * int;
      rightX = (this.frontRightSittingOffset()) * (1.0 - int) + rightPeak * int;
    } else {
      // Interpolate 0 inches to 36 inches.
      int = height / 36;
      leftX = this.sittingWidthStart * (1.0 - int) +
          this.frontLeftSittingOffset() * int;
      rightX = this.sittingWidthEnd * (1.0 - int) +
          this.frontRightSittingOffset() * int;
    }

    return [leftX, rightX];
  }

  // Returns [extraSideWidth, extraFrontWidth] at a height.
  getExtraHeadWidthsAtHeight(profile, height) {
    var peak = this.getInteriorPeakHeight();
    if (height >= peak) {
      return [-profile.headDiameter, -profile.headDiameter];
    }

    var sideXs = this.getLayingFootAndHeadX([height, height]);
    var headLength = sideXs[1] - sideXs[0];

    var frontXs = this.getFrontSittingHeadXs(profile.sittingHeight);
    var sittingSpot = profile.frontSittingOffset(this);
    var headWidth = Math.min(sittingSpot - frontXs[0], frontXs[1] - sittingSpot) -
        profile.headDiameter / 2;
    headWidth = Math.max(headWidth, -profile.headDiameter);
    return [(headLength - profile.headDiameter) / 2, headWidth];
  }

  getLayingFootAndHeadX(heights) {
    var footHeight = heights[0];
    var headHeight = heights[1];
    var peak = this.maxHeight;
    if (this.interiorPeakHeight) {
      peak = this.interiorPeakHeight;
    }
    if (footHeight >= peak || headHeight >= peak) {
      return [this.sidePeakOffset, this.sidePeakOffset];
    }

    var footXAt12 = (this.maxLength - this.sleepingLength) / 2;
    var headXAt12 = (this.maxLength + this.sleepingLength) / 2;
    if (headXAt12 > this.layingLengthEnd) {
      // Move head inwards to the tent if it's past the laying legnth.
      // Example: TT ProTrail.
      var diff = headXAt12 - this.layingLengthEnd;
      footXAt12 -= diff;
      headXAt12 -= diff;
    }
    if (gUsePanelPullouts && this.panelPullouts) {
      headXAt12 += 2;
      footXAt12 -= 2;
    }

    var footX = 0;
    var int;
    var leftPeak = -1;
    var rightPeak = -1;
    if (footHeight < this.layingHeight) {
      int = footHeight / this.layingHeight;
      footX = this.layingLengthStart * (1.0 - int) + footXAt12 * int;
    } else if (footHeight < 36) {
      int = (footHeight - this.layingHeight) / (36 - this.layingHeight);
      footX = footXAt12 * (1.0 - int) + this.getSideLeftSittingOffset() * int;
    } else {
      int = (footHeight - 36) / (peak - 36);
      var frontPts = this.getSidePeakPoints();
      if (frontPts.length == 1) {
        leftPeak = frontPts[0][0];
        rightPeak = frontPts[0][0];
      } else {
        leftPeak = frontPts[0][0];
        rightPeak = frontPts[1][0];
      }

      footX = this.getSideLeftSittingOffset() * (1.0 - int) + leftPeak * int;
    }

    var headX = 0;
    if (headHeight < this.layingHeight) {
      int = headHeight / this.layingHeight;
      headX = this.layingLengthEnd * (1.0 - int) + headXAt12 * int;
    } else if (headHeight < 36) {
      int = (headHeight - this.layingHeight) / (36 - this.layingHeight);
      headX = headXAt12 * (1.0 - int) + this.getSideRightSittingOffset() * int;
    } else {
      int = (headHeight - 36) / (peak - 36);
      headX = this.getSideRightSittingOffset() * (1.0 - int) + rightPeak * int;
    }
    return [footX, headX];
  }
  
  static rectWithinRect(width, length) {
    function lengthLeftIntersection(angle) {
      var perp = angle + Math.PI / 2;
      return Math.sin(perp) * 7;
    }
    function sleepLengthByTopIntersection(angle) {
      var hl = lengthLeftIntersection(angle);
      var length_remaining = length - hl;
      var slope = Math.tan(angle);
      var run = length_remaining / slope;
      // Length is distance from (0,hl) to (run,length)
      return Math.sqrt(run * run + (hl - length) * (hl - length));
    }
    function runBottomIntersection(angle) {
      var perp = angle - Math.PI / 2;
      return Math.cos(perp) * 7;
    }
    function sleepLengthByRightIntersection(angle) {
      var rb = runBottomIntersection(angle);
      var run_remaining = width - rb;
      var slope = Math.tan(angle);
      var rise = slope * run_remaining;
      // Length is distance from (rb, 0) to (width, rise)
      return Math.sqrt((rb - width) * (rb - width) + rise * rise);
    }
    function sleepingLengthAtAngle(angle) {
      var byTop = sleepLengthByTopIntersection(angle);
      var byRight = sleepLengthByRightIntersection(angle);
      return Math.min(byRight, byTop);
    }
    // Angle is the rotation angle of the inner rectangle w/ 20" width
    // First find max angle 
    var angleA = Math.PI / 2 - 0.001;
    var angleB = Math.PI / 4;
    for (var i = 0; i < 20; i++) {
      var lengthA = sleepingLengthAtAngle(angleA);
      var lengthB = sleepingLengthAtAngle(angleB);
      var mid = (angleA + angleB) / 2;
      if (lengthA > lengthB) {
        angleB = mid;
      } else {
        angleA = mid;
      }
    }
    return sleepingLengthAtAngle(angleA);
  }

  getLayingWidthAtHeight(heights) {
    var xs = this.getLayingFootAndHeadX(heights);
    if (gDiagonal) {
      var width = this.sittingWidthEnd - this.sittingWidthStart;
      var length = this.layingLengthEnd - this.layingLengthStart;
      var diag = Tent.rectWithinRect(width, length);
      if (diag > length * 1.03) {
        return (xs[1] - xs[0]) * (diag / length);
      }
    }
    return xs[1] - xs[0];
  }

  // The interior peak is assumed to be to the right of the middle.
  getSideInteriorPeakOffset() {
    if (this.sidePeakOffset > this.layingLengthEnd) {
      return this.layingLengthEnd;
    } else {
      return this.sidePeakOffset;
    }
  }

  getSidePeakPoints() {
    var interiorHeight = this.maxHeight;
    if (this.interiorPeakHeight) {
      interiorHeight = this.interiorPeakHeight;
    }
    if (this.interiorPeakWidth !== false) {
      return [[this.getSideInteriorPeakOffset() - this.interiorPeakWidth / 2,
               interiorHeight],
              [this.getSideInteriorPeakOffset() + this.interiorPeakWidth / 2,
               interiorHeight]];
    } else {
      return [[this.getSideInteriorPeakOffset(), interiorHeight]];
    }
  }

  getSideLeftSittingOffset() {
    return this.getSideRightSittingOffset() - this.sittingLength;
  }

  getSideRightSittingOffset() {
    var rightOffset = this.getSideInteriorPeakOffset() + this.sittingLength / 2;
    if (rightOffset > this.layingLengthEnd) {
      return this.layingLengthEnd;
    }
    return rightOffset;
  }

  // Returns the middle of the sitting spot from the front.
  frontMiddleOfSittingSpot(profile) {
    if (this.frontInteriorPeakOffset !== false) {
      // Sitting is left aligned.
      var frontXs = this.getFrontSittingHeadXs(profile.sittingHeight);
      return (frontXs[0] + frontXs[1]) / 2;
    } else {
      return this.frontPeakOffset;
    }
  }

  frontMiddleOfSittingPeak() {
    if (this.outlineType == OutlineType.Pyramid) {
      return this.frontPeakOffset;
    } else if (this.outlineType == OutlineType.Dome) {
      return this.frontOutline[0] / 2;
    }
  }

  getFrontInteriorPeakOffset() {
    if (this.frontInteriorPeakOffset !== false) {
      return this.frontInteriorPeakOffset;
    } else {
      return this.frontMiddleOfSittingPeak();
    }
  }

  frontLeftSittingOffset() {
    return this.frontRightSittingOffset() - this.sittingWidth;
  }

  frontRightSittingOffset() {
    if (this.frontSittingOffset) {
      return this.frontSittingOffset;
    } else if (this.frontInteriorPeakOffset !== false) {
      return this.frontInteriorPeakOffset + this.sittingWidth;
    } else {
      return this.frontMiddleOfSittingPeak() + this.sittingWidth / 2;
    }
  }

  frontPeakPoints() {
    var interiorHeight = this.maxHeight;
    if (this.interiorPeakHeight !== false) {
      interiorHeight = this.interiorPeakHeight;
    }

    var points = [];
    if (this.frontInteriorPeakWidth) {
      if (this.frontInteriorPeakOffset) {
        // Offset wide peak, like The One.
        points.push([this.frontInteriorPeakOffset, interiorHeight]);
        points.push([this.getFrontInteriorPeakOffset() + this.frontInteriorPeakWidth,
                     interiorHeight]);
      } else {
        // Centered wide peak, like the Firefly.
        points.push([this.getFrontInteriorPeakOffset() - this.frontInteriorPeakWidth/2,
                     interiorHeight]);
        points.push([this.getFrontInteriorPeakOffset() + this.frontInteriorPeakWidth/2,
                     interiorHeight]);
      }
    } else {
      // Single peak point.
      points.push([this.getFrontInteriorPeakOffset(),
                   interiorHeight]);
    }
    return points;
  }
  
  effectiveLength(profile) {
    var effectiveLength;
    if (profile) {
      effectiveLength = this.getLayingWidthAtHeight(
        profile.sleepingHeights());
    } else {
      effectiveLength = this.sleepingLength;
    }

    if (this.isInnerNet) {
      effectiveLength += 3;
    } else {
      effectiveLength -= (2 - this.walls) * 2;
    }
    return effectiveLength;
  }

  drawFrontUsableArea(strokeColor, fillColor, dashed, hoverName) {
    var ctx = gCanvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(ptX(this.sittingWidthStart),
               ptY(0));
    if (this.sittingWidth > 0) {
      ctx.lineTo(ptX(this.frontLeftSittingOffset()),
                 ptY(36));
    }
    this.frontPeakPoints().forEach(point => {
      ctx.lineTo(ptX(point[0]), ptY(point[1]));
    });
    if (this.sittingWidth > 0) {
      ctx.lineTo(ptX(this.frontRightSittingOffset()),
                 ptY(36));
    }
    ctx.lineTo(ptX(this.sittingWidthEnd),
               ptY(0));
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      var saveWidth = ctx.lineWidth;
      if (strokeColor == "red") {
        ctx.lineWidth = 5;
      }
      ctx.strokeStyle = strokeColor;
      if (dashed) {
        ctx.setLineDash([5, 5]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = saveWidth;
    }

    if (strokeColor) {
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      if (this.sittingWidth > 0) {
        ctx.arc(ptX(this.frontLeftSittingOffset()),
                ptY(36), 3, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ptX(this.frontRightSittingOffset()),
                ptY(36), 3, 0, 2*Math.PI);
      }
      ctx.fill();
    }
    if (hoverName) {
      checkHover(hoverName);
    }
  }

  drawUsableArea(strokeColor, fillColor, dashed, hoverName) {
    var ctx = gCanvas.getContext("2d");

    var xs = this.getLayingFootAndHeadX([this.layingHeight, this.layingHeight]);
    ctx.beginPath();
    ctx.moveTo(ptX(this.layingLengthStart),
               ptY(0));
    ctx.lineTo(ptX(xs[0]),
               ptY(this.layingHeight));
    if (this.sittingWidth > 0) {
      ctx.lineTo(ptX(this.getSideLeftSittingOffset()),
                 ptY(36));
    }
    this.getSidePeakPoints().forEach(point => {
      ctx.lineTo(ptX(point[0]), ptY(point[1]));
    });
    if (this.sittingWidth > 0) {
      ctx.lineTo(ptX(this.getSideRightSittingOffset()),
                 ptY(36));
    }
    ctx.lineTo(ptX(xs[1]),
               ptY(this.layingHeight));
    ctx.lineTo(ptX(this.layingLengthEnd),
               ptY(0));
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      var saveWidth = ctx.lineWidth;
      if (strokeColor == "red") {
        ctx.lineWidth = 5;
      }
      ctx.strokeStyle = strokeColor;
      if (dashed) {
        ctx.setLineDash([5, 5]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = saveWidth;
    }

    if (strokeColor) {
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      if (this.sittingWidth > 0) {
        ctx.arc(ptX(this.getSideLeftSittingOffset()),
                ptY(36), 3, 0, 2*Math.PI);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(ptX(xs[0]),
              ptY(this.layingHeight), 3, 0, 2*Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ptX(xs[1]),
              ptY(this.layingHeight), 3, 0, 2*Math.PI);
      ctx.fill();
      ctx.beginPath();
      if (this.sittingWidth > 0) {
        ctx.arc(ptX(this.getSideRightSittingOffset()),
                ptY(36), 3, 0, 2*Math.PI);
      }
      ctx.fill();
    }
    if (hoverName) {
      checkHover(hoverName);
    }
  }

  drawOutline(outline, strokeColor, fillColor, dashed, hoverName) {
    var ctx = gCanvas.getContext("2d");

    if (this.outlineType == OutlineType.Pyramid) {
      ctx.beginPath();
      ctx.moveTo(ptX(outline[0][0]),
                 ptY(outline[0][1]));
      for (var i = 1; i < outline.length; i++) {
        ctx.lineTo(ptX(outline[i][0]),
                   ptY(outline[i][1]));
      }
    } else if (this.outlineType == OutlineType.Dome) {
      ctx.save();
      ctx.beginPath();
      var yScale = outline[1] / outline[0] * 2;
      ctx.scale(1, yScale);
      ctx.arc(ptX(outline[0] / 2),
              (gCanvas.height - gCanvasBottomPadding) / yScale,
              length(outline[0] / 2),
              Math.PI, 2 * Math.PI);
      ctx.restore();

      if (outline == this.frontOutline && this.rainflyWidth) {
        // Crazy math to find the slope of the line tangent to the ellipse and
        // passing through the rainfly point on the ground.
        var w = outline[0] / 2;
        var h = outline[1];
        var p = (this.rainflyWidth / w + 1);
        var m = Math.sqrt(1/(p*p-1)) * h / w;
        var x = -m*w/h*m*w/h*p/(m*w/h+1) * w;
        var y = m * (x + w + this.rainflyWidth);
  
        ctx.moveTo(ptX(-this.rainflyWidth), ptY(0));
        ctx.lineTo(ptX(x+w), ptY(y));
        ctx.moveTo(ptX(-x+w), ptY(y));
        ctx.lineTo(ptX(outline[0] + this.rainflyWidth), ptY(0));
        ctx.stroke();
      }
    }
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      if (dashed) {
        ctx.setLineDash([5, 5]);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
    }
    if (hoverName) {
      checkHover(hoverName);
    }
  }
}

const HighlightStats = {
  SLEEPING_LENGTH: "sleeping-length",
  HEADROOM_LENGTH: "headroom-length",
  HEADROOM_WIDTH: "headroom-width",
  USABLE_AREA: "usable-area",
  COMPARE_SLEEPING_LENGTH: "compare-sleeping-length",
  COMPARE_HEADROOM_LENGTH: "compare-headroom-length",
  COMPARE_HEADROOM_WIDTH: "compare-headroom-width",
  COMPARE_USABLE_AREA: "compare-usable-area",
};

gHighlightStats = false;
function maybeDrawHighlightStats(tent, compareTent, profile, transparent) {
  if (!gHighlightStats) {
    return;
  }

  var ctx = gCanvas.getContext("2d");
  var saveWidth = ctx.lineWidth;
  ctx.lineWidth = 5;
  if (transparent) {
    ctx.strokeStyle = "#ff000060";
  } else {
    ctx.strokeStyle = "red";
  }

  var xs;
  if (gHighlightStats == HighlightStats.SLEEPING_LENGTH ||
      gHighlightStats == HighlightStats.COMPARE_SLEEPING_LENGTH) {
    var heights = profile.sleepingHeights();
    if (compareTent) {
      setSideXOff(compareTent);
      xs = compareTent.getLayingFootAndHeadX(heights);
    } else {
      setSideXOff(tent);
      xs = tent.getLayingFootAndHeadX(heights);
    }

    ctx.beginPath();
    ctx.moveTo(ptX(xs[0]), ptY(heights[0]));
    ctx.lineTo(ptX((xs[1])), ptY(heights[1]));
    ctx.stroke();
  } else if (gHighlightStats == HighlightStats.HEADROOM_LENGTH ||
             gHighlightStats == HighlightStats.COMPARE_HEADROOM_LENGTH) {
    if (compareTent) {
      setSideXOff(compareTent);
      xs = compareTent.getLayingFootAndHeadX([
          profile.sittingHeight, profile.sittingHeight]);
    } else {
      setSideXOff(tent);
      xs = tent.getLayingFootAndHeadX([
          profile.sittingHeight, profile.sittingHeight]);
    }

    ctx.beginPath();
    ctx.moveTo(ptX(xs[0]), ptY(profile.sittingHeight));
    ctx.lineTo(ptX(xs[1]), ptY(profile.sittingHeight));
    ctx.stroke();
  } else if (gHighlightStats == HighlightStats.HEADROOM_WIDTH ||
             gHighlightStats == HighlightStats.COMPARE_HEADROOM_WIDTH) {
    if (compareTent) {
      setFrontXOff(tent, compareTent);
      xs = compareTent.getFrontSittingHeadXs(profile.sittingHeight);
    } else {
      setFrontXOff(tent);
      xs = tent.getFrontSittingHeadXs(profile.sittingHeight);
    }
    ctx.beginPath();
    ctx.moveTo(ptX(xs[0]), ptY(profile.sittingHeight));
    ctx.lineTo(ptX(xs[1]), ptY(profile.sittingHeight));
    ctx.stroke();
  }


  ctx.lineWidth = saveWidth;
}

var gHoverX = false;
var gHoverY = false;
var gLastHoverName = false;
function updateHover(x, y) {
  gHoverX = x;
  gHoverY = y;
}

function maybeDrawHover() {
  if (!gLastHoverName) {
    return;
  }

  var ctx = gCanvas.getContext("2d");
  ctx.font = "12px verdana";
  var m = ctx.measureText(gLastHoverName);
  ctx.beginPath();
  ctx.rect(gHoverX - m.width / 2 - 5,
           gHoverY + 27 - m.actualBoundingBoxAscent,
           m.width + 10,
           m.actualBoundingBoxAscent + m.actualBoundingBoxDescent + 6);
  ctx.fillStyle = "#cccccccc";
  ctx.strokeStyle = "#333";
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(gLastHoverName, gHoverX, gHoverY + 30);

}

function checkHover(hoverName) {
  var ctx = gCanvas.getContext("2d");
  if (gHoverX && ctx.isPointInPath(gHoverX, gHoverY)) {
    if (gLastHoverName && gLastHoverName.includes("Usable Area") &&
        hoverName.includes("Usable Area")) {
      gLastHoverName = "Shared Usable Area";
    } else if (gLastHoverName && hoverName.includes("Interior")) {
      // Interior over-rides interior.
      if (gLastHoverName.includes("Interior")) {
        gLastHoverName = "Shared Interior";
      }
    } else {
      gLastHoverName = hoverName;
    }
  }
}

function drawTent(name, compareName, profile) {
  gLastHoverName = false;
  var tent = gTents[name];
  if (!tent) {
    return;
  }

  var shouldDrawTent = true;
  var shouldDrawCompare = false;
  var compareTent = false;
  if (compareName && compareName != 'None') {
    compareTent = gTents[compareName];
    if (!compareTent) {
      return;
    }
    shouldDrawCompare = true;
  }
  if (gHighlightStats) {
    if (gHighlightStats.toString().startsWith("compare")) {
      shouldDrawTent = false;
    } else {
      shouldDrawCompare = false;
    }
  }

  // Resize canvas heights.
  var maxLength = tent.maxLength;
  if (compareTent) {
    maxLength = Math.max(maxLength, compareTent.maxLength);
  }
  var maxHeight = tent.maxHeight;
  if (compareTent) {
    maxHeight = Math.max(maxHeight, compareTent.maxHeight);
  }
  if (maxLength > 0 && maxHeight > 0) {
    gCanvas.height = gCanvas.width * maxHeight / maxLength / 2;
  }

  // Rescale to fit in canvas.
  gCanvasScale = Math.min(
      (gCanvas.height - gCanvasBottomPadding) / tent.maxHeight,
      gCanvas.width / tent.maxWidth / 2.05,
      gCanvas.width / tent.maxLength / 2.05) / 1.05;

  // Clear canvas.
  var ctx = gCanvas.getContext("2d");
  ctx.clearRect(0, 0, gCanvas.width, gCanvas.height);

  if (compareTent) {
    var alternateScale = Math.min((gCanvas.height - gCanvasBottomPadding) / compareTent.maxHeight, gCanvas.width / compareTent.maxLength) / 1.05;
    gCanvasScale = Math.min(gCanvasScale, alternateScale);
  }

  // Draw side view fills.
  if (shouldDrawCompare) {
    setSideXOff(compareTent);
    compareTent.drawUsableArea(
        false, "#ddd", false, compareName + " Usable Area");
  }
  if (shouldDrawTent) {
    setSideXOff(tent);
    tent.drawUsableArea(
        false, "#50b42a80", false, name + " Usable Area");
  }

  // Draw front view fills.
  if (shouldDrawCompare) {
    setFrontXOff(tent, compareTent);
    compareTent.drawFrontUsableArea(false, "#ddd", false, compareName + " Usable Area");  // fill
  }
  if (shouldDrawTent) {
    setFrontXOff(tent);
    tent.drawFrontUsableArea(false, "#50b42a80", false, name + " Usable Area");
  }

  if (gHighlightStats.toString().startsWith("compare")) {
    maybeDrawHighlightStats(tent, compareTent, profile);
  } else {
    maybeDrawHighlightStats(tent, false, profile);
  }

  // Draw person.
  setSideXOff(tent);
  profile.drawPad(tent);
  profile.drawBag(tent);
  profile.drawLayingPerson(tent);

  setSideXOff(tent);
  gXOff += length(profile.sideSittingOffset(tent));
  profile.drawSittingPerson(gCanvas, tent);

  setFrontXOff(tent);
  gXOff += length(profile.frontSittingOffset(tent));
  profile.drawSittingPerson(gCanvas, tent);

  // Side view strokes.
  if (shouldDrawCompare) {
    setSideXOff(compareTent);
    compareTent.drawOutline(
        compareTent.sideOutline, "indigo", false, true,
        compareName + " Interior");
    if (gHighlightStats == HighlightStats.COMPARE_USABLE_AREA) {
      compareTent.drawUsableArea("red", false, true);
    } else {
      compareTent.drawUsableArea("darkorchid", false, true);
    }
  }
  if (shouldDrawTent) {
    setSideXOff(tent);
    tent.drawOutline(tent.sideOutline, "#536C4A", false, false, name + " Interior");
    if (gHighlightStats == HighlightStats.USABLE_AREA) {
      tent.drawUsableArea("red", false);
    } else {
      tent.drawUsableArea("#306C19", false);
    }
  }

  // Front view strokes
  if (shouldDrawCompare) {
    setFrontXOff(tent, compareTent);
    compareTent.drawOutline(compareTent.frontOutline, "indigo", false, true, compareName + " Interior"); 
    if (gHighlightStats == HighlightStats.COMPARE_USABLE_AREA) {
      compareTent.drawFrontUsableArea("red", false, true);
    } else {
      compareTent.drawFrontUsableArea("darkorchid", false, true);
    }
  }
  if (shouldDrawTent) {
    setFrontXOff(tent);

    tent.drawOutline(tent.frontOutline, "#536C4A", false, false, name + " Interior");
    if (gHighlightStats == HighlightStats.USABLE_AREA) {
      tent.drawFrontUsableArea("red", false);
    } else {
      tent.drawFrontUsableArea("#306C19", false);
    }
  }

  if (gHighlightStats.toString().startsWith("compare")) {
    maybeDrawHighlightStats(tent, compareTent, profile, true);
  } else {
    maybeDrawHighlightStats(tent, false, profile, true);
  }

  // Draw ground
  ctx.beginPath();
  ctx.moveTo(0, ptY(0));
  ctx.lineTo(gCanvas.width, ptY(0));
  ctx.strokeStyle = "#333";
  ctx.stroke();

  maybeDrawHover();
}

