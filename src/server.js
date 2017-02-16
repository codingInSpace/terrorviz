import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server } from 'http';
import chalk from 'chalk';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import apiRoutes from './api/routes';

const app = express()
app.use(helmet())
app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '../public/index.html')
})

// Mount api routes
app.use('/api', apiRoutes)

const port = process.env.PORT || 8080;
const devPort = process.env.DEV_PORT || 1337;
const developing = process.env.NODE_ENV !== 'production';

// Dev server with proxy
if (developing) {
  console.log(chalk.yellow('dev server'))
  const config = require("../webpack.config.dev.js");
  const devServer = new WebpackDevServer(webpack(config), {
    stats: {colors: true},
    publicPath: config.output.publicPath,
    hot: true,
    inline: true,
    proxy: {
      '/api/*' : {
        target: `http://localhost:${port}/`,
      }
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  });

  devServer.listen(devPort, 'localhost', (err, result) => {
    if (err) console.log(chalk.yellow(err));
    console.log(chalk.magenta('Dev server listening at localhost:' + devPort + ' with proxy to localhost:' + port));
    console.log(chalk.magenta('Visit http://localhost:1337/ :D :D'));
  });
}

const server = new Server(app);
server.listen(port, err => {
  if (err) return console.error(err);
  console.log(chalk.cyan(`Server running on http://localhost:${port} :D`));
});
