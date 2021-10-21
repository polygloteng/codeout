<template>
  <v-container class="grey lighten-5">
    <v-row>
      <v-col
        v-for="task in data.tasks"
        :key="task.name"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="pa-2" outlined tile>{{ task.name }} </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { collection, getDocs, FirestoreDataConverter } from 'firebase/firestore'
import {
  defineComponent,
  onMounted,
  reactive,
  useContext,
} from '@nuxtjs/composition-api'
import { DataTableHeader } from 'vuetify/types'

interface Task {
  name: string
  description: string
  thumbnail_url: string
  repo_url: string
  point: number
  score: number
  tags: string[]
  level: number
  avg_rating: number
}

function assertTask(data: any): asserts data is Task {
  const d = data as Partial<Task>
  console.log(d)
  if (
    !(
      typeof d?.name === 'string' &&
      typeof d?.description === 'string' &&
      typeof d?.thumbnail_url === 'string' &&
      typeof d?.repo_url === 'string' &&
      typeof d?.point === 'number' &&
      typeof d?.score === 'number' &&
      Array.isArray(d?.tags) &&
      typeof d?.level === 'number' &&
      typeof d?.avg_rating === 'number'
    )
  ) {
    throw new Error('data is not Task type')
  }
}

const taskConverter: FirestoreDataConverter<Task> = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options)
    assertTask(data)
    return data
  },
  toFirestore: (model: Task) => model,
}

interface Data {
  tasks: Task[]
  headers: DataTableHeader[]
}

export default defineComponent({
  setup() {
    const context = useContext()
    const data = reactive<Data>({
      tasks: [],
      headers: [
        {
          text: 'name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'description', value: 'description' },
        { text: 'thumbnail_url', value: 'thumbnail_url' },
      ],
    })
    onMounted(async () => {
      const querySnapshot = await getDocs(
        collection(context.$db, 'tasks').withConverter(taskConverter)
      )
      querySnapshot.forEach((doc) => {
        data.tasks.push(doc.data())
      })
    })
    return { data }
  },
})
</script>

<style>
</style>
