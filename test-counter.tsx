import React, { useState } from "react";

type CounterProps = {
  initialValue?: number;               // starting value
  step?: number;                       // increment/decrement step
  label?: string;                      // new prop for custom text
  onChange?: (value: number) => void;  // callback when count changes
};

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  step = 1,
  label = "Counter", // default if not passed
  onChange,
}) => {
  const [count, setCount] = useState(initialValue);

  const handleIncrement = () => {
    const newValue = count + step;
    setCount(newValue);
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = count - step;
    setCount(newValue);
    onChange?.(newValue);
  };

  return (
    <div>
      <h3>{label}</h3>
      <p>Current value: {count}</p>
      <button onClick={handleIncrement}>Increase</button>
      <button onClick={handleDecrement}>Decrease</button>
    </div>
  );
};

export default Counter;