<script lang="ts">
  import LoadingSpinner from '@/common/LoadingSpinner.svelte';

  import { push } from 'svelte-spa-router'

  import Sigma from 'sigma';
  import Graph from 'graphology';
  
  import { clan } from 'urbit-ob';
  import DocLink from './docs/DocLink.svelte';
  import { cite, normalizeId } from 'lib/id';
  import { parseChartData, populateGraph } from 'lib/graph';
  import { getChartData } from 'lib/api';
  import { linkToShip } from 'lib/link';

  import InlineSelect from './buttons/InlineSelect.svelte';

  export let patp: string;
  let s;
  let g = new Graph();
  let highlightedPatp;

  let firstRender = true;
  let mouseDown = false;
  let isDragging = false;

  function sigma(container: HTMLElement, params: any = {}) {
    try {
      window['s'] = s = new Sigma(g, container, {
        renderLabels: false,
        // hideEdgesOnMove: true,
        allowInvalidContainer: true,
        // labelColor: { color: WHITE },
        labelFont: 'monospace',
        labelRenderedSizeThreshold: 9,
        zIndex: true,
        maxCameraRatio: 10,
      });

      s.on('clickNode', ({ node }) => {
        push(linkToShip(node));
      });
      s.on('afterRender', () => {
        if (firstRender) {
          firstRender = false;
          searchFunc();
        }
      });
      const mc = s.getMouseCaptor();
      mc.on("mousedown", () => {
        mouseDown = true;
      });
      mc.on('mousemove', () => {
        if (mouseDown) {
          isDragging = true;
        }
      });
      mc.on('mouseup', () => {
        if (!isDragging) {
          clearHighlight();
        }
        mouseDown = false;
        isDragging = false;
      })

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
  $: parsedChartData = parseChartData(rawChartData);
  $: [parsedChartData, bySponsor], populateGraph(g, parsedChartData, bySponsor, () => {
    searchFunc();
  });

  function clearHighlight() {
    const id = highlightedPatp;
    if (id) {
      setTimeout(() => {
        s.graph.removeNodeAttribute(id, 'highlighted');
        if (id == highlightedPatp)
        highlightedPatp = null;
      });
    }
  }

  function searchFunc() {
    // console.log('searching for ' + patp);
    if (!s) return;
    if (highlightedPatp !== patp) clearHighlight();
    if (!patp) return;
    let point = s.getNodeDisplayData(patp);
    if (!point) return;
    s.graph.setNodeAttribute(patp, 'highlighted', true);
    highlightedPatp = patp;

    let ratio = 0.03;
    if (clan(patp) === 'star') {
      ratio = 0.008;
    } else if (clan(patp) === 'planet') {
      ratio = 0.0005;
    }

    s.camera.animate({
      x: point.x,
      y: point.y,
      ratio: ratio,
      angle: 0
    }, {
      duration: 500,
    });
  };

  $: [s, patp], searchFunc();

  let helpBoxExpanded = false;
  let helpBoxClasses = '';
  $: {
    helpBoxClasses = helpBoxExpanded ?
      "w-full" :
      "border-r";
  }
  let bySponsor = true;
</script>

<div class="border border-gold bg-navy w-full grow flex flex-col relative">
  <div class="flex flex-wrap absolute {helpBoxClasses} border-b border-gold bg-navy text-white z-20 cursor-pointer justify-items-center px-2 py-1 gap-4"
    on:click={() => helpBoxExpanded = !helpBoxExpanded }>
    {#if helpBoxExpanded}
      <DocLink modal path="astrolabe">
        <div class="text-center justify-self-start">
          About Astrolabe
        </div>
      </DocLink>
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
        Planet (L1)
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-l2-green"></div>
        Planet (L2)
      </div>
      {#if s.nodeDataCache['~' + window.ship]}
        <div class="flex flex-wrap items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-you"></div>
          You
        </div>
      {/if}
    {:else}
      ?
    {/if}
  </div>
  <div class="flex flex-wrap absolute right-0 border-l border-b border-gold bg-navy text-white z-10 cursor-pointer justify-center px-2 py-1 gap-4"
    on:click={() => push('/') }>
    X
  </div>
  <div class="flex flex-col absolute -bottom-2 inset-x-0 text-white z-10 2xs:-bottom-3.5">
    <!-- <div class="ml-8 px-4 py-1 flex gap-x-1 items-center text-white"> -->
      <!-- <span>Arrange by</span> -->
      <InlineSelect bind:value={bySponsor}
        options={[
          ['Sponsors', true],
          ['Parents', false]
        ]}
        ></InlineSelect>
    <!-- </div> -->
  </div>
  {#await chartDataPromise}
    <div class="flex items-center justify-center absolute inset-0">
      <LoadingSpinner/>
    </div>
  {/await}
  <div class="grow flex">
    <div class="w-full min-h-[20px]" use:sigma></div>
  </div>
</div>
