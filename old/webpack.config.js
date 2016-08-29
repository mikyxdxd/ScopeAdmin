var webpack = require('webpack');
var config = {

    contex:__dirname + '/app',
    entry:'./app/index.js',
    output:{

        path:__dirname + '/app',
        filename:'build.js'
    },

    resolve: {
        alias: {
            "eventEmitter/EventEmitter": "wolfy87-eventemitter"
        },
        extensions: ['', '.js', '.jsx']
    },

    plugins:[],

    module:{

        loaders:[

            {test:/\.js$/,loader:'ng-annotate!babel', exclude: /node_modules/},
            {test:/\.html$/, loader:'raw', exclude: /node_modules/},
            {test:/\.css$/,loader:'style!css'},
            {test:/\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,loader:'file'},
            {test: /isotope\-|fizzy\-ui\-utils|desandro\-|masonry|outlayer|get\-size|doc\-ready|eventie|eventemitter|masonry/, loader: 'imports?define=>undefined' },
            {test: /vendor/, loader: 'imports?define=>undefined' }
        ]
    }
}

if(process.env.NODE_ENV == 'production'){

    config.output.path = __dirname + '/dist';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    config.devtool = 'source-map';
}
module.exports = config;