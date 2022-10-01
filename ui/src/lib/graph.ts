import Graph from 'graphology';
import * as colors from './colors';

const example = '[0[3216291:t;9219219;4608:s[156546;1612196;219621:~;321965149:4608;]1280[4289594624;4278191360;426672256;4260168960;4260824320;4246668544;4246144256;4253746432;4235396352;4230415616;4225697024;4227007744;4219667712;4222616832;4224648448;4214490368;4215997696;4219143424;4237296896;]]]'

export interface ChartPoint {
  patp: string,
  dominion: ('l1' | 'l2' | 'spawn'),
  sponsor?: string,
  parent?: string,
  children?: ChartPoint[],
  sponsees?: ChartPoint[],
}

function parseMetaString(metaString: string): ChartPoint {
  let idString, subMetaString = '';
  const colIndex = metaString.indexOf(':');
  if (colIndex === -1) {
    idString = metaString;
  } else {
    idString = metaString.slice(0, colIndex);
    subMetaString = metaString.slice(colIndex + 1);
  }
  const meta: ChartPoint = {
    patp: '~' + idString,
    dominion: 'l1',
  }
  if (subMetaString) {
    const firstChar = subMetaString[0];
    if (firstChar === 't') {
      meta.dominion = 'l2';
      subMetaString = subMetaString.slice(1);
    } else if (firstChar === 's') {
      meta.dominion = 'spawn';
      subMetaString = subMetaString.slice(1);
    }
    if (subMetaString) {
      if (subMetaString[0] === '~') {
        meta.sponsor = null;
      } else {
        let [sponsor, parent] = subMetaString.slice(1).split('!');
        meta.sponsor = '~' + sponsor;
        meta.parent = '~' + parent;
      }
    }
  }
  return meta;
}

