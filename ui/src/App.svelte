<script lang="ts">
  import Router from 'svelte-spa-router';
  import HelpPage from './routes/HelpPage.svelte';
  import Home from './routes/Home.svelte';
  import HelpModal from './components/HelpModal.svelte';
  import "./styles/styles.scss";

  const routes = {
    '/help/:path?': HelpPage,
    // '/:patp?': Home,
    '/ship/:patp?': Home,
    '/search/:search?': Home,
    '*': Home,
  }
  import pageName from './stores/pageName';

  $: title = $pageName ? `Astrolabe - ${$pageName}` : 'Astrolabe';

  $: {
    document.title = title
  }
</script>

<main class="h-full overflow-y-auto">
  <HelpModal />
  <Router {routes} />
</main>

<svelte:head>
  <title>{title}</title>
</svelte:head>