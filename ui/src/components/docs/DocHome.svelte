<script lang="ts">
  import DocLink from "./DocLink.svelte";

  function convertLinks(html: string): string {
    let converted = html;
    const externalLinkRegex = /href="http/g;
    converted = converted.replace(externalLinkRegex, 'target="_blank" href="http');
    return converted;
  }
</script>

<div class="doc">
  <h1 class="text-center">Table of Contents</h1>
  <DocLink path="urbit-id" on:navigate>
    <h2>What is an Urbit ID?</h2>
  </DocLink>
  <!-- <h2>Ship Classes</h2> -->
  <ul>
    <li>
      <DocLink path="galaxy" on:navigate>
        <h3>Galaxies</h3>
      </DocLink>
    </li>
    <li>
      <DocLink path="star" on:navigate>
        <h3>Stars</h3>
      </DocLink>
    </li>
    <li>
      <DocLink path="planet" on:navigate>
        <h3>Planets</h3>
      </DocLink>
    </li>
    <li>
      <DocLink path="moon" on:navigate>
        <h3>Moons</h3>
      </DocLink>
    </li>
    <li>
      <DocLink path="comet" on:navigate>
        <h3>Comets</h3>
      </DocLink>
    </li>
  </ul>
  <DocLink path="keys" on:navigate>
    <h2>Keys</h2>
  </DocLink>
</div>
