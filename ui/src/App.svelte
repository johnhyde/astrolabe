<script lang="ts">
  import Router from 'svelte-spa-router';
  import Urbit from '@urbit/http-api';
  import { Charges, ChargeUpdateInitial, scryCharges } from '@urbit/api';
  import Home from './routes/Home.svelte';
  import ShipViewPage from './routes/ShipViewPage.svelte';
  import "./styles/tailwind-output.css";

  const routes = {
    '/': Home,
    '/ship/:patp': ShipViewPage,
    '*': Home,
  }
</script>

<main>
  <Router {routes} />
</main>

<svelte:head>
  <style>
    body {
      background-color: #1f243c;
    }
  </style>
</svelte:head>
