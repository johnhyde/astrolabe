import sveltePreprocess from 'svelte-preprocess';

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess(),
  onwarn: (warning, handler) => {
    // Don't warn when using use:link
    if (warning.code === 'a11y-missing-attribute') return

    handler(warning)
  },
};
