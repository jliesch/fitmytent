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

class Profile {
  constructor(height, loft, padHeight, footLength, sittingHeight, shoulderWidth) {
    this.height = height;
    this.shoulderWidth = shoulderWidth;
    this.sittingHeight = sittingHeight;
    this.headDiameter = 7;
    this.footLength = footLength;
    this.loft = loft;
    this.padHeight = padHeight;
  }

  sideSittingOffset(tent) {
    var height = Math.min(this.sittingHeight, tent.maxHeight - 1);
    var sideXs = tent.getLayingFootAndHeadX(
        [height, height]);
    var offset = (sideXs[0] + sideXs[1]) / 2;
    if (tent.layingLengthEnd &&
        (offset + this.shoulderWidth / 2 > tent.layingLengthEnd)) {
      offset = tent.layingLengthEnd  - this.shoulderWidth / 2;
    }
    return offset;
  }

  frontSittingOffset(tent) {
    // For the front facing sitting, sit the person in the middle. Or up against
    // the start of the sitting area.
    if (tent.frontSittingOffset) {
      return tent.frontSittingOffset - this.shoulderWidth / 2;
    }
    var sittingOffset = tent.frontMiddleOfSittingSpot(this);
    if (sittingOffset - this.shoulderWidth / 2 < tent.sittingWidthStart) {
      sittingOffset = tent.sittingWidthStart + this.shoulderWidth / 2;
    }
    return sittingOffset;
  }

  sleepingLength() {
    return this.height + this.loft * 1.5;
  }

  sleepingHeights() {
    return [this.padHeight + this.footLength + this.loft * 2/3,
            this.padHeight + this.headDiameter + this.loft * 2/3];
  }

  drawPad(tent) {
    if (this.padHeight <= 0) {
      return;
    }

    var ctx = gCanvas.getContext("2d");

    var xs = tent.getLayingFootAndHeadX(this.sleepingHeights());
    var mid = (xs[0] + xs[1]) / 2;
    ctx.beginPath();
    var padLength = this.height + this.loft * 2 + 4;
    ctx.rect(ptX(mid - padLength / 2),
             ptY(this.padHeight),
             length(padLength),
             length(this.padHeight));
    ctx.fillStyle = "#ffff60";
    ctx.fill();
    ctx.strokeStyle = "#555";
    ctx.stroke();

    checkHover("Sleeping Pad");
  }

  drawBag(tent) {
    var ctx = gCanvas.getContext("2d");

    var xs = tent.getLayingFootAndHeadX(this.sleepingHeights());
    var mid = (xs[0] + xs[1]) / 2;
    ctx.beginPath();
    ctx.moveTo(ptX(mid - this.height / 2 - this.loft),
               ptY(this.padHeight));
    ctx.lineTo(ptX(mid - this.height / 2 - this.loft),
               ptY(this.padHeight + this.footLength + this.loft));
    ctx.lineTo(ptX(mid - this.height / 2 + this.loft),
               ptY(this.padHeight + this.footLength + this.loft));
    ctx.lineTo(ptX(mid - this.height / 2 + 4 + this.loft),
               ptY(this.padHeight + this.headDiameter * 0.6 + this.loft));
    ctx.lineTo(ptX(mid + this.height / 2 - this.headDiameter - 2 - this.loft),
               ptY(this.padHeight + this.headDiameter * 0.7 + this.loft));
    ctx.lineTo(ptX(mid + this.height / 2 - this.headDiameter - this.loft),
               ptY(this.padHeight + this.headDiameter + this.loft));
    ctx.lineTo(ptX(mid + this.height / 2 - 3 + this.loft),
               ptY(this.padHeight + this.headDiameter + this.loft));
    ctx.lineTo(ptX(mid + this.height / 2 + this.loft),
               ptY(this.padHeight + this.headDiameter - 3 + this.loft));
    ctx.lineTo(ptX(mid + this.height / 2 + this.loft),
               ptY(this.padHeight));
    ctx.lineTo(ptX(mid - this.height / 2 - this.loft),
               ptY(this.padHeight));
    ctx.fillStyle = "lightblue";
    ctx.fill();
    ctx.strokeStyle = "#555";
    ctx.stroke();

    checkHover("Sleeping Bag");
  }

