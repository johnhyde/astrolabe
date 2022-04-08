<script lang="ts">
  import Doc from './Doc.svelte';

  export let path:string;
</script>

<div class="p-8 rounded-lg bg-white">
  <Doc {path} />
</div>
