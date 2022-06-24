<script lang="ts">
  import { push } from 'svelte-spa-router'

  import Sigma from 'sigma';
  import Graph from 'graphology';
  
  import { clan } from 'urbit-ob';
  import { cite, normalizeId } from '../lib/id';
  import { populateGraph } from '../lib/graph';
  import { getChartData } from '../lib/api';
  import { linkToShip } from '../lib/link';

  export let patp: string;
  let s;
  let g = new Graph();

  function sigma(container: HTMLElement, params: any = {}) {
    try {
      window['s'] = s = new Sigma(g, container, {
        renderLabels: false,
        // labelColor: { color: WHITE },
        labelFont: 'monospace',
        labelRenderedSizeThreshold: 9,
        zIndex: true,
        maxCameraRatio: 10,
      });

      s.on('downNode', ({ node }) => {
        push(linkToShip(node));
      });
    } catch(e) {
      console.error('error in initializing sigma:', e);
      if (!params.retried) {
        setTimeout(() => sigma(container, { retried: true }), 50);
      }
    }

    return {
      destroy() {
        s?.kill();
      }
    }
  }

  let chartDataPromise: any;
  let rawChartData: any = null;
  $: {
    rawChartData = null;
    chartDataPromise = getChartData();
    chartDataPromise.then((info) => {
      rawChartData = info;
    }).catch((error) => {
      rawChartData = { error };
    });
  }
  $: rawChartData, populateGraph(g, rawChartData), s?.scheduleRefresh(), searchFunc();

  let highlightedPatp;
  function searchFunc() {
    if (!s) return;
    if (highlightedPatp) {
      s.graph.removeNodeAttribute(highlightedPatp, 'highlighted');
      highlightedPatp = null;
    }
    if (!patp) return;
    let point = s.getNodeDisplayData(patp);
    if (!point) return;
    s.graph.setNodeAttribute(patp, 'highlighted', true);
    highlightedPatp = patp;

    let ratio = 0.05;
    if (clan(patp) === 'star') {
      ratio = 0.035;
    } else if (clan(patp) === 'planet') {
      ratio = 0.0025;
    }

    s.camera.animate({
      x: point.x,
      y: point.y,
      ratio: ratio,
      // ratio: 1,
      angle: 0
    }, {
      duration: 500,
    });
    s.scheduleRefresh();
  };

  $: s, patp, searchFunc();

  let helpBoxExpanded = false;
  let helpBoxClasses = '';
  $: {
    helpBoxClasses = helpBoxExpanded ?
      "" :
      "absolute border-r";
    // refreshGraph();
    if (s) {
      s.resize();
      s.scheduleRefresh();
    }
  }
</script>

<div class="border border-gold bg-navy w-full grow flex flex-col">
  <div class="flex flex-wrap {helpBoxClasses} border-b border-gold bg-navy text-white z-10 cursor-pointer justify-center px-2 py-1 gap-4"
    on:click={() => helpBoxExpanded = !helpBoxExpanded }>
    {#if helpBoxExpanded}
      <div class="flex flex-wrap items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-white"></div>
        Galaxy
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-gold"></div>
        Star
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-l1-blue"></div>
        L1 Planet
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-l2-green"></div>
        L2 Planet
      </div>
    {:else}
      Help ({patp})
    {/if}
  </div>
  <div class="grow flex">
    <div class="w-full" use:sigma>
    </div>
  </div>
</div>
