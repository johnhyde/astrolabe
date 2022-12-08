<script lang="ts">
  import { getPal, addPal, removePal } from 'lib/pals';
  import store from 'stores/store';
  import ExtensionWindow from '@/ExtensionWindow.svelte';
  import PalStatusIndicator from './PalStatusIndicator.svelte';
  import PalTagger from './PalTagger.svelte';

  export let patp: string;

  $: pal = getPal($store.pals, patp);
  $: palAdded = pal.status == 'outgoing' || pal.status == 'mutual';
  $: [buttonText, buttonFunc]  = palAdded ? ['Remove Pal', removePal] : ['Add Pal', addPal];
  $: itsUs = patp.substring(1) === window.ship;
</script>

{#if $store.palsInstalled && !itsUs}
  <ExtensionWindow name="%pals" halfWidth>
    <svelte:fragment slot="top-bar">
      <div class="grow ml-1 my-2 flex justify-center align-center">
          <PalStatusIndicator status={pal.status} acked={pal.ack} />
        <button class="bg-gray-200 ml-3 px-2 rounded" on:click={() => buttonFunc(patp)}>
          {buttonText}
        </button>
      </div>
    </svelte:fragment>
    
    {#if palAdded}
      <div class="flex flex-wrap justify-center gap-3 my-3 conteents">
        <PalTagger {patp}></PalTagger>
      </div>
    {/if}
  </ExtensionWindow>
{/if}