function extractMeta(data: string): [ChartPoint, string] {
  const index = data.search(/[[;]/);
  if (index === -1) {
    throw new Error(`No point meta present in ${data}`);
  }
  const metaString = data.slice(0, index);
  data = data.slice(index);
  return [parseMetaString(metaString), data];
}

function extractChildren(data: string, sup: string = undefined): [ChartPoint[], ChartPoint[], string] {
  if (data[0] === ';') return [[], [], data.slice(1)];
  if (data[0] !== '[') throw new Error('Invalid children in data: ' + data.slice(0, 20));

  let endFound = false;
  let counter = 0;
  data = data.slice(1);
  const children = [];
  const sponsees = [];
  while (!endFound && data.length && counter < 20000) {
    if (data[0] === ']') {
      endFound = true;
      data = data.slice(1);
    } else {
      let sub;
      [sub, data] = extractChartPoint(data);
      if (!sub.parent || sub.parent === sup)
        children.push(sub);
      if (sub.sponsor === undefined || sub.sponsor === sup)
        sponsees.push(sub);
    }
    counter++;
  }
  return [children, sponsees, data];
}

function extractChartPoint(data: string): [ChartPoint, string] {
  let point, children, sponsees;
  [point, data] = extractMeta(data);
  [children, sponsees, data] = extractChildren(data, point.patp);
  point.children = children;
  point.sponsees = sponsees;
  return [point, data];
}

function linkChartData(points: ChartPoint[], store: any): ChartPoint[] {
  if (!points) return points;
  return points.map(point => {
    if (!store[point.patp]) return point;
    if (!point.children?.length) {
      point.children = linkChartData(store[point.patp].children, store);
    }
    if (!point.sponsees?.length) {
      point.sponsees = linkChartData(store[point.patp].sponsees, store);
    }
    return point;
  });
}

function _parseChartData(str: string): ChartPoint[] {
  if (!str) return [];
  let [baseChildren, _] = extractChildren(str);
  let store = {};
  baseChildren.forEach(child => {
    store[child.patp] = {
      children: child.children,
      sponsees: child.sponsees,
    };
  });

  return linkChartData(store['~base'].children, store);
}

export function parseChartData(data: string): ChartPoint[] {
  let start = Date.now();
  let parsed = _parseChartData(data);
  // console.log(`finished parsing chart data to js object in ${Date.now() - start} ms`);
  return parsed;
}

const circle = 2 * Math.PI;
function chordLength(radius, radians) {
  return 2 * radius * Math.sin(radians / 2);
}
function distancePolar(r1, th1, r2, th2) {
  return Math.sqrt((r1 * r1) + (r2 * r2) - (2 * r1 * r2 * Math.cos(th2 - th1)));
}
export function arrangePointsInSpirals(
    numPoints,
    {
      maxDistance, minDistance,
      startX = 0, startY = 0,
      maxArms = 6, maxPerArm = 45,
      makeSingleArmCircle = false,
    }): { coords: any[], numArms: number, minDistanceBetween: number } {
  const numSmallEnoughArms = Math.ceil(numPoints / maxPerArm);
  let eRootNumArms = Math.max(1, Math.floor(Math.pow(numPoints, 1 / Math.E)));
  const numArms = Math.max(numSmallEnoughArms, eRootNumArms);
  const singleArmCircle = makeSingleArmCircle && numArms === 1;
  const numPerArm = numPoints / numArms;
  let armThetaRange = numPerArm * Math.min(Math.PI / 12, 0.25 * circle / numArms);
  if (singleArmCircle) {
    minDistance = maxDistance;
    armThetaRange = circle;
  }
  const distanceRange = maxDistance - minDistance;
  const pointWeight = 1 / numPerArm;
  let minDistanceBetween = distancePolar(minDistance, 0,
    minDistance + distanceRange * pointWeight, armThetaRange * pointWeight);
  if (numPoints <= 3) minDistanceBetween = maxDistance * 0.75;
  const coords = [];
  let lastArm = null;
  let indexInArm = null;
  for (let i = 0; i < numPoints; i++) {
    const overallProgress = i / numPoints;
    const arm = Math.floor(numArms * overallProgress);
    if (lastArm === arm) {
      indexInArm++;
    } else {
      indexInArm = 0;
    }
    const interArmProgress = arm / numArms;
    const beginningOfNextArm = Math.floor(numPerArm * (arm + 1));
    const numInThisArm = beginningOfNextArm - (i - indexInArm);
    const intraArmProgress = indexInArm / numInThisArm;
    const theta = circle * interArmProgress + armThetaRange * intraArmProgress;
    let line = (minDistance + distanceRange * intraArmProgress);
    let x = 0 + startX + line * Math.cos(theta);
    let y = 0 + startY + line * Math.sin(theta);
    coords.push({
      coords: [x, y],
      arm: singleArmCircle ? i : arm,
    });
    lastArm = arm;
  };
  return {
    coords,
    numArms,
    minDistanceBetween,
  };
}

export function populateGraph(g: Graph, chartData: ChartPoint[], bySponsor: boolean, callback?): Graph {
  if (!(chartData instanceof Array)) return;
  if (!g) {
    g = new Graph();
  } else {
    g.clear();
  }

  let subsKey = bySponsor ? 'sponsees' : 'children';
  let sponsorEdges = [];

  let offsetX = 0;
  let offsetY = 0;

  let a = 120000000;
  let b = 9000000;
  let theta = 0;

  chartData.forEach((galaxy, gi) => {
    offsetX = 0 + (a + b * theta) * Math.cos(theta);
    offsetY = 0 + (a + b * theta) * Math.sin(theta);

    theta = 0.15 * (gi+1) * (1 - .15 * (gi / 256));
    const gPatp = galaxy.patp;
    const itsYou = gPatp === '~' + window.ship;
    g.addNode(gPatp, {
      label: gPatp,
      size: 3,
      color: itsYou ? colors.YOU : colors.WHITE,
      x: offsetX,
      y: offsetY,
      zIndex: 10,
    });
    
    const stars = galaxy[subsKey] || [];
    const numStars = stars.length;
    const maxStarDistance = 60000 * 128;
    const minStarDistance = maxStarDistance / 4;
    const starSize = 1.2 / Math.pow(numStars, 1 / 7);
    const {
      coords: starCoords,
      numArms: numStarArms,
      minDistanceBetween: minDistanceBetweenStars,
    } = arrangePointsInSpirals(numStars,
      {
        maxDistance: maxStarDistance,
        minDistance: minStarDistance,
        startX: offsetX,
        startY: offsetY,
        makeSingleArmCircle: true,
      });
    let lastStarArm = null;
    let lastStarPatp = null;
    stars.forEach((star, si) => {
      const sPatp = star.patp;

      const [starX, starY] = starCoords[si].coords;
      const arm = starCoords[si].arm;

      const itsYou = sPatp === '~' + window.ship;
      if (itsYou) {
        g.setNodeAttribute(gPatp, 'color', colors.YOUR_GAL);
      }
      g.addNode(sPatp, {
        label: sPatp,
        size: starSize,
        color: itsYou ? colors.YOU : colors.GOLDT2,
        x: starX,
        y: starY,
        zIndex: 8,
      });
      if (lastStarArm == arm) {
        g.addEdge(sPatp, lastStarPatp, {
          color: colors.LGREY,
          size: 0.1,
          zIndex: 7,
        });
      } else {
        g.addEdge(sPatp, gPatp, {
          color: colors.LGREY,
          size: 0.2,
          zIndex: 9,
        });
      }
      lastStarArm = arm;
      lastStarPatp = sPatp;
      if (star.sponsor) {
        sponsorEdges.push([sPatp, star.sponsor, {
          color: colors.GREEN,
          size: 0.2,
            zIndex: 11,
        }]);
      }
    
      const planets = star[subsKey] || [];
      const numPlanets = planets.length;
      // const maxPlanetDistance = starSize * 1.6 * 4000 * 64;
      const maxPlanetDistance = minDistanceBetweenStars * 0.45;
      const minPlanetDistance = maxPlanetDistance / 4;
      const {
        coords: planetCoords,
        numArms: numPlanetArms,
        minDistanceBetween: minDistanceBetweenPlanets,
      } = arrangePointsInSpirals(numPlanets,
        {
          maxDistance: maxPlanetDistance,
          minDistance: minPlanetDistance,
          startX: starX,
          startY: starY,
          maxArms: 30,
          makeSingleArmCircle: true,
        });
      let lastPlanetArm = null;
      let lastPlanetPatp = null;
      planets.forEach((planet, pi) => {
        const pPatp = planet.patp;
        const [planetX, planetY] = planetCoords[pi].coords;
        const arm = planetCoords[pi].arm;
        const planetSize = Math.sqrt(Math.min(minPlanetDistance, minDistanceBetweenPlanets)) / 1300;
        const planetEdgeSize = planetSize / 3;
        const itsYou = pPatp === '~' + window.ship;
        if (itsYou) {
          g.setNodeAttribute(sPatp, 'color', colors.YOUR_STAR);
          g.setNodeAttribute(gPatp, 'color', colors.YOUR_GAL);
        }
        try {
          g.addNode(pPatp, {
            label: pPatp,
            size: planetSize,
            color: itsYou ? colors.YOU : (planet.dominion == 'l2' ? colors.GREEN : colors.BLUE),
            x: planetX,
            y: planetY,
            zIndex: 6,
          });
          if (lastPlanetArm == arm) {
            g.addEdge(pPatp, lastPlanetPatp, {
              color: colors.DGREY,
              size: planetEdgeSize,
              zIndex: 5,
            });
          } else {
            if (numPlanetArms == 1) {
              g.addEdge(pPatp, sPatp, {
                color: colors.DGREY,
                size: planetEdgeSize,
                zIndex: 5,
              });
            }
          }
          if (planet.sponsor) {
            sponsorEdges.push([pPatp, planet.sponsor, {
              color: colors.GREEN,
              size: planetEdgeSize,
              zIndex: 11,
            }]);
          }
        } catch (e) {
          console.error(`Couldn't add ${pPatp} to the graph`, e);
        }
        lastPlanetArm = arm;
        lastPlanetPatp = pPatp;
      });
    });
  });
  sponsorEdges.forEach(([point, sponsor, attrs]) => {
    // g.addEdge(point, sponsor, attrs);
  });
  if (callback) {
    setTimeout(callback, 0);
  }
  return g;
}
