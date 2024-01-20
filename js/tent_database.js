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

// Database of all tents. See tent.js for documentation.
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
             .setWeight(50)
             .setPrice(449.95)
             .setUrl("https://www.bigagnes.com/Copper-Spur-HV-UL2-2020"),
  "BA Fly Creek HV UL2":
    new Tent("Big Agnes", "Fly Creek HV UL2", OutlineType.Dome,
             [86, 40],
             [52,40],
             75.8, 32, 23.5)  // usable dimension
             .setWalls(2)
             .setWeight(36)
             .setPrice(349.95)
             .setUrl("https://www.bigagnes.com/Fly-Creek-HV-UL2-Person?quantity=1&custcol8=144"),
  "BA Tiger Wall UL2":
    new Tent("Big Agnes", "Tiger Wall UL2", OutlineType.Dome,
             [86, 39],
             [52, 39],
             72, 39.75, 30)  // usable dimension
             .setWalls(2)
             .setRainflyWidth(21)
             .setWeight(40)
             .setPrice(399.95)
             .setUrl("https://www.bigagnes.com/Tiger-Wall-UL2"),
  "Bonfus Duos 2p":
    new Tent("Bonfus", "Duos 2p", OutlineType.Pyramid,
             [[14.5,0], [0,6], [58, 50], [116,6], [101.5, 0]],
             [[28,0], [0,6], [24, 50], [77, 50], [101,6], [73,0]],
             87, 32, 45)
             .setSideFootprint(14.5, 101.5)
             .setFrontFootprint(28, 73)
             .setFrontInteriorPeakWidth(53)
             .setWeight(21.0)
             .setPrice(699)
             .setEstimated()
             .addNote("Measured using panel pullouts")
             .setUrl("https://bonfus.com/product/duos-2p-2/"),
  "Bonfus Middus 1p":
    new Tent("Bonfus", "Middus 1p", OutlineType.Pyramid,
             [[0,6], [56.1, 55], [112.2, 6], [0,6]],
             [[0,6], [23.5,55], [65,6], [0,6]],
             88, 38, 15)  // usable dimension
             .setSideFootprint(12.1, 100.1)
             .setFrontFootprint(23.5, 65)
             .setFrontInteriorPeakOffset(23.5)
             .setPanelPullouts()
             .setIsTarp()
             .setEstimated()
             .setWeight(9.7)
             .setPrice(509)
             .setUrl("https://bonfus.com/product/middus-1p/"),
  "Bonfus Middus 2p":
    new Tent("Bonfus", "Middus 2p", OutlineType.Pyramid,
             [[0,6], [55, 54], [110, 6], [0,6]],
             [[0,6], [40,54], [80,6], [0,6]],
             87, 37, 26)  // usable dimension
             .setSideFootprint(11.5, 98.5)
             .setFrontFootprint(0, 80)
             .setPanelPullouts()
             .setIsTarp()
             .setEstimated()
             .setWeight(14.6)
             .setPrice(595)
             .setUrl("https://bonfus.com/product/middus-2p/"),
  "Bonfus Solus 1p":
    new Tent("Bonfus", "Solus 1p", OutlineType.Pyramid,
             [[14.5,0], [0,6], [58, 50], [116,6], [101.5, 0]],
             [[27.5,0], [0,6], [24, 50], [54, 35], [66,6], [57.5,0]],
             87, 32, 28)
             .setSideFootprint(14.5, 101.5)
             .setFrontFootprint(27.5, 57.5)
             .setFrontInteriorPeakWidth(37)
             .setFrontInteriorPeakOffset(24)
             .setFrontInteriorPeakWidth(0)
             .setWeight(16.6)
             .setPrice(679)
             .setEstimated()
             .addNote("Measured using panel pullouts")
             .setUrl("https://bonfus.com/product/solus-1p/"),
  "X-Mid 1p":
    new Tent("Durston", "X-Mid 1p", OutlineType.Pyramid,
             [[0,0], [28, 45], [72, 45], [98, 0]],
             [[0,0], [22, 45], [45, 45], [63,0]],
             79, 51, 20)  // usable dimension
             .setFrontInteriorPeakWidth(9)
             .setWalls(2)
             .setWeight(28)
             .setPrice(220)
             .setUrl("https://durstongear.com/product/x-mid-1p"),
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
   "X-Mid 1p Pro":
    new Tent("Durston", "X-Mid 1p Pro", OutlineType.Pyramid,
             [[0,0], [28, 45], [72, 45], [98, 0]],
             [[0,0], [22, 45], [45, 45], [63,0]],
             90, 50, 24)  // usable dimension
             .setFrontInteriorPeakWidth(12)
             .setWeight(19.2)
             .setPrice(599)
             .setUrl("https://durstongear.com/products/x-mid-pro-1-tent-ultralight-thruhiking"),
  "X-Mid 1p Tarp":
    new Tent("Durston", "X-Mid 1p Tarp", OutlineType.Pyramid,
             [[0,0], [28, 45], [72, 45], [98, 0]],
             [[0,0], [22, 45], [45, 45], [63,0]],
             92, 51, 20)  // usable dimension
             .setFrontFootprint(8, 59)
             .setFrontInteriorPeakWidth(12)
             .setIsTarp()
             .setWeight(18)
             .setPrice(220)
             .setUrl("https://durstongear.com/product/x-mid-1p"),
  "X-Mid 2p":
    new Tent("Durston", "X-Mid 2p", OutlineType.Pyramid,
             [[0,0], [23, 44], [69, 44], [92, 0]],
             [[0,0], [4,44], [46,44], [50,0]],
             81.25, 58, 28.5)  // usable dimension
             .setFrontInteriorPeakWidth(54)
             .setWalls(2)
             .setWeight(36)
             .setPrice(300)
             .setUrl("https://durstongear.com/product/x-mid-2p"),
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
             [[0,0], [23, 44], [77, 44], [100, 0]],
             [[0,0], [26,44], [46,44], [80,0]],
             83.5, 56, 25)  // usable dimension
             .setWeight(20.4)
             .setPrice(679)
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
             .setEstimated()
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
  "TT Dipole 1 Li":
    new Tent("Tarptent", "Dipole 1 Li", OutlineType.Pyramid,
             [[4,0], [0,21], [46, 47], [92,21], [88, 0]],
             [[17,0], [0,6], [17, 47], [45, 47], [62,6], [45,0]],
             84, 27, 28)
             .setSideFootprint(4, 88)
             .setFrontFootprint(17, 45)
             .setFrontInteriorPeakWidth(28)
             .setEstimated()
             .setWeight(22.8)
             .setPrice(699)
             .setUrl("https://www.tarptent.com/product/dipole-1-li/"),
  "TT Dipole 2 Li":
    new Tent("Tarptent", "Dipole 2 Li", OutlineType.Pyramid,
             [[4,0], [0,21], [47, 47], [94,21], [90, 0]],
             [[17,0], [0,6], [17, 47], [65, 47], [82,6], [65,0]],
             86, 27.5, 48)
             .setSideFootprint(4, 90)
             .setFrontFootprint(17, 65)
             .setFrontInteriorPeakWidth(48)
             .setEstimated()
             .setWeight(26.71)
             .setPrice(799)
             .setUrl("https://www.tarptent.com/product/dipole-2-li/"),
  "TT Double Rainbow":
    new Tent("Tarptent", "Double Rainbow", OutlineType.Dome,
             [88, 42], // length, height
             [50, 42],  // width, height
             81, 50, 25)  // usable dimension
             .setRainflyWidth(23)
             .setWeight(38.2)
             .setPrice(339)
             .setUrl("https://www.tarptent.com/product/double-rainbow"),
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
  "TT Protrail Li":
    new Tent("Tarptent", "Protrail Li", OutlineType.Pyramid,
             [[0,0], [0, 24], [84, 45], [107, 0]],
             [[0,0], [35,45], [70,0]],
             84, 20, 11.5)  // usable dimension
             .setLayingHeight(18)
             .setSideFootprint(0, 84)
             .setFrontFootprint(19, 55)  // 36
             .setRainflyWidth(0)  // front
             .setWeight(16.5)
             .setPrice(529)
             .setEstimated()
             .setUrl("https://www.tarptent.com/product/protrail-li/"),
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
  "Zpacks Plex Solo":
    new Tent("Zpacks", "Plex Solo", OutlineType.Pyramid,
             [[5,0], [0,6], [50, 52], [100,6], [95, 0]],
             [[18.75,0], [0,10], [18.75,52], [62,6], [56.75,0]],
             78, 31, 13.5)
             .setSideFootprint(5, 95)
             .setFrontFootprint(18.75, 56.75)
             .setPanelPullouts()
             .setFrontInteriorPeakOffset(18.75)
             .setWeight(13.9)
             .setPrice(599)
             .setEstimated()
             .setUrl("https://zpacks.com/products/plexsolo-tent"),
};
