<template>
  <div>
    <div class="row">
      <div class="col-md-8">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <nuxt-link
              :class="{ active: isPM === true }"
              to="/messages"
              class="nav-link"
              exact>
              Messages
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              :class="{ active: isPM === false }"
              to="/messages?public"
              class="nav-link">
              Chat Rooms
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <nuxt-child @updateNav="isPM = $event" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      isPM: null
    }
  },
  watch: {
    '$route.fullPath'() {
      this.isPM = null
    }
  }
}
</script>
