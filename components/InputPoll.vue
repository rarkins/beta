<template>
  <div>
    <div class="form-group">
      <input type="text" v-model="poll.prompt" placeholder="Optional prompt" class="form-control">
    </div>
    <hr>
    <div class="form-group" v-for="(choice, index) in poll.options" :key="index">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          :placeholder="`Choice ${index + 1} ${index > 1 ? '(Optional)' : ''}`"
          v-model="choice.text"
          >
        <div class="input-group-append">
          <button type="button" class="btn btn-link"
            @click="removeChoice(index)"
            :class="{ invisible: index < 2 }">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="form-group">
      <button class="btn btn-link" type="button" @click="addChoice"
        :disabled="reached"
      >
        <i class="fa fa-plus"></i>&nbsp;
              Add a choice
      </button>
    </div>
    <div class="form-inline">
      <span>Duration:</span>

      <select v-model.number="dateForm.days" class="form-control ml-2">
        <option v-for="n in days.max - days.offset + 1" :key="n">{{n + days.offset - 1}}</option>
      </select>
      <span>Days</span>
      
      <select v-model.number="dateForm.hours" class="form-control ml-2">
        <option v-for="n in hours.max - hours.offset" :key="n">{{n + hours.offset - 1}}</option>
      </select>
      <span>Hours</span>

      <select v-model.number="dateForm.min" class="form-control ml-2">
        <option v-for="n in min.max -  min.offset" :key="n">{{n + min.offset - 1}}</option>
      </select>
      <span>Min</span>
    </div>
  </div>
</template>
<script>
const ONE_DAY_MINUTE = 1440
const PER_HOUR = 60

export default {
  data() {
    return {
      poll: {
        options: [{ text: '' }, { text: '' }],
        duration: ONE_DAY_MINUTE,
        type: 'net.unsweets.beta',
        is_public: true,
        prompt: ''
      },
      dateForm: {
        days: 1,
        hours: 0,
        min: 0
      }
    }
  },
  watch: {
    poll: {
      deep: true,
      handler(poll) {
        this.$emit('update:poll', poll)
      },
      immediate: true
    },
    dateForm: {
      deep: true,
      handler(dateForm) {
        new Array('hours', 'min').forEach(key => {
          const limitation = this[key]
          if (this.dateForm[key] < limitation.offset) {
            this.dateForm[key] = limitation.offset
          }
          if (this.dateForm[key] >= limitation.max) {
            this.dateForm[key] = limitation.max - 1
          }
        })
        this.poll.duration =
          dateForm.days * ONE_DAY_MINUTE +
          dateForm.hours * PER_HOUR +
          dateForm.min
      },
      immediate: true
    }
  },
  computed: {
    reached() {
      return this.poll.options.length >= 10
    },
    maxDays() {
      return this.dateForm.days === 14
    },
    days() {
      return {
        max: 14,
        offset: 0
      }
    },
    hours() {
      return {
        offset: 0,
        max: this.maxDays ? 1 : 24
      }
    },
    min() {
      if (this.maxDays) {
        return {
          offset: 0,
          max: 1
        }
      } else if (this.minDuration) {
        return {
          offset: 1,
          max: 60
        }
      } else {
        return {
          offset: 0,
          max: 60
        }
      }
    },
    minDuration() {
      return this.dateForm.days === 0 && this.dateForm.hours === 0
    }
  },
  methods: {
    addChoice() {
      this.poll.options.push({ text: '' })
    },
    removeChoice(i) {
      this.poll.options.splice(i, 1)
    }
  }
}
</script>