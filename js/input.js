var gParams = [
    // Profile params.
    "height-input", "sitting-height-input", "shoulder-width-input",
    "foot-length-input", "loft-input", "pad-height-input",
    // Generic tent params.
    "generic-tent-length-input", "generic-tent-width-input",
    "generic-tent-height-input", "generic-compare-tent-length-input",
    "generic-compare-tent-width-input", "generic-compare-tent-height-input",
    // Recommend params
    "tent-price-input", "tent-weight-input", "tent-include-tarp", "tent-sleeping-room-input", "tent-sitting-area-input",
];

function addInputListeners(callback) {
  gParams.forEach(param => {
    var el = document.getElementById(param);
    if (el) {
      el.addEventListener('keyup', callback);
      el.addEventListener('input', callback);
      el.addEventListener('change', callback);
    }
  });
}

var gSetValues = {};
function checkInput(i, min, def) {
  var orig = document.getElementById(i).value;
  var val = orig;
  if (!val) {
    if (gMetric) {
      document.getElementById(i).placeholder = Math.round(def * 10 * 2.54) / 10;
    } else {
      document.getElementById(i).placeholder = Math.round(def * 10) / 10;
    }
    gSetValues[i] = false;
    return def;
  }
  val = parseFloat(val);
  if (gMetric) {
    val = val / 2.54;
  }
  if (val < min) {
    return min;
  } else {
    gSetValues[i] = val;
    return val;
  }
}

gAdvanced = false;
function toggleAdvanced() {
  var options = document.getElementsByClassName("advanced-options");
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    if (gAdvanced) {
      option.style.display = "none";
    } else {
      option.style.display = "table-row";
    }
  }
  var advancedButton = document.getElementById("advanced-button");
  if (gAdvanced) {
    advancedButton.innerHTML = "Advanced &darr;";
  } else {
    advancedButton.innerHTML = "Advanced &uarr;";
  }
  gAdvanced = !gAdvanced;
}

gMetric = false;
function toggleUnits() {
  var units = document.getElementsByClassName("units");
  for (var i in units) {
    var unit = units[i];
    if (gMetric) {
      unit.innerHTML = "cm";
    } else {
      unit.innerHTML = "inches";
    }
  }
  var units = document.getElementsByClassName("units-abbrev");
  for (var i in units) {
    var unit = units[i];
    if (gMetric) {
      unit.innerHTML = " cm";
    } else {
      unit.innerHTML = "\"";
    }
  }
  var units = document.getElementsByClassName("units-weight-abbrev");
  for (var i in units) {
    var unit = units[i];
    if (gMetric) {
      unit.innerHTML = " g";
    } else {
      unit.innerHTML = " oz";
    }
  }
  var units = document.getElementsByClassName("input-length");
  for (var i in units) {
    var unit = units[i];
    if (gSetValues[unit.id]) {
      if (gMetric) {
        unit.value = Math.round(10 * gSetValues[unit.id] * 2.54) / 10;
      } else {
        unit.value = Math.round(10 * gSetValues[unit.id]) / 10;
      }
    }
  }
}

function clickMetric(e) {
  var checkbox = document.getElementById("metric-checkbox");
  gMetric = checkbox.checked;
  if (gMetric) {
    gSetValues["metric"] = true;
  } else {
    gSetValues["metric"] = false;
  }
  writeCookie();
  toggleUnits();
  if (drawFromSettings) {
    drawFromSettings(false);
  }
}

gDiagonal = false;
function clickDiagonal(e) {
  var checkbox = document.getElementById("diagonal-checkbox");
  gDiagonal = checkbox.checked;
  if (gDiagonal) {
    gSetValues["diagonal"] = true;
  } else {
    gSetValues["diagonal"] = false;
  }
  writeCookie();
  if (drawFromSettings) {
    drawFromSettings(false);
  }
}

