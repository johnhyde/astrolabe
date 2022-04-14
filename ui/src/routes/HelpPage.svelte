<script lang="ts">
  import DocModal from '../components/DocModal.svelte';
  export let params: any = {};
  $: path = params.path || '';

  // $: title = path ? capitalizeWords(path.replace(/-/g, ' ')) : 'Help';

</script>

<DocModal {path} />
