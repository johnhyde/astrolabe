<script lang="ts">
  import { uxToHex } from 'lib/utils';
  import { normalizeId } from 'lib/id';
  import store from 'stores/store';
  import ExtensionWindow from '@/ExtensionWindow.svelte';

  export let patp: string;
</script>

{#if patp}
  <ExtensionWindow name="Shared Groups">
    TODO: implement for Groups 2, don't bother with Groups 1
  </ExtensionWindow>
{/if}

