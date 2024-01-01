// Profile is the data that describes a person plus their pad and sleeping bag.
//
// A user's profile will not typically change once it is configured.
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
    ctx.fillStyle = "#E0B0E0";
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
    ctx.fillStyle = "#E0B0E0";
    ctx.fill();
    ctx.strokeStyle = "#555";
    ctx.stroke();

    checkHover("You!");
  }
}
