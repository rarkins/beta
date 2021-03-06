<template>
  <div>
    <div
      :key="$route.fullPath"
      class="row">
      <div class="col-md-4 order-md-2">
        <h1>
          <span v-emojify>{{ $metaInfo.title }}</span>
          <button
            v-if="!isPM && isModerator"
            class="btn btn-link mr-2"
            type="button"
            @click="channelEditModal">
            <font-awesome-icon
              :icon="['far', 'edit']"
              class="mr-2" />
            <span class="d-none d-sm-inline">Edit</span>
          </button>
        </h1>
        <div class="row">
          <div class="col-sm col-md-12">
            <p
              v-if="!isPM"
              class="text-muted">
              {{ chat.description }}
            </p>
            <div
              v-if="user"
              class="form-group">
              <custom-checkbox
                v-model="channel.you_subscribed"
                :resource="`/channels/${channel.id}/subscribe`"
                @change="cancelMute">
                Subscribed
              </custom-checkbox>
              <custom-checkbox
                v-model="channel.you_muted"
                :resource="`/channels/${channel.id}/mute`"
                @change="cancelSubscribe">
                Muted
              </custom-checkbox>
              <custom-checkbox
                :checked="!channel.has_unread"
                :disabled="!channel.has_unread"
                @change="markAsRead">
                Mark as read
              </custom-checkbox>
            </div>
            <template v-if="!isPM && chat.categories">
              Categories
              <ul>
                <template v-for="i in chat.categories">
                  <li :key="i">{{ i.charAt(0).toUpperCase() + i.slice(1) }}</li>
                </template>
              </ul>
            </template>
          </div>
          <div class="col-sm col-md-12">
            <h2 class="h3">
              <span v-if="isPM || !channel.acl.read.public">Members</span>
              <span v-else-if="!isPM">
                <font-awesome-icon
                  icon="globe"
                  class="mr-2"
                />
                <span>Public</span>
              </span>
              <button
                v-if="!isPM && isModerator"
                class="btn btn-link mr-2"
                type="button"
                @click.stop.prevent="memberEditModal">
                <font-awesome-icon :icon="['far', 'edit']"/>
                <span class="d-none d-sm-inline ml-2">Edit</span>
              </button>
            </h2>
            <span
              v-if="!isPM"
              class="mb-2">Owner</span>
            <ul
              :class="{'pm-ul': isPM}"
              class="list-unstyled">
              <li
                :key="channel.owner.id"
                class="mb-2">
                <nuxt-link
                  :to="`/@${channel.owner.username}`"
                  class="d-flex flex-row align-items-center flex-nowrap">
                  <avatar
                    :avatar="channel.owner.content.avatar_image.link"
                    size="24"
                    max-size="24"
                    class="mr-2" />
                  <div class="d-flex align-items-baseline flex-wrap">
                    @{{ channel.owner.username }}
                    <small class="ml-1 text-muted">
                      {{ channel.owner.name }}
                    </small>
                  </div>
                </nuxt-link>
              </li>
            </ul>
            <template v-if="!isPM && channel.acl.full.user_ids.length">
              <span class="mb-2">Moderators</span>
              <ul class="list-unstyled">
                <li
                  v-for="user in channel.acl.full.user_ids"
                  :key="user.id"
                  class="mb-2">
                  <nuxt-link
                    :to="`/@${user.username}`"
                    class="d-flex flex-row align-items-center flex-nowrap">
                    <avatar
                      :avatar="user.avatar_image"
                      size="24"
                      max-size="24"
                      class="mr-2" />
                    <div class="d-flex align-items-baseline flex-wrap">
                      @{{ user.username }}
                      <small class="ml-1 text-muted">
                        {{ user.name }}
                      </small>
                    </div>
                  </nuxt-link>
                </li>
              </ul>
            </template>
            <template v-if="channel.acl.write.user_ids.length && !channel.acl.write.any_user">
              <span
                v-if="!isPM"
                class="mb-2">Writers</span>
              <ul class="list-unstyled">
                <li
                  v-for="user in channel.acl.write.user_ids"
                  :key="user.id"
                  class="mb-2">
                  <nuxt-link
                    :to="`/@${user.username}`"
                    class="d-flex flex-row align-items-center flex-nowrap">
                    <avatar
                      :avatar="user.avatar_image"
                      size="24"
                      max-size="24"
                      class="mr-2" />
                    <div class="d-flex align-items-baseline flex-wrap">
                      @{{ user.username }}
                      <small class="ml-1 text-muted">
                        {{ user.name }}
                      </small>
                    </div>
                  </nuxt-link>
                </li>
              </ul>
            </template>
            <template v-if="!isPM && channel.acl.read.user_ids.length && !channel.acl.read.any_user">
              <span class="mb-2">Readers</span>
              <ul class="list-unstyled">
                <li
                  v-for="user in channel.acl.read.user_ids"
                  :key="user.id"
                  class="mb-2">
                  <nuxt-link
                    :to="`/@${user.username}`"
                    class="d-flex flex-row align-items-center flex-nowrap">
                    <avatar
                      :avatar="user.avatar_image"
                      size="24"
                      max-size="24"
                      class="mr-2" />
                    <div class="d-flex align-items-baseline flex-wrap">
                      @{{ user.username }}
                      <small class="ml-1 text-muted">
                        {{ user.name }}
                      </small>
                    </div>
                  </nuxt-link>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
      <div class="col-md-8 order-md-1">
        <message-compose
          v-if="canPost"
          v-model="message"
          @submit="() => $refs.list.refresh()" />
        <div class="card no-gutter-xs">
          <div class="card-body">
            <List
              ref="list"
              :data="data"
              :is-moderator="isModerator"
              :channel-type="channel.type"
              :last-read-message-id="data.meta.marker.id"
              type="Message" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from '~/components/List'
