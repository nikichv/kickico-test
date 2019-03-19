<template>
  <div :class="['todo-item', { 'todo-item--completed': item.completed }]">
    <div class="d-flex justify-content-between ">
      <div>
        <p class="todo-item__title font-weight-bold">{{ item.title }}</p>
        <p class="text-muted small">Updated {{ date }} ago</p>
      </div>
      <div class="input-group mb-3 d-inline-block w-auto">
        <div class="input-group-text">
          <input
            type="checkbox"
            :checked="item.completed"
            @change.stop="$emit('select', { id: item.id, value: $event.target.checked})"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { distanceInWordsToNow } from 'date-fns';

export default {
  name: 'TodoItem',
  props: {
    item: {
      type: Object,
      default() {
        return {
          id: 0,
          userId: 0,
          timestamp: 0,
          title: '',
          group: '',
          completed: false,
        };
      },
    },
  },
  data() {
    return {
      interval: null,
      date: '',
    };
  },
  watch: {
    'item.timestamp': {
      handler(value) {
        this.date = this.formatDate(value);
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * Форматирование даты в человеко-читаемый формат относительно текущего момента
     * @param {number} unix timestamp
     * @return {string}
     */
    formatDate(unix) {
      return distanceInWordsToNow(unix);
    },
  },
  created() {
    this.interval = setInterval(() => {
      this.date = this.formatDate(this.item.timestamp);
    }, 30000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_settings.scss";
@import "~bootstrap/scss/input-group";

.todo-item {
  width: 100%;
}

.todo-item__title {
  transition: color .2s ease;
  will-change: color;
}

.todo-item--completed {
  .todo-item__title {
    text-decoration: line-through;
    color: $green;
  }
}
</style>
