// import mongoose, { Schema } from 'mongoose';
// import {IToDoList, todoItem} from '../interfaces/todoList';
// import validator from 'validator';

// const todoListSchema: Schema = new Schema(
//     {
//         author: { 
//             type: String,
//             required: [true, 'todo list must have an author']
//         },

//         title: {
//             type: String,
//             required: [true, 'todo list must have a title']
//         },

//         list: { 
//             type: [todoItem],
//             default: []
//         }

//     },
//     {
//         timestamps: true,
//         versionKey: '__v'
//     }
// );


// export default mongoose.model<IToDoList>('todoList', todoListSchema);
