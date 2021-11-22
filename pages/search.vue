<template>
  <div>
    <v-container>
      <v-row justify="center">
        <div>キーワード：{{ keywords }}</div>
        <v-col cols="12" xl="8">
          <v-row>
            <v-col v-for="task in tasks" :key="task.name" cols="12" sm="6" md="4">
              <v-card class="pa-2" outlined tile hover :to="'/tasks/' + task.id">
                <v-img height="250" :src="`${$config.assetsDomain}/images/study.png`"></v-img>
                <v-card-title>{{ task.name }}</v-card-title>
                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :value="task.avg_rating"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                    ></v-rating>
                    <div class="grey--text ms-4">{{ task.avg_rating }}</div>
                  </v-row>
                </v-card-text>
                <v-card-subtitle class="text-truncate">
                  {{ task.description }}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useTaskSearch } from '~/composables/search'

export default defineComponent({
  beforeRouteUpdate(to, _from, next) {
    this.keywords = to.query.keywords
    this.doSearch(to.query.keywords)
    next()
  },
  setup() {
    const context = useContext()
    const keywords = context.query.value.keywords
    const { tasks, doSearch } = useTaskSearch(context, keywords)
    return { tasks, keywords, doSearch }
  },
})
</script>

<style></style>
