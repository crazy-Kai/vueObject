var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var glob = require("glob");

var config = {
  entry: {
    vendor: ['vue', 'vue-router', './plugins/jquery-1.12.4.min.js']
  },
  output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
  },
  resolve: {
    extensions: ['', '.vue', '.js'],
    //当出现 Node.js 模块依赖查找失败的时候    fallback
    fallback: path.join(__dirname, "node_modules"),
    alias: {
          'vue$': 'vue/dist/vue.js'
    }
  },
  resolveLoader: {//resolveLoader 用来配置 loader 模块的解析
        //当出现 Node.js 模块依赖查找失败的时候    fallback
        fallback: path.join(__dirname, "node_modules")
  },

  module: {
    loaders: [
      {
         test: /\.(vue)$/,
         loader: 'vue',
         options: {
            loaders: {
                css: 'css',
                less: 'less',
                js:'babel'
            }
        }
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src/app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src/app'),
        loader: 'raw'
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor']
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    //全局挂载插件,将jquery挂载为全局的,使用 ProvidePlugin 加载使用率高的依赖库
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    })
   
  ]
};
/**
* 动态查找所有入口文件
*/

var files = glob.sync('./src/app/*/index.js');
var newEntries = {};

files.forEach(function(f){
   var name = /.*\/(app\/.*?\/index)\.js/.exec(f)[1];//得到apps/question/index这样的文件名
   newEntries[name] = f;
});

config.entry = Object.assign({}, config.entry, newEntries);

module.exports = config;
