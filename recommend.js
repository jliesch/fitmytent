// Remove generic tents.
for (var i in gTents) {
  if (gTents[i].name.startsWith("Generic ")) {
    delete gTents[i];
  }
}

function tentLengthScore(tent, profile) {
  var effectiveLength = tent.effectiveLength(profile);
  var target = profile.sleepingLength();

  console.log(tent.name + " length target: " + target + " effectiveLength:" + effectiveLength + " = " + (effectiveLength - target));

  if (effectiveLength < target - 3) {
    return 0;
  } else if (effectiveLength > target + 3) {
    return 1;
  } else {
    return Math.round((effectiveLength - (target - 3)) / 6 * 10) / 10;
  }
}

function tentHeadroomScore(tent, profile) {
  var widths = tent.getExtraHeadWidthsAtHeight(profile, profile.sittingHeight);
  var headLength = widths[0];
  var headWidth = widths[1];
  var minDim = Math.min(headWidth, headLength) + (tent.walls - 1) * 2;

  var target = 3;

  console.log(tent.name + " headroom target: " + target + " effectiveHeadroom:"             + minDim + " = " + (minDim - target));

  if (minDim < target - 3) {
    return 0;
  } else if (minDim > target + 3) {
    return 1;
  } else {
    return Math.round((minDim - (target - 3)) / 6 * 10) / 10;
  }
}

var tentIds = [];
var gScores = {};
var gScores = {};
var Sizes = {
  JUST_RIGHT: 0,
  LONG: 1,
  WIDE: 2,
  PALATIAL: 3,
  TOO_SHORT: 4,
  TOO_NARROW: 5,
  TOO_SMALL: 6,
};
function sizeName(size) {
  switch (parseInt(size)) {
    case Sizes.TOO_SMALL: return "Short and Narrow";
    case Sizes.TOO_SHORT: return "Short";
    case Sizes.TOO_NARROW: return "Narrow";
    case Sizes.JUST_RIGHT: return "Just Right";
    case Sizes.LONG: return "Long";
    case Sizes.WIDE: return "Wide";
    case Sizes.PALATIAL: return "Palatial";
  }
  return size;
}

function drawTable(changed) {
  var profile = readProfile();

  var buckets = [];
  var val;
  for (val in Sizes) {
    buckets[Sizes[val]] = [];
  }
  var tent;
  var i;
  for (i in gTents) {
    tent = gTents[i];
    tentIds.push(i);
    var lScore = tentLengthScore(tent, profile);
    var hScore = tentHeadroomScore(tent, profile);
    if (lScore < 0.3 && hScore < 0.2) {
      buckets[Sizes.TOO_SMALL].push(i);
    } else if (lScore < 0.3) {
      buckets[Sizes.TOO_SHORT].push(i);
    } else if (hScore < 0.2) {
      buckets[Sizes.TOO_NARROW].push(i);
    } else if (lScore >= 0.9 && hScore >= 0.9) {
      buckets[Sizes.PALATIAL].push(i);
    } else if (lScore >= 0.9) {
      buckets[Sizes.LONG].push(i);
    } else if (hScore >= 0.9) {
      buckets[Sizes.WIDE].push(i);
    } else {
      buckets[Sizes.JUST_RIGHT].push(i);
    }
    gScores[i] = tent.sleepingLength;
  }
  for (val in Sizes) {
    buckets[Sizes[val]].sort((a,b) => gScores[a] - gScores[b]);
  }

  var el = document.getElementById("clusters");
  var html = "<table id=\"tent-comparison\" class=\"data-table\">";
  var first = true;
  for (var b = 0; b < buckets.length; b++) {
    if (buckets[b].length == 0) {
      continue;
    }
    if (first) {
      first = false;
    } else {
      html += "<tr><td class=\"skip\" colspan=5>&nbsp;</td></tr>";
    }
    html += "<tr><td class=\"title\" colspan=5>" + sizeName(b) + "</td></tr>";
    html += "<tr><td></td><td>Sleeping Length</td><td>Sitting Area</td><td>Weight</td><td>Price</td></tr>";
    for (i = 0; i < buckets[b].length; i++) {
      var name = buckets[b][i];
      tent = gTents[name];
      html += "<tr><td class=\"name\">" + "<a href=\"index.html?tent-dropdown=" + name + "\">" + name + "</a></td><td>" + outputLength(tent.sleepingLength, 0, true) +  "</td><td>" + outputLength(gTents[name].sittingLength, 0, true) + " x " + outputLength(tent.sittingWidth, 0, true) + "</td><td>" + (tent.weight ? outputWeight(tent.weight, true) : "") + "</td><td>" + (tent.price ? "$" + tent.price : "") + "</td></tr>";
    }
  }
  el.innerHTML = html + "</table>";

  if (changed) {
    writeCookie();
  }
}

decodeCookie();
decodeGetParams();
drawTable(false);
addInputListeners(function(e) { drawTable(true); });
