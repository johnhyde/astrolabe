<script lang="ts">
  import Router from 'svelte-spa-router';
  import SigilPage from './routes/SigilPage.svelte';
  import HelpPage from './routes/HelpPage.svelte';
  import Home from './routes/Home.svelte';
  import HelpModal from '@/docs/HelpModal.svelte';
  import "./styles/styles.scss";

  // const routes = {
  //   '/help/:path?': HelpPage,
  //   // '/:patp?': Home,
  //   '/ship/:patp?': Home,
  //   '/search/:search?': Home,
  //   '*': Home,
  // }

  const routes = {
    '/sigil': SigilPage,
    '/help/:path?': HelpPage,
    // '/:patp?': Home,
    // '/ship/:patp?': Home,
    // '/search/:search?': Home,
    '/:mode?/:arg?': Home,
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