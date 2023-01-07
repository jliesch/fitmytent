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

var gScores = {};

function drawTable(changed) {
  var profile = readProfile();

  var tents = [];
  var val;
  var tent;
  var i;
  for (i in gTents) {
    tent = gTents[i];
    if (tent.brand.startsWith("Generic")) {
      continue;
    }
    var lScore = tentLengthScore(tent, profile);
    var hScore = tentHeadroomScore(tent, profile);
    if (lScore < 0.3 || hScore < 0.2) {
      continue;
    } else {
      tents.push(i);
    }
    gScores[i] = tent.sleepingLength;
  }
  tents.sort((a,b) => gScores[a] - gScores[b]);

  var el = document.getElementById("clusters");
  var html = "<table id=\"tent-comparison\" class=\"table is-bordered is-striped\">";
  html += "<tr><th>Name</th><th>Extra Sleeping Room</th><th>Sitting Area</th><th>Weight</th><th>Price</th></tr>";
  for (i = 0; i < tents.length; i++) {
    var name = tents[i];
    tent = gTents[name];
    html += "<tr><td class=\"name\">" + "<a href=\"index.html?tent-dropdown=" + name + "\">" + name + "</a></td><td>" + outputLength(tent.getLayingWidthAtHeight(profile.sleepingHeights()) - profile.sleepingLength(), 0, true) +  "</td><td>" + outputLength(gTents[name].sittingLength, 0, true) + " x " + outputLength(tent.sittingWidth, 0, true) + "</td><td>" + (tent.weight ? outputWeight(tent.weight, true) : "") + "</td><td>" + (tent.price ? "$" + tent.price : "") + "</td></tr>";
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