  drawLayingPerson(tent) {
    var ctx = gCanvas.getContext("2d");

    var xs = tent.getLayingFootAndHeadX(this.sleepingHeights());
    var mid = (xs[0] + xs[1]) / 2;
    ctx.beginPath();
    ctx.moveTo(ptX(mid - this.height / 2),
               ptY(this.padHeight));
    ctx.lineTo(ptX(mid - this.height / 2),
               ptY(this.padHeight + this.footLength));
    ctx.lineTo(ptX(mid - this.height / 2 + 4),
               ptY(this.padHeight + this.headDiameter * 0.6));
    ctx.lineTo(ptX(mid + this.height / 2 - this.headDiameter - 2),
               ptY(this.padHeight + this.headDiameter * 0.7));
    ctx.lineTo(ptX(mid + this.height / 2 - this.headDiameter),
               ptY(this.padHeight + this.headDiameter));
    ctx.lineTo(ptX(mid + this.height / 2 - 2),
               ptY(this.padHeight + this.headDiameter));
    ctx.lineTo(ptX(mid + this.height / 2),
               ptY(this.padHeight + this.headDiameter - 2));
    ctx.lineTo(ptX(mid + this.height / 2),
               ptY(this.padHeight));
    ctx.lineTo(ptX(mid - this.height / 2),
               ptY(this.padHeight));
    ctx.fillStyle = "lightgray";
    ctx.fill();
    ctx.strokeStyle = "#555";
    ctx.stroke();
    checkHover("You!");
  }

  drawSittingPerson(canvas, tent) {
    var ctx = canvas.getContext("2d");

    var shoulderWidth = this.shoulderWidth / 2;
    var headHeight = 9;
    var shoulderHeight = 10;
    ctx.beginPath();
    // Top left of head.
    ctx.moveTo(ptX(-this.headDiameter / 2 * 0.6),
               ptY(this.sittingHeight));
    ctx.lineTo(ptX(this.headDiameter / 2 * 0.6),
               ptY(this.sittingHeight));
    ctx.lineTo(ptX(this.headDiameter / 2),
               ptY(this.sittingHeight - 2));
    ctx.lineTo(ptX(this.headDiameter / 2),
               ptY(this.sittingHeight - headHeight + headHeight / 3));
    // Neck.
    ctx.lineTo(ptX(this.headDiameter / 2 * 0.7),
               ptY(this.sittingHeight - headHeight + 1));
    ctx.lineTo(ptX(this.headDiameter / 2),
               ptY(this.sittingHeight - headHeight));
    // Shoulder
    ctx.lineTo(ptX(shoulderWidth),
               ptY(this.sittingHeight - shoulderHeight));
    ctx.lineTo(ptX(shoulderWidth),
               ptY((this.sittingHeight - shoulderHeight) * 0.8));
    // Waist.
    ctx.lineTo(ptX(shoulderWidth * 0.5),
               ptY((this.sittingHeight - shoulderHeight) * 0.4));
    // Legs.
    ctx.lineTo(ptX(shoulderWidth),
               ptY((this.sittingHeight - shoulderHeight) * 0.2));
    ctx.lineTo(ptX( shoulderWidth),
               ptY(0));
    ctx.lineTo(ptX(-shoulderWidth),
               ptY(0));
    ctx.lineTo(ptX(-shoulderWidth),
               ptY((this.sittingHeight - shoulderHeight) * 0.2));
    ctx.lineTo(ptX(-shoulderWidth * 0.5),
               ptY((this.sittingHeight - shoulderHeight) * 0.4));
    ctx.lineTo(ptX(-shoulderWidth),
               ptY((this.sittingHeight - shoulderHeight) * 0.8));
    ctx.lineTo(ptX(-shoulderWidth),
               ptY(this.sittingHeight - shoulderHeight));
    // Neck.
    ctx.lineTo(ptX(-this.headDiameter / 2),
               ptY(this.sittingHeight - headHeight));
    ctx.lineTo(ptX(-this.headDiameter / 2 * 0.7),
               ptY(this.sittingHeight - headHeight + 1));
    // Start of left head
    ctx.lineTo(ptX(-this.headDiameter / 2),
               ptY(this.sittingHeight - headHeight + headHeight / 3));
    ctx.lineTo(ptX(-this.headDiameter / 2),
               ptY(this.sittingHeight - 2));
    ctx.lineTo(ptX(-this.headDiameter / 2 * 0.6),
               ptY(this.sittingHeight));
    ctx.fillStyle = "lightgray";
    ctx.fill();
    ctx.strokeStyle = "#555";
    ctx.stroke();

    checkHover("You!");
  }
}

