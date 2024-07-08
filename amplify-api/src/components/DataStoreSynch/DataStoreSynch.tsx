import React, { useState, useEffect } from 'react';
import { Heading, Flex, Button, View, TextField, TextAreaField, Collection, Card, Message, Divider } from '@aws-amplify/ui-react';
import { DataStore } from '@aws-amplify/datastore';
import './DataStoreSynch.css';
import { Todo } from '../../models';

const DataStoreSynch: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'info' | 'success' | 'error' | 'warning' } | null>(null);
  /* 
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState(''); */

  const addTodo = async () => {
    if (name.trim() === '') return;

    const newTodo = new Todo({
      name,
      description
    });

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setName('');
    setDescription('');
    await DataStore.save(newTodo);
    setMessage({ text: 'Todo added successfully!', type: 'success' });
  };

  // Fetch todos from DataStore on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      const todosData = await DataStore.query(Todo);
      console.log('Fetching todos from DataStore:', todosData);
      setTodos(todosData);
    };
    fetchTodos();
  }, []);

  const deleteTodo = async (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    const todoToDelete = await DataStore.query(Todo, id);
    if (todoToDelete) {
      await DataStore.delete(todoToDelete);
      setMessage({ text: 'Todo deleted successfully!', type: 'success' });
    }
  };

  /*  
 
   
 
   
 
   const startEditing = (todo: Todo) => {
     setEditingId(todo.id);
     setEditingName(todo.name);
     setEditingDescription(todo.description || '');
   };
 
   const saveEdit = async () => {
     if (editingId) {
       const updatedTodos = todos.map((todo) =>
         todo.id === editingId ? { ...todo, name: editingName, description: editingDescription } : todo
       );
       setTodos(updatedTodos);
 
       const todoToUpdate = await DataStore.query(Todo, editingId);
       if (todoToUpdate) {
         await DataStore.save(
           Todo.copyOf(todoToUpdate, updated => {
             updated.name = editingName;
             updated.description = editingDescription;
           })
         );
         setMessage({ text: 'Todo updated successfully!', type: 'success' });
       }
 
       setEditingId(null);
       setEditingName('');
       setEditingDescription('');
     }
   };
 
   const cancelEdit = () => {
     setEditingId(null);
     setEditingName('');
     setEditingDescription('');
   };
   }; */

  return (
    <View>
      <Heading level={1}>DataStore Synch Demo</Heading>
      <Divider
        orientation="horizontal" />
      {message && (
        <Message
          isDismissible={true}
          colorTheme={message.type}
          onDismiss={() => setMessage(null)}
        >
          {message.text}
        </Message>
      )}

      <Flex direction="row">
        <Flex direction="column" alignItems="flex-start">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextAreaField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button variation="primary" onClick={addTodo}>Add Todo</Button>
        </Flex>
        <Collection items={todos} type="grid">
          {(todo) => (
            <Card key={todo.id}>
              <Heading level={3}>{todo.name}</Heading>
              <p>{todo.description}</p>
              <Flex>
                <Button variation="primary" colorTheme='error' onClick={() => deleteTodo(todo.id)}>Delete</Button>
                <Button variation="primary">Update</Button>
              </Flex>
            </Card>
          )}
        </Collection>
      </Flex>
    </View>
  );
};

export default DataStoreSynch;
