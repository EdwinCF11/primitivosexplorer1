const px = (id: number, ext: "jpeg" | "png" = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1260`;

/** Fotografía generada con dirección de arte propia */
export const OWN = {
  hero: "/images/hero.jpg",
  zonaColonial: "/images/dest-zona-colonial.jpg",
  tresOjos: "/images/dest-tres-ojos.jpg",
  damajagua: "/images/dest-damajagua.jpg",
  enriquillo: "/images/dest-enriquillo.jpg",
  museo: "/images/dest-museo.jpg",
  saona: "/images/dest-saona.jpg",
  faro: "/images/faro-colon.jpg",
  monumento: "/images/monumento-santiago.jpg",
  chavon: "/images/altos-chavon.jpg",
};

/** Banco fotográfico documental */
export const PX = {
  colonialFacade: px(19714328),
  colonialStreet: px(12005746),
  cathedral: px(16011296),
  museumHall: px(35870231),
  museumArtifacts: px(35870230),
  museumVisitors: px(2570068),
  karstBay: px(38116442),
  karstCliffs: px(35125817),
  karstForest: px(11967509),
  cableCar: px(27545970),
  cableCarBlue: px(11701076),
  petroglyph: px(21633187),
  rockArt: px(16144326),
  handCave: px(37054080),
  cloudForest: px(34169629),
  mistyForest: px(27668360),
  mountainStream: px(8761687),
  hilltopChurch: px(19676274),
  basilica: px(38759097),
  adobeChurch: px(37960370),
  mansionDecay: px(31090243),
  mansionFacade: px(14282138),
  mansionStairs: px(14643850),
  riverValley: px(2131974),
  riverGreen: px(26988585),
  mountainRiver: px(36781455),
  artMuseum: px(5309684),
  artCenter: px(30556386),
  pyramidGrass: px(28220142),
  pyramidRuins: px(13796658),
  waterfallJungle: px(10125941),
  waterfallForest: px(37197891),
  waterfallCosta: px(32182187),
  beachPalms: px(38376805),
  beachTobago: px(30826590),
  beachBoats: px(10490916),
  iguana: px(30966173),
  iguanaRock: px(6015671),
  busTrip: px(35105982),
  outdoorLesson: px(31874024),
  trailGuides: px(35106208),
  dinoKids: px(5578920),
  museumGuideKids: px(22616346),
};

export const STOCK = {
  busTrip: PX.busTrip,
  outdoorLesson: PX.outdoorLesson,
  trailGuides: PX.trailGuides,
};
