<script lang="ts">
  import appState from '../stores/appState';
  import DocModal from '../components/DocModal.svelte';
</script>

<DocModal modal showModal={$appState.showDoc} path={$appState.path} />
