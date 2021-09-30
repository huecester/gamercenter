import { createApp } from 'vue';

const app = createApp({
	data() {
		return {
			newTodoText: '',
			todos: [],
			nextTodoId: 0,
		};
	},
	methods: {
		addNewTodo() {
			this.todos.push({
				id: this.nextTodoId++,
				text: this.newTodoText,
			});
			this.newTodoText = '';
		},
	},
});

app.component('todo-item', {
	template: `
		<li>
			{{ text }}
			<button @click="$emit('remove')">Remove</button>
		</li>
	`,
	props: ['text'],
	emits: ['remove'],
});

app.mount('#todo-list');
