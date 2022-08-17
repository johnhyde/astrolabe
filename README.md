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

To develop you'll need a running ship to point to. If it's running somewhere other than `http://localhost:8081`, make a copy of `.env` in the `ui` directory and name it `.env.local`. This file will not be committed. Change `VITE_SHIP_URL` to the URL of the ship you would like to point to.

Once your URL is correctly configured, you can run `npm run dev`. This will proxy all requests to the ship except for those powering the interface, allowing you to see live data.

Regardless of what you run to develop, Vite will hot-reload code changes as you work so you don't have to constantly refresh.

# Deploying

1. Spin up a comet or distribution ship.
2. Mount an `%astrolabe` desk. In Dojo:
    1. `|merge %astrolabe our %base` to create a new desk.
    2. `|mount %astrolabe` to mount it.
    3. Set `ASTROLABE_DESK` in `.env.local` if the path to your desk is different.
3. Create and upload `glob-http`, if applicable (see below)
3. Install the desk
    1. From the `ui` folder: `npm run install:desk`
    2. From the distribution ship's dojo: `:treaty|unpublish %astrolabe`
    2. From middleman or distribution ship's dojo: `|commit %astrolabe`
    3. (if using a comet as a middleman) `|public %astrolabe`
    4. (if using a comet as a middleman) from the actual distribution ship: `|install ~comet-name %astrolabe` or `|resume %astrolabe`
    5. (if using a comet as a middleman) from the actual distribution ship: `|pause %astrolabe`
4. Build UI and upload `glob-ames` 
5. Publish the desk from dojo: `:treaty|publish %astrolabe`

## Deploying with `glob-ames` glob
Initial Setup:
1. Put the line `glob-ames+[~dister-midlev-mindyr 0v0]` in `desk.docket-0` if it's not there, where `~dister-midlevi-mindyr` is the `@p` of the distribution ship.

Every Time:
4. Build the UI with `npm run build` in the `ui` directory which will bundle all the code and assets into the `dist/` folder.
5. Upload the `dist/` folder as a glob to your distribution ship. Example url: https://distribution.urbit-ship.com/docket/upload

## Deploying with `glob-http` glob
Initial Setup:
1. Spin up a globber ship (comet or fakezod) (or just reuse your dev ship for this).
2. Mount an `%globber` desk. In Dojo:
    1. `|merge %globber our %base` to create a new desk.
    2. `|mount %globber` to mount it.
    3. Set `GLOBBER_DESK` in `.env.local` if the path to your globber desk is different.

Every Time:
4. From the `ui` directory, run `npm run release` to build the ui and copy it to your globber desk
5. From the globber ship: `|commit %globber` (create basic mark files (see `png.hoon`) for any files without mark files)
6. Now run `=dir /=garden=` to switch to the garden desk directory
7. `-make-glob %globber /astrolabe` which will take the folder where you just added files and create a glob which can be thought of as a sort of bundle. It will be output to `~/zod/.urb/put`.
8. `=dir` to return to base desk.
8. From the `ui` directory, run `npm run get-glob` to place the latest glob in the `globs` folder.
9. Copy the string printed by the last step, and paste it into `desk.docket-0`.
8. Upload the glob in `/globs/` to any publicly available HTTP endpoint that can serve files. This allows the glob to distributed over HTTP.
10. Once you've uploaded the glob, paste the url into `desk/desk.docket-0`. Both the full URL and the hash should be updated to match the glob we just created, on the line that looks like this:
    ```hoon
        glob-http+['https://bootstrap.urbit.org/glob-0v5.fdf99.nph65.qecq3.ncpjn.q13mb.glob' 0v5.fdf99.nph65.qecq3.ncpjn.q13mb]
    ```

[svelte]: https://svelte.dev/
[typescript]: https://www.typescriptlang.org/
[tailwind css]: https://tailwindcss.com/
[vite]: https://vitejs.dev/
