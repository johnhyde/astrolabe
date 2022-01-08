<script lang="ts">
  import Router from 'svelte-spa-router';
  import Urbit from '@urbit/http-api';
  import { Charges, ChargeUpdateInitial, scryCharges } from '@urbit/api';
  import Home from './components/Home.svelte';
  import ShipViewPage from './components/ShipViewPage.svelte';
  import "./styles/tailwind-output.css";

  const routes = {
    '/': Home,
    '/ship/:patp': ShipViewPage,
    '*': Home,
  }
</script>

<main class="h-screen bg-green-600">
  <Router {routes} />
</main>
