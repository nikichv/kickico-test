import Vue from 'vue';
import App from './App.vue';
import store from './store';

import { SET_ITEMS, UPDATE_ITEM, SET_LIST } from './store/modules/todo';

Vue.config.productionTip = false;

function saveStateInLocalStorage(key, value) {
  return window.localStorage.setItem(key, JSON.stringify(value));
}

store.subscribe(({ type }) => {
  if (type === `todo/${SET_ITEMS}` || type === `todo/${UPDATE_ITEM}`) {
    saveStateInLocalStorage('items', store.state.todo.items);
  }

  if (type === `todo/${SET_LIST}`) {
    saveStateInLocalStorage('lists', store.state.todo.lists);
  }
});

const items = window.localStorage.getItem('items') || null;
const lists = window.localStorage.getItem('lists') || null;

/**
 * Если из localStorage пришли элементы И списки, то сохраним их в сторе
 */
if (items && lists) {
  store.dispatch('todo/setItems', JSON.parse(items));

  const parsed = JSON.parse(lists);
  parsed.forEach((list, index) => store.dispatch('todo/setList', { index, items: list }));

  store.dispatch('todo/setCacheFlag', true);
}

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
