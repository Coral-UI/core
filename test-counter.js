const { transformReactComponentToSpec } = require('./packages/react-to-coral/dist/index.cjs')

const counterComponent = `
import React, { useState } from "react";

type CounterProps = {
  initialValue?: number;               // a prop with a default
  step?: number;                       // another prop
  onChange?: (value: number) => void;  // callback event
};

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  step = 1,
  onChange,
}) => {
  // internal state
  const [count, setCount] = useState(initialValue);

  const handleIncrement = () => {
    const newValue = count + step;
    setCount(newValue);
    onChange?.(newValue); // trigger callback if provided
  };

  const handleDecrement = () => {
    const newValue = count - step;
    setCount(newValue);
    onChange?.(newValue);
  };

  return (
    <div>
      <p>Current value: {count}</p>
      <button onClick={handleIncrement}>Increase</button>
      <button onClick={handleDecrement}>Decrease</button>
    </div>
  );
};

export default Counter;
`

try {
  console.log('🧪 Testing enhanced TypeScript property extraction with Counter component...\n')
  
  const result = transformReactComponentToSpec(counterComponent)
  
  console.log('✅ Component parsing successful!')
  console.log('Component Name:', result.componentName)
  console.log('Element Type:', result.elementType)
  console.log('')
  
  console.log('📋 Component Properties Documentation (Root Level):')
  console.log(JSON.stringify(result.componentProperties, null, 2))
  console.log('')
  
  console.log('📋 Full Result Structure:')
  console.log('Keys:', Object.keys(result))
  console.log('Has componentProperties array:', Array.isArray(result.componentProperties))
  
  // Check if there are any component properties in the spec structure
  if (result.children && result.children.length > 0) {
    console.log('')
    console.log('🔍 First Child Component Properties:')
    console.log(JSON.stringify(result.children[0]?.componentProperties, null, 2))
  }
  console.log('')
  
  console.log('🏷️  Element Attributes (for HTML output):')
  console.log(JSON.stringify(result.elementAttributes, null, 2))
  console.log('')
  
  console.log('🔧 State Hooks:')
  console.log(JSON.stringify(result.stateHooks, null, 2))
  console.log('')
  
  console.log('⚙️  Methods:')
  console.log(JSON.stringify(result.methods, null, 2))
  
} catch (error) {
  console.error('❌ Error:', error.message)
}