import MessageCompose from '~/components/MessageCompose'
import CustomCheckbox from '~/components/CustomCheckbox'
import Avatar from '~/components/Avatar'
import { mapGetters } from 'vuex'

export default {
  validate({ params: { channel } }) {
    return /^\d+$/.test(channel)
  },
  components: {
    List,
    MessageCompose,
    CustomCheckbox,
    Avatar
  },
  data() {
    return {
      message: '',
      promise: null
    }
  },
  async asyncData({ app: { $axios, $resource }, params, error }) {
    const messagesPromise = $resource()
    const channelPromise = $axios.$get(`/channels/${params.channel}`, {
      params: {
        include_limited_users: 1,
        include_channel_raw: 1
      }
    })
    try {
      const [data, { data: channel }] = await Promise.all([
        messagesPromise,
        channelPromise
      ])
      return {
        data,
        channel
      }
    } catch (e) {
      const { code, error_message } = e.response.data.meta
      error({
        statusCode: code,
        message: error_message
      })
    }
  },
  computed: {
    ...mapGetters(['user']),
    isModerator() {
      return (
        this.user &&
        (this.user.id === this.channel.owner.id ||
          !!this.channel.acl.full.user_ids.find(u => {
            return u.id === this.user.id
          }))
      )
    },
    isPM() {
      return this.channel.type === 'io.pnut.core.pm'
    },
    canPost() {
      return this.user && this.channel.acl.write.you
    },
    chat() {
      return this.channel.raw.find(r => {
        return r.type === 'io.pnut.core.chat-settings'
      }).value
    }
  },
  watch: {
    '$route.fullPath': {
      handler() {
        this.$emit('updateNav', this.isPM)
      },
      immediate: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.markAsRead()
    }, 1000)
  },
  methods: {
    cancelSubscribe(bool) {
      if (bool) this.channel.you_subscribed = false
    },
    cancelMute(bool) {
      if (bool) this.channel.you_muted = false
    },
    memberEditModal() {
      this.$modal.show('channel-member-edit-modal', this)
    },
    editMembers() {},
    channelEditModal() {
      this.$modal.show('channel-edit-modal', this)
    },
    async update(updatedChannel) {
      try {
        this.promise = this.$axios.$put(
          '/channels/' +
            this.channel.id +
            '?include_channel_raw=1&include_limited_users=1',
          updatedChannel
        )
        const { data: response } = await this.promise
        this.$toast.success('Updated!')
        this.channel = response
      } catch (e) {
        this.$toast.error(e.message)
      }
      this.promise = null
    },
    async markAsRead() {
      if (!this.channel.has_unread) return false
      const marker = [
        {
          name: 'channel:' + this.channel.id,
          id: this.channel.recent_message_id
        }
      ]
      // this.channel.has_unread
      try {
        this.promise = this.$axios.$post('/markers', marker)
        await this.promise
        this.$toast.success('Marked as read!')
        this.channel.has_unread = false
      } catch (e) {
        this.$toast.error(e.message)
      }
      this.promise = null
    }
  },
  head() {
    const title = this.isPM ? `Room ${this.channel.id}` : this.chat.name
    return {
      title
    }
  }
}
</script>
<style scoped lang="scss">
.pm-ul {
  margin-bottom: 0;
}
</style>
