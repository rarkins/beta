<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap">
      <div
        class="btn-group"
        role="group"
        style="display: none">
        <label class="btn btn-primary">
          <input
            :class="active"
            type="checkbox"
            class="sr-only"
            value="reply"> Reply
        </label>
        <label class="btn btn-primary">
          <input
            :class="active"
            type="checkbox"
            class="sr-only"
            value="repost"> Repost
        </label>
        <label class="btn btn-primary">
          <input
            :class="active"
            type="checkbox"
            class="sr-only"
            value="bookmark"> Star
        </label>
        <label class="btn btn-primary">
          <input
            :class="active"
            type="checkbox"
            class="sr-only"
            value="follow"> Follow
        </label>
      </div>
    </div>
    <div>
      <list
        :data="data"
        type="Interaction" />
    </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import List from '~/components/List'

export default {
  middleware: ['auth'],
  async asyncData({ app: { $resource } }) {
    const option = {
      filters: 'bookmark,repost,follow'
    }
    const data = await $resource(option)
    return { data }
  },
  components: {
    List,
    Compose
  },
  methods: {
    active() {}
  },
  head() {
    return {
      title: 'Interactions'
    }
  }
}
</script>
