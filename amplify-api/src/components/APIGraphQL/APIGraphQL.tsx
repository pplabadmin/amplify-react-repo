import React, { useState, useEffect } from 'react';
import { Heading, Flex, Button, View, TextField, TextAreaField, Collection, Card, Message, Divider } from '@aws-amplify/ui-react';
import './APIGraphQL.css';
import { generateClient } from 'aws-amplify/api';
import { createTodo, updateTodo, deleteTodo } from '../../graphql/mutations';
import { listTodos, getTodo } from '../../graphql/queries';
import { Todo } from '../../API';

const client = generateClient();

const APIGraphQL: React.FC = () => {
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

    try {
      const result = await client.graphql({
        query: createTodo,
        variables: {
          input: {
            name: name,
            description: description
          }
        }
      });
      setTodos((prevTodos) => [...prevTodos, result.data.createTodo]);
      setName('');
      setDescription('');
      setMessage({ text: 'Todo added successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: `Error trying to add todo`, type: 'error' });
      console.log(err);
    }
  };

  // Fetch todos from DataStore on component mount
  useEffect(() => {
    const fecthTodos = async () => {
      try {
        const result = await client.graphql({ query: listTodos });
        setTodos(result.data.listTodos.items.filter((todo) => !todo._deleted));
      } catch (err) {
        setMessage({ text: `Error fetching todos: ${err}`, type: 'error' });
      }
    };
    fecthTodos();
  }, []);

  const removeTodo = async (todo_id: string, todo_version: number) => {
    try {
      const todoDetails = {
        id: todo_id,
        _version: todo_version
      };
      await client.graphql({
        query: deleteTodo,
        variables: { input: todoDetails }
      });
      const updatedTodos = todos.filter((todo) => todo.id !== todo_id);
      setTodos(updatedTodos);
    } catch (err) {
      setMessage({ text: `Error deleting todo`, type: 'error' });
      console.log(err);
    }
  };

  const handleEditClick = async (toBeUpdated: Todo) => {
    setIsEditing(true);
    setCurrentTodoId(toBeUpdated.id);
    setNameToUpdate(toBeUpdated.name);
    setDescriptionToUpdate(toBeUpdated.description ?? '');
  };

  const handleUpdateTodo = async () => {
    if (currentTodoId) {
      try {
        const origTodo = await client.graphql({
          query: getTodo,
          variables: { id: currentTodoId }
        });
        if (origTodo) {
          if (origTodo.data.getTodo?.name !== nameToUpdate || origTodo.data.getTodo.description !== descriptionToUpdate) {
            const todoDetails = {
              id: currentTodoId,
              _version: origTodo.data.getTodo?._version,
              name: nameToUpdate,
              description: descriptionToUpdate
            };
            const updatedTodo = await client.graphql({
              query: updateTodo,
              variables: { input: todoDetails }
            });

            const updatedTodos = todos.map(todo =>
              todo.id === currentTodoId ? { ...todo, name: nameToUpdate, description: descriptionToUpdate, _version: updatedTodo.data.updateTodo._version } : todo
            );
            setTodos(updatedTodos);
            setIsEditing(false);
            setCurrentTodoId(null);
            setMessage({ text: 'Todo updated successfully!', type: 'success' });
          }
        }
      } catch (err) {
        setMessage({ text: `Error updating todo`, type: 'error' });
        console.log(err);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentTodoId(null);
  };


  return (
    <View>
      <Heading level={1}>API GraphQL</Heading>
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
                  <Button variation="primary" colorTheme='error' onClick={() => removeTodo(todo.id, todo._version)}>Delete</Button>
                  <Button variation="primary" onClick={() => handleEditClick(todo)}>Update</Button>
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

export default APIGraphQL;
