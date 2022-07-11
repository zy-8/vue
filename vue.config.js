const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const CopyPlugin = require("copy-webpack-plugin");
const buildTime = new Date().getTime()

module.exports = {
  configureWebpack:{
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/static', to: 'static'}
        ],

      })
    ]
  },
  pages:{
    mailstart:{
      buildTime: buildTime,
      entry:"src/mailstart.js",
      template:"public/index.html",
      filename:"mailstart.html",
    },
    testcode:{
      buildTime: buildTime,
      entry:"src/testcode.js",
      template:"public/index.html",
      filename:"testcode.html",
    },
    maildetail:{
      buildTime: buildTime,
      entry:"src/maildetail.js",
      template:"public/index.html",
      filename:"maildetail.html",
    },
    guide:{
      buildTime: buildTime,
      entry:"src/guide.js",
      template:"public/index.html",
      filename:"guide.html"
    },
    feedback:{
      buildTime: buildTime,
      entry:"src/feedback.js",
      template:"public/index.html",
      filename:"feedback.html"
    },
    error:{
      buildTime: buildTime,
      entry:"src/error.js",
      template:"public/index.html",
      filename:"error.html"
    },
    generalRes: {
      buildTime: buildTime,
      entry: "src/generalRes.js",
      template: "public/generalRes.html",
      filename: "generalRes.html"
    }
  },
  productionSourceMap:false,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  publicPath: './',
  devServer: {
    open: false,
    port: 8080,
    https: false,
    proxy: {
      '/': {
        "target": "https://testing-vdi.zdgzc.com",
        ws: true,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        },
      },
    },
  },
  
  
  // publicPath: process.env.NODE_ENV === 'production' ? './' : './',





}