import { Plugin } from '@nuxt/types'
import algoliasearch from 'algoliasearch/lite'

const plugin: Plugin = (context) => {
  console.log('plugin algolia initialize indexes')
  const algoliaConfig = context.$config.algoliaConfig
  const client = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey)
  context.$taskIndex = client.initIndex(algoliaConfig.taskIndexName)
}

export default plugin
