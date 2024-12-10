import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import path from 'path';

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    port: 3000,
    static: {
      directory: path.resolve('public'),
    },
    compress: true,
    historyApiFallback: true,
  },
});
