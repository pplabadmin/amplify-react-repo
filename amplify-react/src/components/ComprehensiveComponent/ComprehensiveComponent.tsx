import React, { useState, useEffect } from 'react';
import './ComprehensiveComponent.css';

interface Props {
  initialCount?: number;
}

const ComprehensiveComponent: React.FC<Props> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);
  const [name, setName] = useState('React Developer');

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div className='component-container'>
      <h1 className='greeting'>Hello, {name}!</h1>
      <p className='count'>Count: {count}</p>
      <button className='button' onClick={increment}>Increment</button>
      <button className='button' onClick={decrement}>Decrement</button>
      <input type="text" className='input' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter your name' />
    </div>
  );
};

export default ComprehensiveComponent;