class Tent {
  constructor(brand, name, outlineType, outline, frontOutline, sleepingLength, sittingLength, sittingWidth) {
    this.brand = brand;
    this.name = name;
    this.outlineType = outlineType;
    this.sideOutline = outline;
    this.frontOutline = frontOutline;
    this.sleepingLength = sleepingLength;
    this.sittingLength = sittingLength;
    this.sittingWidth = sittingWidth;
    this.layingHeight = 12;
    this.interiorPeakWidth = 0;
    this.interiorPeakHeight = false;
    this.frontInteriorPeakWidth = 0;
    this.frontInteriorPeakOffset = false;
    this.frontSittingOffset = false;
    this.isInnerNet = false;
    this.rainflyWidth = 0;
    this.isTarp = false;
    this.walls = 1;
    this.panelPullouts = false;
    this.weight = false;
    this.price = false;
    this.url = false;
    this.estimated = false;
    this.note = false;

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

gBrandAbbreviations = {
  "Hyperlight Mountain Gear": "HMG",
  "Mountain Laurel Designs": "MLD",
  "Six Moon Designs": "SMD",
};
function brandAbbreviation(brand) {
  if (brand in gBrandAbbreviations) {
    return gBrandAbbreviations[brand];
  } else {
    return brand;
  }
}

var gTents = {
  "3F UL Lanshan 1 Pro":
    new Tent("3F UL", "Lanshan 1 Pro", OutlineType.Pyramid,
             [[7.75,0], [0,6], [53, 49], [106,6], [98.25, 0]],
             [[27.5,0], [0,10], [27.5,49], [77,6], [70.75,0]],
             76, 27.75, 14)
             .setSideFootprint(7.75, 98.25)
             .setFrontFootprint(27.5, 59)  // 31.5
             .setPanelPullouts()
             .setFrontInteriorPeakOffset(27.5)
             .setWeight(24)
             .setPrice(158)
             .setUrl("http://3fulgear.com/index.php/product/lanshan-1-pro/")
             .addNote("Sitting width is estimated"),
  "3F UL Lanshan 2 Pro":
    new Tent("3F UL", "Lanshan 2 Pro", OutlineType.Pyramid,
             [[7.75,0], [0,6], [53, 47.25], [106,6], [98.25, 0]],
             [[27.5,0], [0,10], [27.5,47.25], [74.5,47.25], [102,6], [74.5,0]],
             76, 27.75, 47)
             .setSideFootprint(7.75, 98.25)
             .setFrontFootprint(27.5, 74.5)  // 47
             .setFrontInteriorPeakWidth(47)
             .setPanelPullouts()
             .setWeight(32.25)
             .setPrice(178)
             .setEstimated()
             .setUrl("http://3fulgear.com/index.php/product/lanshan-2-pro/"),
  "BA Copper Spur HV UL2":
    new Tent("Big Agnes", "Copper Spur HV UL2", OutlineType.Dome,
             [88, 40], // length, height
             [52, 40],  // width, height
             76, 41, 36.5)  // usable dimension
             .setRainflyWidth(23)
             .setWalls(2)
             .setWeight(43)
             .setPrice(449.95)
             .setUrl("https://www.bigagnes.com/Copper-Spur-HV-UL2-2020"),
  "BA Fly Creek HV UL2":
    new Tent("Big Agnes", "Fly Creek HV UL2", OutlineType.Dome,
             [86, 40],
             [52,40],
             75.8, 32, 23.5)  // usable dimension
             .setWalls(2)
             .setWeight(31)
             .setPrice(349.95)
             .setUrl("https://www.bigagnes.com/Fly-Creek-HV-UL2-Person?quantity=1&custcol8=144"),
  "BA Tiger Wall UL2":
    new Tent("Big Agnes", "Tiger Wall UL2", OutlineType.Dome,
             [86, 39],
             [52, 39],
             72, 39.75, 30)  // usable dimension
             .setWalls(2)
             .setRainflyWidth(21)
             .setWeight(35)
             .setPrice(399.95)
             .setUrl("https://www.bigagnes.com/Tiger-Wall-UL2"),
  "X-Mid 1p Inner":
    new Tent("Durston", "X-Mid 1p Inner", OutlineType.Pyramid,
             [[0,0], [21.625, 43], [64.875, 43], [86.5, 0]],
             [[0,0], [2,43], [26,43], [28,0]],
             74, 30, 12)  // usable dimension
             .setInner(true)
             .setFrontInteriorPeakWidth(9)
             .setWalls(2)
             .setWeight(9.9)
             .setPrice(220)
             .setUrl("https://durstongear.com/product/x-mid-1p"),
  "X-Mid 1p Tarp":
    new Tent("Durston", "X-Mid 1p Tarp", OutlineType.Pyramid,
             [[0,0], [28, 46], [72, 46], [100, 0]],
             [[0,0], [22, 46], [45, 46], [67,0]],
             83, 51, 20)  // usable dimension
             .setFrontFootprint(8, 59)
             .setFrontInteriorPeakWidth(12)
             .setIsTarp()
             .setWeight(18)
             .setPrice(220)
             .setUrl("https://durstongear.com/product/x-mid-1p"),
  "X-Mid 2p Inner":
    new Tent("Durston", "X-Mid 2p Inner", OutlineType.Pyramid,
             [[0,0], [23, 44], [69, 44], [92, 0]],
             [[0,0], [4,44], [46,44], [50,0]],
             76.25, 54, 17)  // usable dimension
             .setInner(true)
             .setFrontInteriorPeakWidth(54)
             .setWalls(2)
             .setWeight(15.5)
             .setPrice(300)
             .setUrl("https://durstongear.com/product/x-mid-2p"),
   "X-Mid 2p Pro":
    new Tent("Durston", "X-Mid 2p Pro", OutlineType.Pyramid,
             [[0,0], [23, 44], [69, 44], [92, 0]],
             [[0,0], [4,44], [46,44], [50,0]],
             83.5, 56, 25)  // usable dimension
             .setFrontInteriorPeakWidth(56)
             .setWeight(20.4)
             .setPrice(300)
             .setUrl("https://durstongear.com/product/x-mid-pro-2p"),
 "X-Mid 2p Tarp":
    new Tent("Durston", "X-Mid 2p Tarp", OutlineType.Pyramid,
             [[0,0], [22, 47], [80, 47], [102, 0]],
             [[0,0], [26,47], [63,47], [88,0]],
             90, 58, 28.5)  // usable dimension
             .setFrontFootprint(15, 73)
             .setFrontInteriorPeakWidth(58)
             .setIsTarp()
             .setWeight(22)
             .setPrice(300)
             .setUrl("https://durstongear.com/product/x-mid-2p"),
  "Generic A-Frame":
    new Tent("Generic", "A-Frame", OutlineType.Pyramid,
             [[0,6], [0, 49], [108, 49], [108,6], [0,6]],
             [[0,6], [27,49], [54,6], [0,6]],
             84, 84, 17.25)  // usable dimension
             .setSideFootprint(12, 96)
             .setFrontFootprint(6, 48)
             .setRainflyWidth(0)
             .setInteriorPeakWidth(84)
             .setIsTarp()
             .setWeight(11.5)
             .setPrice(100),
  "Generic Dome":
    new Tent("Generic", "Dome", OutlineType.Dome,
             [90, 42],
             [54, 42],
             77.62, 37.09, 30.60),  // Generic values will be overridden.
  "Generic Pyramid":
    new Tent("Generic", "Pyramid", OutlineType.Pyramid,
             [[0,0], [50, 49], [100,0]],
             [[0,0], [64 * 1/3,49], [64,0]],
             70, 20, 10)  // Generic values will be overridden.
             .setFrontInteriorPeakOffset(64 * 1/3),
  "GG The One":
    new Tent("Gossamer Gear", "The One (2020)", OutlineType.Pyramid,
             [[6,0], [0,6], [55, 46], [110, 6], [104, 0]],
             [[26,0], [0,6], [19.5,46], [59.5,46], [69.5, 30], [53,0]],
             79.3, 29, 42)  // usable dimension
             .setSideFootprint(6, 104)
             .setFrontFootprint(26, 53)  // 27
             .setPanelPullouts()
             .setFrontInteriorPeakWidth(40)
             .setWeight(17.7)
             .setPrice(299.25)
             .setUrl("https://www.gossamergear.com/products/the-one"),
  "HMG Ultamid 2":
    new Tent("Hyperlight Mountain Gear", "Ultamid 2", OutlineType.Pyramid,
             [[0,3], [53.5, 64], [107, 3], [0,3]],
             [[0,3], [43.5,64], [87,3], [0,3]],
             95, 53, 43)  // usable dimension
             .setIsTarp()
             .setWeight(17.72)
             .setPrice(735)
             .setUrl("https://www.hyperlitemountaingear.com/products/ultamid-2-ultralight-pyramid-tent")
             .setEstimated()
             .addNote("Pitched using 8 stakes. 4 on the corners and one pulling out each edge."),
  "HMG Ultamid 4":
    new Tent("Hyperlight Mountain Gear", "Ultamid 4", OutlineType.Pyramid,
             [[0,3], [55.5, 75], [111, 3], [0,3]],
             [[0,3], [55.5,75], [111,3], [0,3]],
             105, 73, 73)  // usable dimension
             .setIsTarp()
             .setWeight(23)
             .setPrice(890)
             .setUrl("https://www.hyperlitemountaingear.com/products/ultamid-4-ultralight-pyramid-tent")
             .addNote("Pitched using 8 stakes. 4 on the corners and one pulling out each edge."),
  "LHG Duo":
    new Tent("LightHeart Gear", "Duo", OutlineType.Pyramid,
             [[0,0], [0, 10], [50, 45], [100, 10], [100, 0]],
             [[16,0], [0, 6], [37.5,45], [49.5,45], [87,6], [71,0]],
             89, 27, 23.5)  // usable dimension
             .setSideFootprint(0, 100)
             .setFrontFootprint(16, 71) // 55
             .setFrontInteriorPeakWidth(12)
             .setWeight(36)
             .setPrice(315)
             .setUrl("https://lightheartgear.com/products/lightheart-duo-tent"),
  "LHG Firefly":
    new Tent("LightHeart Gear", "Firefly", OutlineType.Pyramid,
             [[0,0], [0, 10], [60, 45], [105, 5], [105, 0]],
             [[12,0], [0,6], [30.5,45], [48.5,45], [79,6], [67,0]],
             84.8, 27, 25.25)  // usable dimension
             .setSideFootprint(0, 100)
             .setFrontFootprint(24.5, 54.5) // 30
             .setFrontInteriorPeakWidth(18)
             .setWalls(1.5)
             .setWeight(27.5)
             .setPrice(290)
             .setUrl("https://lightheartgear.com/collections/tents/products/copy-of-lightheart-firefly-awning-tent"),
  "LHG SoLong 6":
    new Tent("LightHeart Gear", "SoLong 6", OutlineType.Pyramid,
             [[0,0], [0, 10], [50, 45], [100, 10], [100, 0]],
             [[12,0], [0, 6], [30.5,45], [48.5,45], [79,6], [67,0]],
             91.8, 29.25, 24.25)  // usable dimension
             .setSideFootprint(0, 100)
             .setFrontFootprint(18.25, 60.75) // 55 42.5
             .setFrontInteriorPeakWidth(18)
             .setWeight(32)
             .setPrice(315)
             .setUrl("https://lightheartgear.com/collections/tents/products/lightheart-solong-6-sil-poly-fabric"),
  "Marmot Tungsten 2p UL":
    new Tent("Marmot", "Tungsten 2p UL", OutlineType.Dome,
             [88, 42], // length, height
             [54, 42],  // width, height
             76, 41.5, 36)  // usable dimension
             .setRainflyWidth(24)
             .setWalls(2)
             .setWeight(47.5)
             .setPrice(349)
             .setUrl("https://www.marmot.com/equipment/tents/2-person/tungsten-ultralight-2-person-tent/AFS_889169580468.html"),
  "MLD Cricket (2020)":
    new Tent("Mountain Laurel Designs", "Cricket (2020)", OutlineType.Pyramid,
             [[0,3], [57, 57], [114, 3], [0,3]],
             [[12,3], [02,48], [29,57], [68,3], [12,3]],
             95, 39, 29.25)  // usable dimension
             .setSideFootprint(0, 114)
             .setFrontFootprint(12, 68)
             .setIsTarp()
             //.setFrontSittingOffset(30)
             .setWeight(11.5)
             .setPrice(185)
             .setUrl("https://mountainlaureldesigns.com/product/cricket-pyramid-tarp/"),
  "MLD Grace Solo Tarp (120cm)":
    new Tent("Mountain Laurel Designs", "Grace Solo Tarp (120cm)", OutlineType.Pyramid,
             [[0,6], [0, 31], [108, 47], [108,6], [0,6]],
             [[0,6], [22,47], [44,6], [0,6]],
             84, 16, 10)  // usable dimension
             .setLayingHeight(18)
             .setSideFootprint(12, 96)
             .setFrontFootprint(6, 38)
             .setRainflyWidth(0)
             .setIsTarp()
             .setInteriorPeakHeight(43)
             .setWeight(9)
             .setPrice(140)
             .setUrl("https://mountainlaureldesigns.com/product/mld-grace-tarp/"),
  "MLD Solomid XL (2019 DCF)":
    new Tent("Mountain Laurel Designs", "Solomid XL (2019 DCF)", OutlineType.Pyramid,
             [[0,3], [55, 53], [110, 3], [0,3]],
             [[0,3], [16,53], [52,3], [0,3]],
             80, 30, 16.5)  // usable dimension
             .setPanelPullouts()
             .setFrontSittingOffset(27.5)
             .setIsTarp()
             .setWeight(13.5)
             .setPrice(475),
  "Nemo Dagger 2p":
    new Tent("Nemo", "Dagger 2p", OutlineType.Dome,
             [90, 42], // length, height
             [50, 42],  // width, height
             81.5, 45, 38.5)  // usable dimension
             .setWalls(2)
             .setRainflyWidth(26)
             .setWeight(53)
             .setPrice(429.95)
             .setUrl("https://www.nemoequipment.com/product/dagger/"),
  "Nemo Dragonfly 1p":
    new Tent("Nemo", "Dragonfly 1p", OutlineType.Dome,
             [88, 40], // length, height
             [33.5, 40],  // width, height
             77, 39, 29.75)  // usable dimension
             .setWalls(2)
             .setRainflyWidth(28)
             .setWeight(33)
             .setPrice(359.95)
             .setUrl("https://www.nemoequipment.com/product/dragonfly/"),
  "Nemo Dragonfly 2p":
    new Tent("Nemo", "Dragonfly 2p", OutlineType.Dome,
             [88, 41], // length, height
             [47.5, 41],  // width, height
             77, 39, 32)  // usable dimension
             .setWalls(2)
             .setRainflyWidth(28)
             .setWeight(42)
             .setPrice(399.95)
             .setUrl("https://www.nemoequipment.com/product/dragonfly/"),
  "Nemo Hornet 1p":
    new Tent("Nemo", "Hornet 1p", OutlineType.Dome,
             [87, 39], // length, height
             [37, 39],  // width, height
             73, 17, 13)  // usable dimension
             .setWalls(2)
             .setRainflyWidth(24)
             .setWeight(30)
             .setPrice(329.95)
             .setUrl("https://www.nemoequipment.com/product/hornet/"),
  "Nemo Hornet 2p":
    new Tent("Nemo", "Hornet 2p", OutlineType.Dome,
             [85, 39], // length, height
             [47, 39],  // width, height
             71, 16, 12)  // usable dimension
             .setWalls(2)
             .setRainflyWidth(24)
             .setWeight(32)
             .setPrice(369.95)
             .setUrl("https://www.nemoequipment.com/product/hornet/"),
  "REI Arete 3 ASL":
    new Tent("REI", "Arete 3 ASL", OutlineType.Dome,
             [85, 45.5], // length, height
             [58, 45.5],  // width, height
             80.5, 64.5, 37.75)  // usable dimension
             .setWalls(2)
             .setWeight(88)
             .setPrice(289),
  "REI Flash Air 1":
    new Tent("REI", "Flash Air 1", OutlineType.Pyramid,
             [[6,0], [0,10], [60, 42], [100,6], [94, 0]],
             [[25,0], [0,6], [24,42], [38,42], [61.5, 6], [56,0]],
             78.5, 13.25, 11.5)  // usable dimension
             .setSideFootprint(6, 94)
             .setFrontFootprint(25, 56)  // 31
             .setInteriorPeakHeight(38.5)
             .setFrontInteriorPeakOffset(24)
             .setWeight(20)
             .setPrice(249)
             .setUrl("https://www.rei.com/product/168564/rei-co-op-flash-air-1-tent"),
  "REI Quarterdome 1":
    new Tent("REI", "Quarterdome 1 (2017)", OutlineType.Dome,
             [88, 42], // length, height
             [31, 42],  // width, height
             80, 40, 22.75)  // usable dimension
             .setWalls(2)
             .setRainflyWidth(27)
             .setWeight(39)
             .setPrice(229),
  "REI Quarterdome 2":
    new Tent("REI", "Quarterdome 2 (2017)", OutlineType.Dome,
             [88, 42], // length, height
             [47, 42],  // width, height
             78, 46, 36)  // usable dimension
             .setWalls(2)
             .setRainflyWidth(29.5)
             .setWeight(53)
             .setPrice(349),
  "SMD Deschutes (125cm)":
    new Tent("Six Moon Designs", "Deschutes (125cm)", OutlineType.Pyramid,
             [[0,13], [52.5, 49], [105, 13], [0,13]],
             [[0,13], [30.5,49], [80,6], [0,13]],
             83.8, 33.75, 15)  // usable dimension
             .setSideFootprint(10.6, 94.4)
             .setFrontFootprint(30.5, 68)
             .setFrontInteriorPeakOffset(30.5)
             .setPanelPullouts()
             .setIsTarp()
             .setWeight(13)
             .setPrice(185)
             .setUrl("https://www.sixmoondesigns.com/products/deschutes"),
  "SMD Gatewood Cape (114cm)":
    new Tent("Six Moon Designs", "Gatewood Cape (114cm)", OutlineType.Pyramid,
             [[0,13], [52.5, 45], [105, 13], [0,13]],
             [[0,13], [24.375,45], [65,6], [0,13]],
             83.8, 26.75, 10)  // usable dimension
             .setSideFootprint(10.6, 94.4)
             .setFrontFootprint(24.375, 65)
             .setFrontInteriorPeakOffset(24.375)
             .setPanelPullouts()
             .setIsTarp()
             .setWeight(11)
             .setPrice(155)
             .setUrl("https://www.sixmoondesigns.com/products/gatewood-cape"),
  "SMD Lunar Solo":
    new Tent("Six Moon Designs", "Lunar Solo", OutlineType.Pyramid,
             [[7.75,0], [0,6], [52.5, 48], [105,6], [98.25, 0]],
             [[27.5,0], [0,10], [27.5,48], [79,6], [73,0]],
             76, 27.75, 14)
             .setSideFootprint(8, 98)
             .setFrontFootprint(27.5, 59)  // 31.5
             .setPanelPullouts()
             .setFrontInteriorPeakOffset(27.5)
             .setWeight(26)
             .setPrice(230)
             .setEstimated()
             .setUrl("https://www.sixmoondesigns.com/products/lunar-solo"),
  "SMD Serenity":
    new Tent("Six Moon Designs", "Serenity", OutlineType.Pyramid,
             [[0,0], [0,10], [42, 44], [84,10], [84, 0]],
             [[0,0], [0, 44], [26,10], [26,0]],
             70.8, 25.25, 11.75)  // usable dimension
             .setFrontInteriorPeakOffset(0)
             .setInner(true)
             .setWalls(2)
             .setWeight(11)
             .setPrice(135)
             .setUrl("https://www.sixmoondesigns.com/products/serenity-nettent"),
  "SMD Skyscape Trekker":
    new Tent("Six Moon Designs", "Skyscape Trekker", OutlineType.Pyramid,
             [[10.5,0], [0,6], [72, 45], [120,6], [113.5, 0]],
             [[14,0], [0,10], [32,45], [44,45], [76,6], [62,0]],
             86, 25, 19)
             .setSideFootprint(10.5, 113.5)
             .setFrontFootprint(23, 53)
             .setFrontInteriorPeakWidth(12)
             .setWeight(28)
             .setPrice(250)
             .setEstimated()
             .setUrl("https://www.sixmoondesigns.com/products/skyscape-trekker"),
  "Tipik Aston Tarp":
    new Tent("Tipik", "Aston Tarp", OutlineType.Pyramid,
             [[0,3], [53, 62.2], [106,3], [0,3]],
             [[0,3], [30,62.2], [90.5,3], [0,3]],
             89.4, 40.6, 24)
             .setSideFootprint(3, 103)
             .setFrontFootprint(30, 87.5) 
             .setPanelPullouts()
             .setFrontInteriorPeakOffset(30)
             .setIsTarp()
             .setWeight(19.9)
             .setPrice(349.42)
             .setUrl("https://tipik-tentes.fr/abris_tarps/Aston_ST"),
  "Tipik Aston Inner":
    new Tent("Tipik", "Aston Inner", OutlineType.Pyramid,
             [[0,0], [0,4], [45.25, 53.15], [90.5,4], [90.5,0], [0,0]],
             [[0,0], [0, 53.15], [49.2,4], [49.2,0], [0,0]],
             73.1, 23.3, 16.5)
             .setFrontInteriorPeakOffset(0)
             .setInner(true)
             .setWalls(2)
             .setWeight(18.7)
             .setPrice(620.53)
             .setUrl("https://tipik-tentes.fr/tentes/Aston"),
  "Tipik Aston XL Tarp":
    new Tent("Tipik", "Aston XL Tarp", OutlineType.Pyramid,
             [[0,3], [59, 70.9], [118,3], [0,3]],
             [[0,3], [39,70.9], [106.3,3], [0,3]],
             99.9, 49.8, 29.6)
             .setSideFootprint(3, 115)
             .setFrontFootprint(39, 103) 
             .setPanelPullouts()
             .setFrontInteriorPeakOffset(39)
             .setIsTarp()
             .setWeight(22.6)
             .setPrice(421.72)
             .setUrl("https://tipik-tentes.fr/abris_tarps/Aston_XL_ST"),
  "Tipik Aston XL Inner":
    new Tent("Tipik", "Aston XL Inner", OutlineType.Pyramid,
             [[0,0], [0,4], [49.2, 59], [98.4,4], [98.4,0], [0,0]],
             [[0,0], [0, 59], [59,4], [59,0], [0,0]],
             82, 35.5, 23.6)
             .setFrontInteriorPeakOffset(0)
             .setInner(true)
             .setWalls(2)
             .setWeight(22.9)
             .setPrice(729)
             .setUrl("https://tipik-tentes.fr/tentes/Aston_XL"),
  "Tipik Pioulou Tarp":
    new Tent("Tipik", "Pioulou Tarp", OutlineType.Pyramid,
             [[0,3], [63, 49.25], [126,3], [0,3]],
             [[0,3], [20,49.25], [63.4,3], [0,3]],
             95.3, 29.6, 10.6)
             .setSideFootprint(8, 118)
             .setFrontFootprint(20, 63.4) 
             .setPanelPullouts()
             .setFrontInteriorPeakOffset(20)
             .setIsTarp()
             .setWeight(12.7)
             .setPrice(265)
             .setUrl("https://tipik-tentes.fr/abris_tarps/pioulou"),
  "Tipik Pioulou Inner":
    new Tent("Tipik", "Pioulou Inner", OutlineType.Pyramid,
             [[0,0], [0,8], [43.3,43.3], [86.6,8], [86.6,0], [0,0]],
             [[0,0], [0,43.3], [32.2,4], [32.2,0], [0,0]],
             72.9, 17.7, 5.9)
             .setFrontInteriorPeakOffset(0)
             .setInner(true)
             .setWalls(2)
             .setWeight(14.3)
             .setPrice(505)
             .setUrl("https://tipik-tentes.fr/tentes/Pioulou_DT"),
  "Tipik Pioulou XL Tarp":
    new Tent("Tipik", "Pioulou XL Tarp", OutlineType.Pyramid,
             [[0,3], [63,61], [126,3], [0,3]],
             [[0,3], [24,61], [78.75,3], [0,3]],
             105, 46.5, 21.7)
             .setSideFootprint(8, 118)
             .setFrontFootprint(24, 75.3) 
             .setPanelPullouts()
             .setFrontInteriorPeakOffset(24)
             .setIsTarp()
             .setWeight(15.3)
             .setPrice(307)
             .setUrl("https://tipik-tentes.fr/abris_tarps/Pioulou_XL_ST"),
  "Tipik Pioulou XL Inner":
    new Tent("Tipik", "Pioulou XL Inner", OutlineType.Pyramid,
             [[0,0], [0,4], [51,55], [102,4], [102,0], [0,0]],
             [[0,0], [0,55], [37.4,4], [37.4,0], [0,0]],
             85.1, 32.7, 11.8)
             .setFrontInteriorPeakOffset(0)
             .setInner(true)
             .setWalls(2)
             .setWeight(16.93)
             .setPrice(554)
             .setUrl("https://tipik-tentes.fr/tentes/Pioulou_XL"),
  "TT Aeon Li":
    new Tent("Tarptent", "Aeon Li", OutlineType.Pyramid,
             [[0,0], [0, 14], [49.25, 50], [98.5, 14], [98.5, 0]],
             [[25,0], [0,10], [18,47], [25,50], [32,47], [65.5,14], [65.5,0]],
             82, 22.25, 15)  // usable dimension
             .setSideFootprint(5.25, 93.25)
             .setFrontFootprint(25, 55)  // 30
             .setInteriorPeakHeight(47)
             .setFrontInteriorPeakOffset(25)
             .setFrontInteriorPeakWidth(7)
             .setWeight(17.3)
             .setPrice(535)
             .setUrl("https://www.tarptent.com/product/aeon-li/"),
  "TT Protrail":
    new Tent("Tarptent", "Protrail", OutlineType.Pyramid,
             [[0,0], [0, 24], [84, 45], [107, 0]],
             [[0,0], [37,45], [74,0]],
             84, 20, 12)  // usable dimension
             .setLayingHeight(18)
             .setSideFootprint(0, 84)
             .setFrontFootprint(19, 55)  // 36
             .setRainflyWidth(0)  // front
             .setWeight(26)
             .setPrice(229)
             .setEstimated()
             .setUrl("https://www.tarptent.com/product/protrail/"),
  "Zpacks Altaplex":
    new Tent("Zpacks", "Altaplex", OutlineType.Pyramid,
             [[5,0], [0,6], [50, 57], [100,6], [95, 0]],
             [[20.75,0], [0,10], [20.75,57], [69,6], [56.75,0]],
             80, 35, 17)
             .setSideFootprint(5, 95)
             .setFrontFootprint(20.75, 56.75)
             .setPanelPullouts()
             .setFrontInteriorPeakOffset(20.75)
             .setWeight(15.4)
             .setPrice(585)
             .setEstimated()
             .setUrl("https://zpacks.com/products/altaplex-tent"),
  "Zpacks Hexamid Pocket Tarp":
    new Tent("Zpacks", "Hexamid Pocket Tarp", OutlineType.Pyramid,
             [[0,7], [53.5, 47], [107,7], [0,7]],
             [[10,7], [0,29], [18,47], [54,10], [40,7], [10,7]],
             80, 28, 10)
             .setSideFootprint(7, 99)
             .setFrontFootprint(18, 50)
             .setIsTarp()
             .setFrontInteriorPeakOffset(18)
             .setWeight(4.6)
             .setPrice(199)
             .setEstimated()
             .setUrl("https://zpacks.com/products/hexamid-pocket-tarp"),
  "Zpacks Duplex":
    new Tent("Zpacks", "Duplex", OutlineType.Pyramid,
             [[5,0], [0,6], [50, 48], [100,6], [95, 0]],
             [[20.75,0], [0,6], [16.25, 48], [69.25, 48], [86.5,6], [65.75,0]],
             78, 32, 45)
             .setSideFootprint(5, 95)
             .setFrontFootprint(20.75, 65.75)
             .setFrontInteriorPeakWidth(53)
             .setWeight(19.4)
             .setPrice(699)
             .addNote("Measured using panel pullouts")
             .setUrl("https://zpacks.com/products/duplex-tent"),
  "Zpacks DupleXL":
    new Tent("Zpacks", "DupleXL", OutlineType.Pyramid,
             [[5,0], [0,10], [50, 48], [100,10], [95, 0]],
             [[20.75,0], [0,6], [16.25, 48], [69.25, 48], [86.5,6], [65.75,0]],
             82, 32, 45)
             .setSideFootprint(5, 95)
             .setFrontFootprint(20.75, 65.75)
             .setFrontInteriorPeakWidth(53)
             .setWeight(19.4)
             .setEstimated()
             .setPrice(749)
             .setUrl("https://zpacks.com/products/duplex-tent"),

};

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
        false, "#E0B0E0", false, compareName + " Usable Area");
  }
  if (shouldDrawTent) {
    setSideXOff(tent);
    tent.drawUsableArea(
        false, "#50b42a80", false, name + " Usable Area");
  }

  // Draw front view fills.
  if (shouldDrawCompare) {
    setFrontXOff(tent, compareTent);
    compareTent.drawFrontUsableArea(false, "#E0B0E0", false, compareName + " Usable Area");  // fill
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

