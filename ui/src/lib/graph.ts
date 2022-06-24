import Graph from 'graphology';
import { clan, sein, patp2dec, patp } from 'urbit-ob';
import * as colors from './colors';

const circle = 2 * Math.PI;
export function arrangePointsInSpirals(
    numPoints,
    {
      maxDistance, minDistance,
      startX = 0, startY = 0,
      maxArms = 6, maxPerArm = 45,
      makeSingleArmCircle = false,
    }): { coords: any[], numArms: number } {
  const numSmallEnoughArms = Math.ceil(numPoints / maxPerArm);
  let eRootNumArms = Math.max(1, Math.floor(Math.pow(numPoints, 1 / Math.E)));
  const numArms = Math.max(numSmallEnoughArms, eRootNumArms);
  const singleArmCircle = makeSingleArmCircle && numArms === 1;
  const numPerArm = numPoints / numArms;
  // todo refine theta range, and rename maxPerArm (misnomer)
  let armThetaRange = numPerArm * Math.min(Math.PI / 12, 0.25 * circle / numArms);
  if (singleArmCircle) {
    minDistance = maxDistance;
    armThetaRange = 2 * Math.PI;
  }
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
    // (i - (numarms * i/numpoints) * (numpoints/numarms)) / numperarm
    // const intraArmProgress = (i - arm * numPerArm) / numPerArm;
    const beginningOfNextArm = Math.floor(numPerArm * (arm + 1));
    const numInThisArm = beginningOfNextArm - (i - indexInArm);
    const intraArmProgress = indexInArm / numInThisArm;
    // const intraArmProgress = (numArms * overallProgress) % 1;
    const theta = circle * interArmProgress + armThetaRange * intraArmProgress;
    let baseLine = maxDistance - minDistance;
    let line = (minDistance + baseLine * intraArmProgress);
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
  };
}

export 

function populateGraph(g: Graph, rawChartData: any[]) {
  if (!(rawChartData instanceof Array)) return;
  if (!g) {
    g = new Graph();
  }

  let sponsorEdges = [];

  let offsetX = 0;
  let offsetY = 0;

  let a = 120000000;
  let b = 9000000;
  let theta = 0;

  rawChartData.forEach((galaxy, gi) => {
    offsetX = 0 + (a + b * theta) * Math.cos(theta);
    offsetY = 0 + (a + b * theta) * Math.sin(theta);

    theta = 0.15 * (gi+1) * (1 - .15 * (gi / 256));
    const gPatp = '~' + galaxy.p;
    g.addNode(gPatp, {
      // id: gPatp,
      label: gPatp,
      size: 3,
      color: colors.WHITE,
      // color: colors.'#fcd34d',
      x: offsetX,
      y: offsetY,
      zIndex: 10,
    });
    
    const stars = galaxy.c || [];
    const numStars = stars.length;
    const maxStarDistance = 60000 * 128;
    const starSize = 1.2 / Math.pow(numStars, 1 / 7);
    const {
      coords: starCoords,
      numArms: numStarArms,
    } = arrangePointsInSpirals(numStars,
      {
        maxDistance: maxStarDistance,
        minDistance: maxStarDistance / 4,
        startX: offsetX,
        startY: offsetY,
        makeSingleArmCircle: true,
      });
    let lastStarArm = null;
    let lastStarPatp = null;
    stars.forEach((star, si) => {
      const sPatp = '~' + star.p;

      const [starX, starY] = starCoords[si].coords;
      const arm = starCoords[si].arm;
      g.addNode(sPatp, {
        label: sPatp,
        size: starSize,
        // color: colors.arm % 2 == 0 ? LGREY : DGREY,
        color: colors.GOLDT2,
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
      if (star.s) {
        sponsorEdges.push([sPatp, '~' + star.s, {
          color: colors.GREEN,
          size: 0.2,
            zIndex: 11,
        }]);
      }
    
      const planets = star.c || [];
      const numPlanets = planets.length;
      const maxPlanetDistance = starSize * 1.6 * 4000 * 64;
      const {
        coords: planetCoords,
        numArms: numPlanetArms,
      } = arrangePointsInSpirals(numPlanets,
        {
          maxDistance: maxPlanetDistance,
          minDistance: maxPlanetDistance / 4,
          startX: starX,
          startY: starY,
          maxArms: 30,
          makeSingleArmCircle: true,
        });
      let lastPlanetArm = null;
      let lastPlanetPatp = null;
      planets.forEach((planet, pi) => {
        const pPatp = '~' + planet.p;
        // const circle = 2 * Math.PI;
        // let line = 16000 * 64;
        // let planetX = 0 + starX + Math.cos(circle * pi / numPlanets) * line;
        // let planetY = 0 + starY + Math.sin(circle * pi / numPlanets) * line;

        const [planetX, planetY] = planetCoords[pi].coords;
        const arm = planetCoords[pi].arm;
        g.addNode(pPatp, {
          label: pPatp,
          size: .15,
          color: planet.d == 'l2' ? colors.GREEN : colors.BLUE,
          x: planetX,
          y: planetY,
          zIndex: 6,
        });
        if (lastPlanetArm == arm) {
          g.addEdge(pPatp, lastPlanetPatp, {
            color: colors.DGREY,
            size: 0.05,
            zIndex: 5,
          });
        } else {
        if (numPlanetArms == 1) {
           g.addEdge(pPatp, sPatp, {
            color: colors.DGREY,
            size: 0.05,
            zIndex: 5,
          });
        }
        }
        if (planet.s) {
          sponsorEdges.push([pPatp, '~' + planet.s, {
            color: colors.GREEN,
            size: 0.05,
            zIndex: 11,
          }]);
        }
        lastPlanetArm = arm;
        lastPlanetPatp = pPatp;
      });
    });
  });
  sponsorEdges.forEach(([point, sponsor, attrs]) => {
    // g.addEdge(point, sponsor, attrs);
  });
  return g;
}
