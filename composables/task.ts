import { ref, useAsync } from '@nuxtjs/composition-api'
import { Firestore, getDocs, collection, query, orderBy, limit, getDoc, doc } from 'firebase/firestore'
import { Task, Purchase } from '~/types/db'
import { taskConverter } from '~/lib/converters'

export const useTasks = ({ $db }: { $db: Firestore }, maxTasks: number) => {
  const tasks = ref<Task[]>([])
  useAsync(async () => {
    const querySnapshot = await getDocs(
      query(collection($db, 'tasks').withConverter(taskConverter), orderBy('name'), limit(maxTasks))
    )
    tasks.value = querySnapshot.docs.map((doc) => doc.data())
  })
  return { tasks }
}

export const useTask = ({ $db }: { $db: Firestore }, task_id: string) => {
  const task = ref<Task>()
  useAsync(async () => {
    const taskSnapshot = await getDoc(doc($db, 'tasks', task_id).withConverter(taskConverter))
    if (taskSnapshot.exists()) {
      task.value = taskSnapshot.data()
    } else {
      console.log('No such document!')
    }
  })
  return { task }
}
