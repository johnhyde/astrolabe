<script lang="ts">
  import Symbol from './Symbol.svelte';

  import type { PartType, SymbolQuery } from 'types/sigil';
  import { PART_TYPES } from 'types/sigil';

  export let partType: PartType;
  export let focused: boolean = false;

  let size = 48;
  $: focusedClasses = focused ? 'border border-gold-s1 border-2' : '';
</script>

<div class="border-2 w-[48px] {focusedClasses}" on:click>
  {#if partType === 'geon'}
    <Symbol components={['ghb']} {size} />
  {:else if partType === 'line'}
    <Symbol components={['lvf', 'lvfl', 'lvfr', 'lhf', 'lhft', 'lhfb', 'lff', 'lbf']} {size} inverted />
  {:else if partType === 'arc'}
    <Symbol components={['abl202', 'abl402', 'abl602', 'abl802', 'ar124', 'ar224', 'ar424' ]} {size} inverted />
  {:else if partType === 'ring'}
    <Symbol components={['rm1', 'rm2', 'rm3']} {size} inverted />
  {:else if partType === 'circle'}
    <Symbol components={[
      // 'ctr1mb', 'cbr1mb', 'cbl1mb', 'ctl1mb',
      'cbr3mb', 'ctl3mb',
      'cmmb',
      'ct2mb', 'cl2mb', 'cb2mb', 'cr2mb',
    ]} {size} inverted />
  {:else if partType === 'donut'}
    <Symbol components={['dbl', /*'dl',*/ 'dm', 'dtl', 'dtr']} {size} inverted />
  {:else if partType === 'bezier'}
    <Symbol components={['b1l1', 'b1l2', 'b1l3']} {size} inverted />
  {:else}
    not {partType}
  {/if}
</div>

