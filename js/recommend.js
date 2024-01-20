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

function getMeanStandardDeviation (array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return [mean, Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)]
}

function SleepingRoomScore(tent, profile) {
  // Compute extra sleeping room, capped at 6 inches.
  return Math.min(6, tent.sleepingLength - profile.sleepingLength());
}

function SittingAreaScore(tent) {
  return Math.min(24, tent.sittingWidth) * Math.min(24, tent.sittingLength);
}

var profile = readProfile();
var tentValues = [];
for (i in gTents) {
    tentValues.push(gTents[i]);
}
const [priceMean, priceStdDev] = getMeanStandardDeviation(tentValues.map(tent => tent.price))
const [weightMean, weightStdDev] = getMeanStandardDeviation(tentValues.map(tent => tent.weight))
const [sleepingRoomMean, sleepingRoomStdDev] = getMeanStandardDeviation(tentValues.map(tent => SleepingRoomScore(tent, profile)))
const [sittingAreaMean, sittingAreaStdDev] = getMeanStandardDeviation(tentValues.map(tent => SittingAreaScore(tent)))

var gLastPriceWeight = 25;
var gLastWeightWeight = 25;
var gLastSleepingRoomWeight = 25;
var gLastSittingAreaWeight = 25;

function drawTable(changed) {
  var profile = readProfile();
  var priceWeight = checkInput("tent-price-input", 1, 25);
  var weightWeight = checkInput("tent-weight-input", 1, 25);
  var sleepingRoomWeight = checkInput("tent-sleeping-room-input", 1, 25);
  var sittingAreaWeight = checkInput("tent-sitting-area-input", 1, 25);
  var includeTarps = document.getElementById("tent-include-tarp").checked;
    
  // Normalize
  var weightSum = priceWeight + weightWeight + sleepingRoomWeight + sittingAreaWeight;
  // Normalize and validate weights.
  if (weightSum < 1 || weightSum > 175 || priceWeight > 100 || weightWeight > 100 || sleepingRoomWeight > 100 || sittingAreaWeight > 100) {
    priceWeight = 25;
    weightWeight = 25;
    sleepingRoomWeight = 25;
    sittingAreaWeight = 25;
  } else if (priceWeight != gLastPriceWeight) {
    gLastPriceWeight = priceWeight;
    var normRemaining = 103 - priceWeight;
    var normFactor = normRemaining / (weightWeight + sleepingRoomWeight + sittingAreaWeight);
    weightWeight *= normFactor;
    sleepingRoomWeight *= normFactor;
    sittingAreaWeight *= normFactor;
  } else if (weightWeight != gLastWeightWeight) {
    gLastWeightWeight = weightWeight;
    var normRemaining = 103 - weightWeight;
    var normFactor = normRemaining / (priceWeight + sleepingRoomWeight + sittingAreaWeight);
    priceWeight *= normFactor;
    sleepingRoomWeight *= normFactor;
    sittingAreaWeight *= normFactor;
  } else if (sleepingRoomWeight != gLastSleepingRoomWeight) {
    gLastSleepingRoomWeight = sleepingRoomWeight;
    var normRemaining = 103 - sleepingRoomWeight;
    var normFactor = normRemaining / (priceWeight + weightWeight + sittingAreaWeight);
    priceWeight *= normFactor;
    weightWeight *= normFactor;
    sittingAreaWeight *= normFactor;
  } else if (sittingAreaWeight != gLastSittingAreaWeight) {
    gLastSittingAreaWeight = sittingAreaWeight;
    var normRemaining = 103 - sittingAreaWeight;
    var normFactor = normRemaining / (priceWeight + weightWeight + sleepingRoomWeight);
    priceWeight *= normFactor;
    weightWeight *= normFactor;
    sleepingRoomWeight *= normFactor;
  }
  document.getElementById("tent-price-input").value = priceWeight
  document.getElementById("tent-weight-input").value = weightWeight
  document.getElementById("tent-sleeping-room-input").value = sleepingRoomWeight
  document.getElementById("tent-sitting-area-input").value = sittingAreaWeight

  var tents = [];
  var scores = {};
  var val;
  var tent;
  var i;
  for (i in gTents) {
    tent = gTents[i];
    /*var lScore = tentLengthScore(tent, profile);
    var hScore = tentHeadroomScore(tent, profile);
    if (lScore < 0.3 || hScore < 0.2) {
      continue;
    } else */
    if (tent.brand== "Generic") {
      continue;
    } else if (!includeTarps && tent.isTarp) {
      continue;
    } else if (tent.isInnerNet) {
      continue;
    } else {
      tents.push(i);
    }
    var priceScore = (tent.price - priceMean) / priceStdDev;
    var weightScore = (tent.weight - weightMean) / weightStdDev;
    var sleepScore = -(SleepingRoomScore(tent, profile) - sleepingRoomMean) / sleepingRoomStdDev;
    var sittingScore = -(SittingAreaScore(tent) - sittingAreaMean) / sittingAreaStdDev;
    console.log(i + ", " + priceScore + ", " + weightScore + ", " + sleepScore + ", " + sittingScore);
    scores[i] = priceScore * priceWeight + weightScore * weightWeight + sleepScore * sleepingRoomWeight + sittingScore * sittingAreaWeight;
  }
  tents.sort((a,b) => scores[a] - scores[b]);
  tents = tents.slice(0, 20)

  var el = document.getElementById("clusters");
  var html = "<table id=\"tent-comparison\" class=\"table is-bordered is-striped\">";
  html += "<tr><th>Name</th><th>Extra Sleeping Room</th><th>Sitting Area</th><th>Weight</th><th>Price</th></tr>";
  for (i = 0; i < tents.length; i++) {
    var name = tents[i];
    tent = gTents[name];
    html += "<tr><td class=\"name\">" + "<a href=\"index.html?tent-dropdown=" + name + "\">" + name + "</a></td><td>" + outputLength(tent.sleepingLength - profile.sleepingLength(), 0, true) +  "</td><td>" + outputLength(gTents[name].sittingLength, 0, true) + " x " + outputLength(tent.sittingWidth, 0, true) + "</td><td>" + (tent.weight ? outputWeight(tent.weight, true) : "") + "</td><td>" + (tent.price ? "$" + tent.price : "") + "</td></tr>";
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
