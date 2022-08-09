<script lang="ts">
  import { capitalize } from 'lib/utils';
  import MiniFakeSigil from './MiniFakeSigil.svelte';

  export let sigilSearch = {};
  export let clan: ('galaxy' | 'star' | 'planet') = 'planet';

  let dropdownOpen = true;
</script>

<div class="flex items-center justify-center gap-2 py-2" on:click>
  <h3>
    {capitalize(clan)}:
  </h3>
  <MiniFakeSigil {clan} />
</div>

