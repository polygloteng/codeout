<template>
  <v-app>
    <v-navigation-drawer app v-model="data.drawer" clipped>
      <v-container>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6 grey--text text--darken-2">
              Navigation lists
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list nav dense>
          <v-list-group
            v-for="nav_list in data.nav_lists"
            :key="nav_list.name"
            :prepend-icon="nav_list.icon"
            no-action
            :append-icon="nav_list.lists ? undefined : ''"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ nav_list.name }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="list in nav_list.lists" :key="list">
              <v-list-item-content>
                <v-list-item-title>{{ list }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-container>
    </v-navigation-drawer>
    <v-app-bar color="primary" dark app clipped-left>
      <v-app-bar-nav-icon
        @click.stop="data.drawer = !data.drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Vuetify</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text to="/inspire">For Inspiration</v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text>Support<v-icon>mdi-menu-down</v-icon></v-btn>
          </template>
          <v-list>
            <v-subheader>Get help</v-subheader>
            <v-list-item v-for="support in data.supports" :key="support.name">
              <v-list-item-icon>
                <v-icon>{{ support.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ support.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer color="primary" dark app> Vuetify </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api'

interface Support {
  name: string
  icon: string
}

interface NavList {
  name: string
  icon: string
  lists?: string[]
}

interface Data {
  clipped: boolean
  drawer: boolean
  supports: Support[]
  nav_lists: NavList[]
}

export default defineComponent({
  setup() {
    const data = reactive<Data>({
      clipped: false,
      drawer: false,
      supports: [
        { name: 'Consulting and suppourt', icon: 'mdi-vuetify' },
        { name: 'Discord community', icon: 'mdi-discord' },
        { name: 'Report a bug', icon: 'mdi-bug' },
        { name: 'Github issue board', icon: 'mdi-github' },
        { name: 'Stack overview', icon: 'mdi-stack-overflow' },
      ],
      nav_lists: [
        {
          name: 'Getting Started',
          icon: 'mdi-speedometer',
          lists: ['Quick Start', 'Pre-made layouts'],
        },
        {
          name: 'Customization',
          icon: 'mdi-cogs',
        },
        {
          name: 'Styles & animations',
          icon: 'mdi-palette',
          lists: ['Colors', 'Content', 'Display'],
        },
        {
          name: 'UI Components',
          icon: 'mdi-view-dashboard',
          lists: ['API explorer', 'Alerts'],
        },
        {
          name: 'Directives',
          icon: 'mdi-function',
        },
        {
          name: 'Preminum themes',
          icon: 'mdi-vuetify',
        },
      ],
    })
    return { data }
  },
})
</script>
