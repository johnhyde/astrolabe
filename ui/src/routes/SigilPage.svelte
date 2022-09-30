<script lang="ts">
  import { prefixes, suffixes } from 'lib/id';
  import Sigil from "@/Sigil.svelte";
  import Legil from "@/Legil.svelte";
  
  let index: number = undefined;
  let altBgColor = 'red';

  let phonemes = prefixes.map(p => p + 'zod').concat(suffixes).sort().map(p => '~' + p);

  function into(i) {
    index = i;
  }

  function out() {
    index = undefined;
  }

  function forward() {
    index = index + 1;
    index = Math.min(511, index);
  }

  function back() {
    index = index - 1;
    index = Math.max(0, index);
  }
</script>

<div class="bg-white m-4">
  {#if index == undefined}
    <div class="flex flex-wrap">
      {#each phonemes as phoneme, i}
      <div class="w-[128px] m-2" on:click={() => into(i)}>
        <h2>
          {phoneme}
        </h2>
        <div class="flex">
          <Sigil patp={phoneme} size={64} {altBgColor} />
          <Sigil patp={phoneme} size={64} {altBgColor} useNew />
          <Legil patp={phoneme} size={64} {altBgColor} />
        </div>
      </div>
      {/each}
    </div>
  {:else}
    <div class="flex gap-2">
      <button class="p-4 border" on:click={back}>&lt;</button>
      <button class="p-4 border" on:click={out}>^</button>
      <button class="p-4 border" on:click={forward}>&gt;</button>
    </div>
    <h2>
      {phonemes[index]}
    </h2>
    <div class="flex w-full">
      <Sigil patp={phonemes[index]} size={400} {altBgColor} />
      <Sigil patp={phonemes[index]} size={400} {altBgColor} useNew />
      <Legil patp={phonemes[index]} size={400} {altBgColor} />
    </div>
  {/if}
</div>
