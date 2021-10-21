import { mount } from '@vue/test-utils'
import TaskList from '~/components/TaskList.vue'

describe('TaskList', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(TaskList)
    expect(wrapper.vm).toBeTruthy()
  })
})
