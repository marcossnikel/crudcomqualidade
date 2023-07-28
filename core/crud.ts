import fs from "fs";
import { v4 as uuid } from "uuid";
const DB_FILE_PATH = "./core/db";

type UUID = string;
interface Todo {
    id: UUID;
    date: string;
    done: boolean;
    content: string;
}

function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };

    const todos: Todo[] = [...read(), todo];

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
            },
            null,
            2
        )
    );
    return todo;
}

function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if (!db.todos) {
        return [];
    }
    return db.todos;
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTodo, partialTodo);
        }
    });
    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
            },
            null,
            2
        )
    );
    if (!updatedTodo) {
        throw new Error("Please, provide another ID");
    }
    return updatedTodo;
}

function updateContentById(id: UUID, content: string): Todo {
    return update(id, {
        content,
    });
}

function deleteById(id: UUID) {
    const todos = read();

    const todosWithoutDeletedOne = todos.filter((todo) => {
        if (todo.id === id) {
            return false;
        }
        return true;
    });

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos: todosWithoutDeletedOne,
            },
            null,
            2
        )
    );
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "");
}

CLEAR_DB();
const firstTodo = create("Primeira TODO");
const secondTodo = create("Vasco TODO");
const thirdTodo = create("Terceira TODO");
console.log(thirdTodo);

deleteById(thirdTodo.id);
// update(thirdTodo.id, {
//   content: "Opa, Teste",
//   done: true,
// });
