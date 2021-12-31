<template>
  <div>

    <v-container fluid>
      <v-row align="center" class="codeout-topmv-area py-sm-10 px-sm-16 pt-10 pb-10 px-3 flex-row-reverse">
        <v-col cols="12" md="8" sm="12" xs="12">
          <v-img :src="`${$config.assetsDomain}/images/top_mv.svg`"></v-img>
        </v-col>
        <v-col cols="12" md="4" sm="12" xs="12" class="mt-md-0 mt-16 pr-md-16 pr-0">
          <h2 class="mb-6">GitHubで実戦的に学べる<br>プログラミング学習サービス</h2>
          <p>CODEOUT は、現役エンジニアが作った教材でサービス開発に必要なスキルが学べる学習プラットフォームです</p>
          <v-btn to="/signup" class="codeout-btn-size-default codeout-btn-grad mt-10 mb-10 v-btn v-btn--is-elevated v-btn--has-bg theme--light white--text">会員登録する</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="codeout-topgrid-area codeout-bg-grad py-sm-10 px-sm-16 pt-10 pb-10 px-3 pa-6 primary white--text">
      <v-row justify="center" class="my-10">
        <h2>レッスン一覧</h2>
      </v-row>
      <v-row justify="flex-start">
        <v-col v-for="task, index) in tasks" :key="task.name" cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
          <v-card class="ma-3 rounded-lg" tile hover :to="'/tasks/' + task.id">
            <!--サムネ画像の表示確認用に、ファイル名末尾の連番をループカウントで暫定的に付与しています。DB側に画像もしくはファイル名情報を持たせた方が良いかもしれません。（12/29佐藤）-->
            <v-img height="250" :src="`${$config.assetsDomain}/images/top_study_thumb0${index+1}.png`"></v-img>
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
    </v-container>

  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useTasks } from '~/composables/task'

const MAX_TASKS = 9

export default defineComponent({
  setup() {
    const context = useContext()
    const { tasks } = useTasks(context, MAX_TASKS)
    return { tasks }
  },
})
</script>

<style></style>
