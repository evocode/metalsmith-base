# Metalsmith Base

A metalsmith base starter kit used at [Evocode.com](http://evocode.com/). Some features:

- [Metalsmith](http://metalsmith.io/)
- [Gulp](http://gulpjs.com/)
- [Bootstrap 4](https://github.com/twbs/bootstrap/tree/v4-dev)
- [jQuery](https://github.com/jquery/jquery)
- [Babel / ES6](https://babeljs.io/)
- [Development Server](https://github.com/evocode/metalsmith-base/blob/master/gulpfile.js#L160)
- [Static Site, Blog, Robots, Sitemap](https://github.com/evocode/metalsmith-base/tree/master/content)
- [MIT license](https://github.com/evocode/metalsmith-base/blob/master/LICENSE)

## Install

```
mkdir newproject
git clone git@github.com:evocode/metalsmith-base.git newproject
cd newproject
npm install
```
## Develop

This command will fully build a development version of the site, start the gulp watchers, and setup a development server. The command output will list the server address to open in your browser.

```
npm run start
```

## Build

This command will build a production version of the site and sync it with a git repository, ready to be comitted.

To link the build process to your repository, you can do of the following options:

1. Create a repo dotfile: `echo "git@github.com:username/repository.git" > .buildrepo`
1. Edit `package.json` script section: `"build": "./node_modules/.bin/gulp --production --build && ./build.sh git@github.com:username/repository.git"`

After the repository is setup, simply run:

```
npm run build
```

## Commands

1. `npm run dev` - Run a development build
1. `npm run start` - Run a development build, start the development server and watchers
1. `npm run debug` - Run a development build in debug mode
1. `npm run production` - Run a production build, compiles assets and minifies
1. `npm run build` - Run a production build and sync with git
1. `npm run watch` - Start the gulp watchers
1. `npm run vendor` - Copies over any vendor files from node_modules to metalsmith assets

All commands can be run directly with: `./node_modules/.bin/gulp`