function readProfile() {
  var heightInches = checkInput("height-input", 36, 72);
  var sittingHeightInches = checkInput("sitting-height-input",
      18, heightInches * 0.52);
  var shoulderWidthInches = checkInput("shoulder-width-input",
      8, heightInches * 0.25);
  var footLengthInches = checkInput("foot-length-input",
      5, heightInches * 0.15);
  var loftInches = checkInput("loft-input", 0, 2);
  var padHeightInches = checkInput("pad-height-input", 0, 2.5);
  var headDiameter = 7;
  if (!headDiameter || (headDiameter * 3 > heightInches)) {
    headDiameter = 7;
  }

  return new Profile(heightInches, loftInches, padHeightInches,
                     footLengthInches, sittingHeightInches, shoulderWidthInches);
}

function writeCookie() {
  document.cookie = "prefs=" + JSON.stringify(gSetValues);
}

function decodeCookie() {
  var cookie = decodeURIComponent(document.cookie);
  var gotMetric = false;
  if (cookie) {
    var vals = cookie.split("; ");
    for (var i in vals) {
      var val = vals[i];
      var el = val.split("=");
      if (el && el.length >= 2 && el[0] == "prefs") {
        try {
          var prefs = JSON.parse(el[1]);
        } catch(e) {
          console.log(e);
          return;
        }
        for (name in prefs) {
          if (!prefs[name]) {
            continue;
          }
          if (name == "metric") {
            gotMetric = true;
            var el = document.getElementById("metric-checkbox");
            gMetric = true;
            if (el) {
              el.checked = true;
            }
          } else if (name == "diagonal") {
            alert(1)
            var el = document.getElementById("diagonal-checkbox");
            gDiagonal = true;
            if (el) {
              el.checked = true;
            }
          } else {
            var el = document.getElementById(name);
            if (el) {
              el.value = prefs[name];
              gSetValues[name] = prefs[name];
            }
            if (name == "tent-dropdown") {
              gTentName = prefs[name];
            } else if (name == "tent-compare-dropdown") {
              gCompareTentName = prefs[name];
            }
          }
        }
      }
    }
  }
  
  if (!gotMetric) {
    // Guess.
    var lang;
    if (navigator.languages != undefined && navigator.languages.length) {
     lang = navigator.languages[0];
    } else {
     lang = navigator.language;
    }
    [language, country] = lang.split("-");
    if (!language) {
      gMetric = false;
    } else if (country && country.toLowerCase() == "us") {
      gMetric = false;
    } else if (!country && language.toLowerCase == "en") {
      gMetric = false;
    } else {
      gMetric = true;
    }
  }
  
  if (gMetric) {
    toggleUnits();
  }
}

function decodeGetParams() {
  const queryString = window.location.search.substring(1);
  var searchParams = new URLSearchParams(queryString);
  gParams.forEach(p => {
    var val = searchParams.get(p);
    if (val) {
      var el = document.getElementById(p);
      if (el) el.value = val;
    }
  });

  var urlTent = searchParams.get("tent-dropdown");
  if (urlTent && gTents[urlTent] !== null) {
    document.getElementById("tent-dropdown").value = urlTent;
  }
  var urlCompareTent = searchParams.get("tent-compare-dropdown");
  if (urlCompareTent && gTents[urlCompareTent] !== null) {
    document.getElementById("tent-compare-dropdown").value = urlCompareTent;
  }
}

function outputLength(inches, digits, units) {
  var r = 10;
  if (digits == 0) {
    r = 1;
  }
  if (gMetric) {
    return Math.round(r * inches * 2.54) / r + (units ? " cm" : "");
  } else {
    return Math.round(r * inches) / r + (units ? "\"" : "");
  }
}

function outputWeight(ounces, units) {
  if (gMetric) {
    return Math.round(ounces * 28.3495) + (units ? " gm" : "");
  } else {
    return Math.round(10 * ounces) / 10 + (units ? " oz" : "");
  }
}

/**
* Function that captures a click on an outbound link in Analytics and opens the link 
* in a new window.
* This function takes a valid URL string as an argument, and uses that URL string
* as the event label. Setting the transport method to 'beacon' lets the hit be sent
* using 'navigator.sendBeacon' in browser that support it.
*/
var openAndCaptureOutboundLink = function(url) {
  ga('send', 'event', 'outbound', 'click', url, {
    'transport': 'beacon',
    'hitCallback': function(){window.open(url, "_blank");}
  });
    
  return false;
}
