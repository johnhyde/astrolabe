<script lang="ts">
  import Router from 'svelte-spa-router';
  import SigilPage from './routes/SigilPage.svelte';
  import HelpPage from './routes/HelpPage.svelte';
  import Home from './routes/Home.svelte';
  import HelpModal from '@/docs/HelpModal.svelte';
  import "./styles/styles.scss";
  import docs from 'stores/docs';
  import keys from 'stores/keys';

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

  function inputEvent(event) {
    if (event.target.tagName == 'INPUT') return true;
    if (event.target.tagName == 'TEXTAREA') return true;
    return false;
  }

  function handleKeyDown(event: KeyboardEvent) {
    keys.runCallbacks($keys.globalkeydown, event);
    if (!inputEvent(event)) {
      keys.runCallbacks($keys.keydown, event);
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    keys.runCallbacks($keys.globalkeyup, event);
    if (!inputEvent(event)) {
      keys.runCallbacks($keys.keyup, event);
    }
  }

  $:{
    $keys.keyup.get('?').set('app', () => docs.show(''));
    $keys.keyup.get('shift+?').set('app', () => docs.show(''));
    $keys.globalkeyup.get('escape').set('app', (event) => {
      if (inputEvent(event)) {
        event.target.blur();
      }
    });
  }
</script>

<main class="h-full overflow-y-auto">
  <HelpModal />
  <Router {routes} />
</main>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<svelte:body on:keydown={handleKeyDown} on:keyup={handleKeyUp} />