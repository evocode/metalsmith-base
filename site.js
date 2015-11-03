module.exports = {
  "sources": [],
  "scripts": {},
  "styles": {
    "prefix": ["> 1%", "last 2 versions", "IE >= 9"],
    "include": []
  },
  "metalsmith": {
    "metadata": {
      "site": {
        "url": "https://github.com/evocode/metalsmith-base"
      }
    },
    "config": {
      "srcRoot": "./src",
      "assetRoot": "./sources",
      "scriptRoot": "./scripts",
      "styleRoot": "./styles",
      "layoutRoot": "./layouts",
      "destRoot": "./public"
    },
    "plugins": {
      "metalsmith-drafts": {},
      "metalsmith-markdown": {},
      "metalsmith-excerpts": {},
      "metalsmith-permalinks": {
        "pattern": ":collection/:title"
      },
      "metalsmith-collections": {
        "blog": {
          "sortBy": "date",
          "reverse": true
        }
      },
      "metalsmith-pagination": {
        "collections.blog": {
          "perPage": 6,
          "layout": "blog.html",
          "first": "blog/index.html",
          "noPageOne": true,
          "path": "blog/:num/index.html"
        }
      },
      "metalsmith-layouts": {
        "engine": "handlebars",
        "directory": "./layouts",
        "partials": "./layouts/partials"
      },
      "metalsmith-assets": {
        "source": "./sources",
        "destination": "./"
      },
      "metalsmith-html-minifier": {
        "_metalsmith_if": "args.production",
        "removeAttributeQuotes": false,
        "keepClosingSlash": true
      }
    }
  }
}
