import React, { useEffect, useState } from 'react';
import './ListPage.css'; 
import { useNavigate } from 'react-router';

const ListPage = (props) => {
  const [tasks, setTasks] = useState([]);

  const history = useNavigate();

  const getData = async ()=>{
    const data = {
      jwt:props.cookie
    };

    const url="http://localhost:3100/tasks";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const res = await response.json();
    setTasks(res);
  }

  useEffect(()=>{
    if(props.cookie==null){
      history("/login");
    }
    else{
      getData();
    }
  },[]);

  const handleLogout = ()=>{
    props.setCookie(null);
    history("/login");
  }

  const handleAddTask = async () => {
    const taskName = document.getElementById("newTask").value;
    console.log(taskName);

    const data = {
      jwt:props.cookie,
      task_name:taskName
    };

    const url="http://localhost:3100/addTask";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    
    const res = await response.json();

    setTasks(res);
    document.getElementById("newTask").value="";
  };

  const handleDeleteTask = async(id) => {
    const data = {
      jwt:props.cookie,
      task_id:id
    };

    const url="http://localhost:3100/deleteTask";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), 
    });
    
    const res = await response.json();
    console.log(res);
    setTasks(res);
  };

  const handleUpdateTask = async(id) => {
    const data = {
      jwt:props.cookie,
      status:true,
      task_id:id
    };

    const url="http://localhost:3100/changeStatus";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), 
    });
    
    const res = await response.json();
    console.log(res);
    setTasks(res);
  };

  return (
    <div className="task-page">
      <h1>TODO List</h1>
      <div className="add-task-container">
        <input
          type="text"
          id="newTask"
        />
        <button className="btn-green" onClick={handleAddTask}>Add</button>
        <button className="btn-red" onClick={handleLogout}>Log out</button>
      </div>
      <h2>ToDO Tasks</h2>
      <ul>
        {tasks.map((task, index) => (
          (!task.is_completed)?<TaskItem
            key={index}
            task={task}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />:<></>
        ))}
      </ul>
      <h2>Finished Tasks</h2>
      <ul>
        {tasks.map((task, index) => (
          (task.is_completed)?<CompletedItem
            key={index}
            task={task}
            onDelete={handleDeleteTask}
          />:<></>
        ))}
      </ul>
    </div>
  );
};

const TaskItem = ({task,onUpdate,onDelete}) => {
  return (
    <li>
      {task.name}
      <div>
        <button className="btn-red" onClick={()=>onUpdate(task._id)}>Done</button>
        <button className="btn-red" onClick={()=>onDelete(task._id)}>Delete</button>
      </div>
    </li>
  );
};

const CompletedItem = ({task,onDelete})=>{
  return (
    <li>
      {task.name}
      <div>
        <button className="btn-red" onClick={()=>onDelete(task._id)}>Delete</button>
      </div>
    </li>
  );
};

export default ListPage;
