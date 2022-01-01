<template>
  <div>

    <v-container fluid class="codeout-head-area py-sm-10 px-sm-16 pt-10 pb-10 px-6">
      <h2 class="">「{{ keywords }}」のレッスン一覧</h2>
    </v-container>

    <v-container fluid class="codeout-content-area py-sm-16 px-sm-16 pt-10 pb-10 px-6">
      <v-row>
        <!--サムネ画像の表示確認用に、ファイル名末尾の連番をループカウントで暫定的に付与しています。（12/29佐藤）-->
        <v-col class="codeout-card-align-stretch pa-6" v-for="(task, index) in tasks" :key="task.name" cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
          <v-card class="rounded-lg" hover :to="'/tasks/' + task.objectID">
            <!--DB側に画像もしくはファイル名情報を持たせた方が良いかもしれません。（12/29佐藤）-->
            <v-img height="240" :src="`${$config.assetsDomain}/images/top_study_thumb0${index+1}.png`"></v-img>
            <v-card-title>{{ task.name }}</v-card-title>
            <v-card-text>
              <v-row class="mx-0">
                <v-rating
                  :value="task.avg_rating"
                  color="#275DC2"
                  background-color="grey lighten-2"
                  dense
                  half-increments
                  readonly
                  size="24"
                ></v-rating>
                <div class="grey--text mt-1 ms-4">{{ task.avg_rating }}</div>
              </v-row>
            </v-card-text>
            <v-card-subtitle class="text-truncate">
              {{ task.description }}
            </v-card-subtitle>
          </v-card>
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
