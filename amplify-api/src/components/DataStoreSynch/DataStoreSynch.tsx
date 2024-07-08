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
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState<string | null>(null);
  const [nameToUpdate, setNameToUpdate] = useState('');
  const [descriptionToUpdate, setDescriptionToUpdate] = useState('');

  const addTodo = async () => {
    if (name.trim() === '') {
      setMessage({ text: 'Todo requires name', type: 'error' });
      return;
    };

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

  const handleEditClick = async (id: string) => {
    setIsEditing(true);
    setCurrentTodoId(id);
    const todoToUpdate = await DataStore.query(Todo, id);
    if (todoToUpdate) {
      setNameToUpdate(todoToUpdate.name);
      setDescriptionToUpdate(todoToUpdate.description ?? '');
    }
  };

  const handleUpdateTodo = async () => {
    if (currentTodoId) {
      const todoToUpdate = await DataStore.query(Todo, currentTodoId);
      if (todoToUpdate) {
        if(todoToUpdate.name !== nameToUpdate || todoToUpdate.description !== descriptionToUpdate) {
          await DataStore.save(
            Todo.copyOf(todoToUpdate, updated => {
              updated.name = nameToUpdate;
              updated.description = descriptionToUpdate;
            })
          );
  
          const updatedTodos = todos.map(todo =>
            todo.id === currentTodoId ? { ...todo, name: nameToUpdate, description: descriptionToUpdate } : todo
          );
          setTodos(updatedTodos);
          setIsEditing(false);
          setCurrentTodoId(null);
          setMessage({ text: 'Todo updated successfully!', type: 'success' });
        } else {
          setMessage({ text: 'Todo has no changes', type: 'warning' });
        }
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentTodoId(null);
  };

  return (
    <View>
      <Heading level={1}>DataStore Synch Demo</Heading>
      <Divider
        orientation="horizontal" />
      {message && (
        <div className='container'>
          <Message
            isDismissible={true}
            colorTheme={message.type}
            onDismiss={() => setMessage(null)}
          >
            {message.text}
          </Message>
        </div>
      )}

      <Flex direction="row">
        <div className='container'>
          <Flex direction="column" alignItems="flex-start">
            <Heading level={2}>Add Todo</Heading>
            <Divider
              orientation="horizontal" />
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
        </div>
        <Collection items={todos} type="grid">
          {(todo) => (
            <div className='todo-card' key={todo.id}>
              <Card variation="outlined">
                <Heading level={3}>{todo.name}</Heading>
                <p>{todo.description}</p>
                <Flex>
                  <Button variation="primary" colorTheme='error' onClick={() => deleteTodo(todo.id)}>Delete</Button>
                  <Button variation="primary" onClick={() => handleEditClick(todo.id)}>Update</Button>
                </Flex>
              </Card>
            </div>
          )}
        </Collection>
        {isEditing && (
          <div className='container'>
            <Flex direction="column">
              <Heading level={2}>Update Todo</Heading>
              <Divider
                orientation="horizontal" />
              <TextField
                label="Name"
                value={nameToUpdate}
                onChange={(e) => setNameToUpdate(e.target.value)}
              />
              <TextAreaField
                label="Description"
                value={descriptionToUpdate}
                onChange={(e) => setDescriptionToUpdate(e.target.value)}
              />
              <Flex>
                <button onClick={handleUpdateTodo}>Save Changes</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </Flex>
            </Flex>
          </div>
        )}
      </Flex>
    </View>
  );
};

export default DataStoreSynch;
