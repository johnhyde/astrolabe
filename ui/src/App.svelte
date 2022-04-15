<script lang="ts">
  import Router from 'svelte-spa-router';
  import Home from './routes/Home.svelte';
  import HelpPage from './routes/HelpPage.svelte';
  import ShipViewPage from './routes/ShipViewPage.svelte';
  import HelpModal from './components/HelpModal.svelte';
  import "./styles/styles.scss";

  const routes = {
    // '/': Home,
    '/help/:path?': HelpPage,
    '/:patp?': ShipViewPage,
    '/ship/:patp?': ShipViewPage,
    '*': Home,
  }
</script>

<main class="h-full overflow-y-auto">
  <HelpModal />
  <Router {routes} />
</main>
