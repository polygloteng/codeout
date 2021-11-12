<template>
  <div>
    <v-container fluid>
      <v-row style="height: 20rem" class="primary white--text">
        <v-col cols="12" class="align-self-center">
          <div class="text-h3 text-center font-weight-bold">
            GitHubで実戦的に学べる<br />
            プログラミング学習サービス
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" xl="8">
          <v-row>
            <v-col v-for="task in tasks" :key="task.name" cols="12" sm="6" md="4">
              <v-card class="pa-2" outlined tile hover :to="'/tasks/' + task.id">
                <v-img height="250" src="/images/study.png"></v-img>
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
