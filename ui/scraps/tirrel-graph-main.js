// Let's first initialize sigma:
//

let fetchArray = [];
for (let i = 0; i < 256; i++) {
  fetchArray.push(
    fetch(`./galaxies/${i.toString()}.json`).then(r => r.json())
  );
}

let searchButton = document.getElementById('searchButton');

Promise.all(fetchArray).then(values => {
  sigma.settings.minEdgeSize = 0;
  sigma.settings.maxEdgeSize = 0;
  sigma.settings.minNodeSize = 0;
  sigma.settings.maxNodeSize = 0;
  sigma.settings.zoomMin = 0.00001;
  sigma.settings.labelThreshold = 20;
  sigma.settings.font = "monospace";

  let s = new sigma({
    renderer: {
      container: document.getElementById('container'),
      type: 'webgl'
    }
  });
  let i = 0;

  let offsetX = 0;
  let offsetY = 0;

  let a = 120000000;
  let b = 8000000;
  let theta = 0;
  while (i < values.length) {
    offsetX = 0 + (a + b * theta) * Math.cos(theta);
    offsetY = 0 + (a + b * theta) * Math.sin(theta);

    galaxy(values[i], s, offsetX, offsetY);

    theta = 0.12 * (i+1);
    i++;
  }

  s.refresh();

  let headerDiv = document.getElementById('header');
  headerDiv.style = 'opacity:1;';

  let search = document.getElementById('header');
  let searchInput = document.getElementById('searchInput');

  let searchFunc = () => {
    let ob = window['urbit-ob'].default;
    let point = s.graph.nodes(searchInput.value);
    if (!point) {
      return;
    }

    let ratio = 0.05;
    if (ob.clan(searchInput.value) === 'star') {
      ratio = 0.018;
    } else if (ob.clan(searchInput.value) === 'planet') {
      ratio = 0.003;
    }

    s.cameras['0'].goTo({
      x: point['read_cam0:x'],
      y: point['read_cam0:y'],
      ratio: ratio,
      angle: 0
    });
  };

  searchButton.addEventListener('click', searchFunc);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      searchFunc();
    }
  });
});

const galaxy = (data, s, offsetX = 0, offsetY = 0) => {
  // Then, let's add some data to display:
  let ob = window['urbit-ob'].default;

  for (let [key, val] of Object.entries(data)) {
    s.graph.addNode({
      id: ob.patp(key),
      label: ob.patp(key),
      size: 4,
      color: '#999',
      x: 0 + offsetX,
      y: 0 + offsetY
    });

    let numOfStars = Object.entries(val).length;
    let starIter = 0;
    for (let [starKey, starVal] of Object.entries(val)) {
      const circle = 2 * Math.PI;
      let line = 40000 * 128;
      let starX = 0 + Math.cos(circle * starIter / numOfStars) * line;
      let starY = 0 + Math.sin(circle * starIter / numOfStars) * line;

      s.graph.addNode({
        id: ob.patp(starKey),
        label: ob.patp(starKey),
        size: 1.5,
        color: '#444',
        x: starX + offsetX,
        y: starY + offsetY
      }).addEdge({
        id: `e-star${starKey}`,
        source: ob.patp(key),
        target: ob.patp(starKey),
        color: '#444',
        size: 0.2
      });

      let starAngle = Math.atan2(starY, starX);
      let numOfPlanets = Object.entries(starVal).length;
      let planetIter = 0;

      for (let [planetKey, planetVal] of Object.entries(starVal)) {
        let planetAngle = starAngle + (Math.PI * 2 * (planetIter / numOfPlanets));

        let lineLen = 0;
        let lineColor = '#000';
        let nodeColor = '#000';

        if (planetIter % 4 === 0) {
          lineLen = 19000;
          lineColor = '#000';
          nodeColor = '#000';
        } else if (planetIter % 4 === 1) {
          lineLen = 16000;
          lineColor = '#ccc';
          nodeColor = '#ccc';
        } else if (planetIter % 4 === 2) {
          lineLen = 13000;
          lineColor = '#555';
          nodeColor = '#555';
        } else if (planetIter % 4 === 3) {
          lineLen = 16000;
          lineColor = '#ccc';
          nodeColor = '#ccc';
        }

        if (numOfStars < 5) {
          lineLen = lineLen * 144;
        } else if (numOfStars < 7) {
          lineLen = lineLen * 128;
        } else if (numOfStars < 9) {
          lineLen = lineLen * 96;
        } else if (numOfStars < 11) {
          lineLen = lineLen * 80;
        } else if (numOfStars < 13) {
          lineLen = lineLen * 64;
        } else if (numOfStars < 15) {
          lineLen = lineLen * 56;
        } else if (numOfStars < 17) {
          lineLen = lineLen * 48;
        } else if (numOfStars < 19) {
          lineLen = lineLen * 40;
        } else if (numOfStars < 21) {
          lineLen = lineLen * 36;
        } else if (numOfStars < 23) {
          lineLen = lineLen * 32;
        } else {
          lineLen = lineLen * 24;
        }

        let planetX = starX + (lineLen * Math.cos(planetAngle));
        let planetY = starY + (lineLen * Math.sin(planetAngle));

        s.graph.addNode({
          id: ob.patp(planetVal),
          label: ob.patp(planetVal),
          size: 0.2,
          color: nodeColor,
          x: planetX + offsetX,
          y: planetY + offsetY
        }).addEdge({
          id: `e-planet${planetVal}`,
          source: ob.patp(starKey),
          target: ob.patp(planetVal),
          size: 0.05,
          color: lineColor
        });

        planetIter++;
      }

      starIter++;
    }
  }
};
