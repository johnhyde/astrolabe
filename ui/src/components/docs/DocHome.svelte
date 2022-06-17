<script lang="ts">
  import DocLink from "./DocLink.svelte";

  function convertLinks(html: string): string {
    let converted = html;
    const externalLinkRegex = /href="http/g;
    converted = converted.replace(externalLinkRegex, 'target="_blank" href="http');
    return converted;
  }
</script>

<div class="doc w-auto mx-auto">
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
  <DocLink path="patpee" on:navigate>
    <h2>What is a @p?</h2>
  </DocLink>
  <ul>
    <li>
      <DocLink path="phonemes" on:navigate>
        <h3>Phonemes - Prefixes & Suffixes</h3>
      </DocLink>
    </li>
  </ul>
  <DocLink path="azimuth" on:navigate>
    <h2>What is Azimuth?</h2>
  </DocLink>
  <ul>
    <li>
      <DocLink path="l2" on:navigate>
        <h3>Layer 1 and Layer 2</h3>
      </DocLink>
    </li>
    <li>
      <DocLink path="keys" on:navigate>
        <h3>Networking Keys</h3>
      </DocLink>
    </li>
  </ul>
  <DocLink path="astrolabe" on:navigate>
    <h2>About Astrolabe</h2>
  </DocLink>
</div>
