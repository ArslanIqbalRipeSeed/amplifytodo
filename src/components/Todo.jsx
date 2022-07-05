import { Storage } from 'aws-amplify';
import React from 'react';
import "./Todo.css";
const Todo = (props) => {

    const { tasks,handleRemove} = props

    return (
        <ul className='todo'>
            {tasks.map((task) =>
                <li key={task.id}>
                    <div >
                        <label >
                            
                            <span></span>
                        </label>
                        <span>{task.name}</span>
                    </div>
                    <img height={50} width={50} src={task.imageURL}/>
                    <button onClick={() => handleRemove(task.id, task._version)}>X</button>
                </li>
            )}
        </ul>
    );
}

export default Todo;