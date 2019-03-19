<template>
  <div id="app">
    <div class="container">
      <div class="row justify-content-center">
        <template v-for="(l, index) in todoLists">
          <div class="col-12 col-md-6" :key="`list-${index}`">
            <div class="p-3">
              <h3 class="text-center mb-2">List #{{ index + 1 }}</h3>
              <p class="text-muted small text-center mb-1">Sort by</p>
              <div class="d-flex align-items-center justify-content-center">
                <template v-for="field in sortFields">
                  <div
                    :key="field.key"
                    :class="[
                      'btn mx-2',
                      sortKeys[index] === field.key ? 'btn-success' : 'btn-info'
                    ]"
                    @click="handleListSort({ listIndex: index, sortKey: field.key })"
                  >
                    {{ field.name }}
                  </div>
                </template>
              </div>
              <div class="border border-dark rounded mt-4 px-2">
                <draggable
                  group="todoItems"
                  :list="todoLists[index]"
                  @change="handleDraggableChange({ index, items: todoLists[index] })"
                >
                  <template v-for="(id, i) in todoLists[index]">
                    <div
                      :key="id"
                      :class="[
                      'd-flex align-items-baseline',
                      { 'border-bottom border-dark': i !== todoLists[index].length - 1 }
                      ]"
                    >
                      <strong class="p-3">{{ i + 1 }}</strong>
                      <TodoItem
                        :item="todoItems[id]"
                        @select="handleItemChange"
                      />
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';
import axios from 'axios';

import TodoItem from '@/components/blocks/TodoItem';

export default {
  name: 'app',
  data() {
    return {
      sortFields: [
        { name: 'Time', key: 'timestamp' },
        { name: 'Name', key: 'title' },
        { name: 'Complete', key: 'completed' },
      ],
      /**
       * Хардкодим ключи и порядки сортировки для листов, поскольку CRUD операций у них нет
       */
      sortKeys: ['timestamp', 'timestamp'],
      sortOrdersAscending: [true, true],
    };
  },
  components: {
    TodoItem,
    draggable,
  },
  methods: {
    ...mapActions('todo', {
      setTodoItems: 'setItems',
      updateTodoItem: 'updateItem',
      setList: 'setList',
    }),
    handleItemChange({ id, value }) {
      this.updateTodoItem({
        id,
        properties: {
          completed: value,
        },
      });
    },
    handleDraggableChange({ index, items }) {
      this.setList({ index, items });
    },
    handleListSort({ listIndex, sortKey }) {
      const items = this.todoLists[listIndex].map(el => this.todoItems[el]);

      /**
       * Если сортируемое поле такое же как предыдущее, то меняем порядок сортировки
       */
      if (sortKey === this.sortKeys[listIndex]) {
        this.sortOrdersAscending[listIndex] = !this.sortOrdersAscending[listIndex];
      }

      if (this.sortOrdersAscending[listIndex]) {
        items.sort((a, b) => b[sortKey] > a[sortKey] ? 1 : -1); // eslint-disable-line
      } else {
        items.sort((a, b) => b[sortKey] > a[sortKey] ? -1 : 1); // eslint-disable-line
      }

      const sorted = items.map(el => el.id);
      this.sortKeys[listIndex] = sortKey;
      this.setList({ index: listIndex, items: sorted });
    },
  },
  computed: {
    ...mapState('todo', {
      todoItemsRestoredFromCache: state => state.fromCache,
      todoItems: state => state.items,
      todoLists: state => state.lists,
    }),
  },
  async created() {
    const todoItemsCount = 10;

    /**
     * Если в локалсторе не было кеша, то фетчим данные заново
     */
    if (!this.todoItemsRestoredFromCache) {
      const { data = [] } = await axios.get('https://jsonplaceholder.typicode.com/todos')
        .catch(err => console.error(err));

      /**
       * Все 200 элементов нам вряд ли нужны
       */
      const sliced = data.slice(0, todoItemsCount);

      /* eslint-disable no-param-reassign */
      const payload = sliced.reduce((acc, el) => {
        el.timestamp = Date.now();
        acc[el.id] = el;
        return acc;
      }, {});
      /* eslint-enable */

      /**
       * Тут хардкодим логику добавления в списки, поскольку CRUD операций нет у списков
       */
      const [l, k] = sliced.reduce((acc, el, i) => {
        if (i < todoItemsCount / 2) {
          acc[0].push(el.id);
        } else {
          acc[1].push(el.id);
        }
        return acc;
      }, [[], []]);

      this.setTodoItems(payload);
      this.setList({ index: 0, items: l });
      this.setList({ index: 1, items: k });
    }

    /**
     * Сортировка по умолчанию как в трелло, сначала выполненные
     */
    this.handleListSort({ listIndex: 0, sortKey: 'completed' });
    this.handleListSort({ listIndex: 1, sortKey: 'completed' });
  },
};
</script>

<style lang="scss">
@import "assets/styles/main";
</style>
