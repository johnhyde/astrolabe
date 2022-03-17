# Astrolabe
Astrolabe (%astrolabe) is a one-stop shop %docket app for exploring Urbit address space. Main features: ID Search, Sigil Search, Sky Chart, and Ship View (for viewing a given ship's details). Astrolabe integrates with %pals wherever possible, and contains documentation to explain the many quirks of Urbit address space to a new user.

# Justification
There should be a place on Urbit to explore Urbit address space. It will help new Urbiters get their bearings, and be a useful tool for anyone who wants to explore. Having open-source tools for this in one place _on Urbit_ is important.
I like the name _Astrolabe_, because it's an old-timey guide to the heavenly bodies. _Planisphere_ could also be cool.

# Proposal
You can read about the proposal [here](https://urbit.org/grants/astrolabe), and discuss in the dedicated group on Urbit: `~poster-hoster-midlev-mindyr/astrolabe`

# The Code
## Desk

The desk currently has the minimum amount of files necessary to distribute an application and should be distributable immediately. Any further Hoon development should happen here.

## UI

Astrolabe is built primarily using [Svelte], [Typescript], and [Tailwind CSS]. [Vite] ensures that all code and assets are loaded appropriately, bundles the application for distribution and provides a functional dev environment.

### Getting Started

To get started using Astrolabe first you need to run `npm install` inside the `ui` directory.

To develop you'll need a running ship to point to. To do so you first need to add a `.env.local` file to the `ui` directory. This file will not be committed. Adding `VITE_SHIP_URL={URL}` where **{URL}** is the URL of the ship you would like to point to, will allow you to run `npm run dev`. This will proxy all requests to the ship except for those powering the interface, allowing you to see live data.

Regardless of what you run to develop, Vite will hot-reload code changes as you work so you don't have to constantly refresh.

### Deploying

To deploy, run `npm run build` in the `ui` directory which will bundle all the code and assets into the `dist/` folder. This can then be made into a glob by doing the following:

1. Create or launch an urbit using the -F flag
2. On that urbit, if you don't already have a desk to run from, run `|merge %work our %base` to create a new desk and mount it with `|mount %work`.
3. Now the `%work` desk is accessible through the host OS's filesystem as a directory of that urbit's pier ie `~/zod/work`.
4. From the `ui` directory you can run `rsync -avL --delete dist/ ~/zod/work/astrolabe` where `~/zod` is your fake urbit's pier.
5. Once completed you can then run `|commit %work` on your urbit and you should see your files logged back out from the dojo.
6. Now run `=dir /=garden` to switch to the garden desk directory
7. You can now run `-make-glob %work /astrolabe` which will take the folder where you just added files and create a glob which can be thought of as a sort of bundle. It will be output to `~/zod/.urb/put`.
8. If you navigate to `~/zod/.urb/put` you should see a file that looks like this `glob-0v5.fdf99.nph65.qecq3.ncpjn.q13mb.glob`. The characters between `glob-` and `.glob` are a hash of the glob's contents.
9. Now that we have the glob it can be uploaded to any publicly available HTTP endpoint that can serve files. This allows the glob to distributed over HTTP.
10. Once you've uploaded the glob, you should then update the corresponding entry in the docket file at `desk/desk.docket-0`. Both the full URL and the hash should be updated to match the glob we just created, on the line that looks like this:

```hoon
    glob-http+['https://bootstrap.urbit.org/glob-0v5.fdf99.nph65.qecq3.ncpjn.q13mb.glob' 0v5.fdf99.nph65.qecq3.ncpjn.q13mb]
```

11. This can now be safely committed and deployed.

[svelte]: https://svelte.dev/
[typescript]: https://www.typescriptlang.org/
[tailwind css]: https://tailwindcss.com/
[vite]: https://vitejs.dev/
