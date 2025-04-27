import CopyWebpackPlugin from 'copy-webpack-plugin'
import GenerateJsonPlugin from 'generate-json-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { DefinePlugin, type Configuration, type WebpackPluginInstance } from 'webpack'
import manifest from '../src/manifest'
import i18nChrome from '../src/util/i18n/chrome'
import tsConfig from '../tsconfig.json'

const tsPathAlias = tsConfig.compilerOptions.paths

// Process the alias of typescript modules
const resolveAlias: { [index: string]: string | false | string[] } = {}
const aliasPattern = /^(@.*)\/\*$/
const sourcePattern = /^(src(\/.*)?)\/\*$/
Object.entries(tsPathAlias).forEach(([alias, sourceArr]) => {
    if (!sourceArr.length) {
        return
    }
    const aliasMatchRes = alias.match(aliasPattern)
    if (!aliasMatchRes) {
        // Only process the alias starts with '@'
        return
    }
    const [, index] = aliasMatchRes
    const webpackSourceArr: string[] = []
    sourceArr.forEach(source => {
        const matchRes = source.match(sourcePattern)
        if (!matchRes) {
            // Only set alias which is in /src folder
            return
        }
        const [, folder] = matchRes
        webpackSourceArr.push(path.resolve(__dirname, '..', folder))
    })
    resolveAlias[index] = webpackSourceArr
})
console.log("Alias of typescript: ")
console.log(resolveAlias)

const optionGenerator = (outputPath: string, manifestHooker?: (manifest: any) => void) => {
    manifestHooker && manifestHooker(manifest)
    const plugins: WebpackPluginInstance[] = [
        // Generate json files 
        new GenerateJsonPlugin('manifest.json', manifest) as unknown as WebpackPluginInstance,
        new HtmlWebpackPlugin({
            filename: path.join('static', 'app.html'),
            chunks: ['app'],
        }),
        // copy static resources
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '..', 'public', 'images'),
                    to: path.join(outputPath, 'static', 'images'),
                }
            ]
        }),
        new MiniCssExtractPlugin(),
        new DefinePlugin({
            // https://github.com/vuejs/vue-cli/pull/7443
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ]

    const localeJsonArr = Object.entries(i18nChrome)
        .map(([locale, message]) => new GenerateJsonPlugin(`_locales/${locale}/messages.json`, message))
        .map(plugin => plugin as unknown as WebpackPluginInstance)
    plugins.push(...localeJsonArr)

    const config: Configuration = {
        entry: {
            content_scripts: './src/content-script',
            app: './src/app',
            background: './src/background'
        },
        output: {
            filename: '[name].js',
        },
        plugins,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /^(node_modules|test|script)/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            assumptions: {
                                // Fix that react transform array proxy to object, and error occurs while destructing
                                iterableIsArray: true,
                            },
                            presets: ["@babel/preset-env"],
                            plugins: [
                                "@vue/babel-plugin-jsx",
                                "@babel/plugin-transform-modules-commonjs",
                            ],
                        },
                    }, 'ts-loader'],
                }, {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                }, {
                    test: /\.sc|ass$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                }, {
                    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                    exclude: /node_modules/,
                    use: ['url-loader']
                }, {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use: ['babel-loader']
                }
            ]
        },
        resolve: {
            extensions: [".tsx", '.ts', ".js", '.css', '.scss', '.sass'],
            alias: resolveAlias,
        }
    }
    return config
}


export default optionGenerator