import path from 'path'
import optionGenerator from './rspack.common'
import { FileManagerPlugin } from './plugins/file-manager'
import { DefinePlugin } from '@rspack/core'

const { name, version } = require(path.join(__dirname, '..', 'package.json'))

const outputDir = path.join(__dirname, '..', 'dist_prod')
const options = optionGenerator(outputDir)

const normalZipFilePath = path.join(__dirname, '..', 'market_packages', `${name}-${version}.zip`)
const sourceCodeForFireFox = path.join(__dirname, '..', 'market_packages', `${name}-${version}-src.zip`)

// Temporary directory for source code to archive on Firefox
const sourceTempDir = path.join(__dirname, '..', 'firefox')

const srcDir = ['public', 'src', 'package.json', 'tsconfig.json', 'webpack']
const copyMapper = srcDir.map(p => { return { source: path.join(__dirname, '..', p), destination: path.join(sourceTempDir, p) } })

const readmeForFirefox = path.join(__dirname, '..', 'doc', 'for-fire-fox.md')

options.plugins && options.plugins.push(
    new FileManagerPlugin({
        events: {
            // Archive at the end
            onEnd: [
                { delete: [path.join(outputDir, '*.LICENSE.txt')] },
                // Define plugin to archive zip for different markets
                {
                    delete: [normalZipFilePath],
                    archive: [{ source: outputDir, destination: normalZipFilePath }]
                },
                // Archive source code for FireFox
                {
                    copy: [
                        { source: readmeForFirefox, destination: path.join(sourceTempDir, 'README.md') },
                        { source: readmeForFirefox, destination: path.join(sourceTempDir, 'doc', 'for-fire-fox.md') },
                        ...copyMapper
                    ],
                    archive: [
                        { source: sourceTempDir, destination: sourceCodeForFireFox },
                    ],
                    delete: [sourceTempDir]
                }
            ]
        }
    }),
)

options.output && (options.output.path = outputDir)

export default options