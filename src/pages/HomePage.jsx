import React, { useState, useEffect, version } from "react";
import Form from "../components/Form";
import Todo from "../components/Todo";
import { API, graphqlOperation,Storage } from "aws-amplify";
import { createTodo, deleteTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";
import { v4 as uuidv4 } from "uuid";
const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [formInput, setFormInput] = useState("");
  const imageRef = React.useRef()
  
  const handleChange = (e) => {
    setFormInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formInput !== "") {
      addData();
      setFormInput("");
    }
  };

  const addData = async (base64) => {
    // var bufBase64 = base64.replace(/^data:image\/\w+;base64,/,"");
    // var buf = new Buffer.from(bufBase64, 'base64');
            
    var opt =  {
        contentType: 'image/jpeg/gif',
        // metadata: metadata || null
    };
    const image = URL.createObjectURL(imageRef.current.files[0]);
    const {key} =await Storage.put(uuidv4(), image,opt);
    console.log(key);

    try {
      const todoAdd = await API.graphql(
        graphqlOperation(createTodo, {
          input: { id: uuidv4(), name: formInput,image:key, _version: 2 },
        })
      );
      console.log(todoAdd);
      setTasks([...tasks, todoAdd.data.createTodo]);
    } catch (error) {
      console.log("Error on Add", error);
    }
  };
  const removeData = async (id, version) => {
    try {
      const todoDelete = await API.graphql(
        graphqlOperation(deleteTodo, { input: { id, _version: version } })
      );
      const newTasks = tasks.filter((task) => task.id !== id);
      setTasks(newTasks);
      return todoDelete;
    } catch (error) {
      console.log("Error on Delete", error);
    }
  };
  const getData = async () => {
    try {
      const todolist = await API.graphql(graphqlOperation(listTodos));
      setTasks(await Promise.all(todolist.data.listTodos.items.map(async i => ({
        ...i,
        imageURL: await Storage.get(i.image)
      }))));
 
    } catch (error) {
      console.log("Error on Get", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      <Form
        formInput={formInput}
        handleChange={handleChange}
        imageRef={imageRef}
        handleSubmit={handleSubmit}
        />
      <Todo tasks={tasks} handleRemove={removeData} />
    </div>
  );
};

export default HomePage;
