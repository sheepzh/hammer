import path from 'path'
import { FileManagerPlugin } from './plugins/file-manager'
import { GenerateJsonPlugin } from './plugins/generate-json'
import optionGenerator from './rspack.common'
import { DefinePlugin } from '@rspack/core'

const outputDir = path.resolve(__dirname, '..', 'dist_dev')

let manifest: any

const options = optionGenerator(
    outputDir,
    baseManifest => {
        baseManifest['name'] = 'IS DEV'
        manifest = baseManifest
    }
)

const manifestFirefoxName = 'manifest-firefox.json'
// The manifest.json is different from Chrome's with add-on ID
const firefoxManifestGeneratePlugin = new GenerateJsonPlugin(manifestFirefoxName,
    { ...manifest, browser_specific_settings: { gecko: { id: 'timer@zhy' } } }
)
if (options.plugins) {
    options.plugins.push(firefoxManifestGeneratePlugin)
    const firefoxDevDir = path.join(__dirname, '..', 'firefox_dev')
    // Generate FireFox dev files
    options.plugins.push(
        new FileManagerPlugin({
            events: {
                onEnd: [
                    {
                        copy: [{ source: outputDir, destination: firefoxDevDir }],
                        delete: [path.join(outputDir, manifestFirefoxName), path.join(firefoxDevDir, 'manifest.json')],
                    }
                ]
            }
        }),
    )
}

options.output && (options.output.path = outputDir)

// no eval with development, but generate *.map.js
options.devtool = 'cheap-module-source-map'

export default options