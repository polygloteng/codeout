import { Plugin } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'

const plugin: Plugin = ({ store }) => {
  createPersistedState({
    key: 'codeout',
  })(store)
}

export default plugin
