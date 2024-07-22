import { useEffect, useState } from 'react'

export const useLocalStorage = <T>(
  key: string,// The key under which the value will be stored in localStorage
  initialValue: T  // The initial value to use if no value is found in localStorage
): [T, (value: T) => void] => { // Returns a tuple with the current value and a setter function
  
  // Create a state variable to hold the value
  const [storedValue, setStoredValue] = useState(initialValue)

  // This effect runs once when the component mounts

  useEffect(() => {
    // // Try to get the value from localStorage
    const item = window.localStorage.getItem(key)
    if (item) {
       // If a value is found, parse it from JSON and update the state
      setStoredValue(JSON.parse(item))
    }
    // The effect depends on the 'key', so it will re-run if the key changes
  }, [key])

  // This function updates both the React state and localStorage
  const setValue = (value: T) => {
    // Save state
    setStoredValue(value)
    // Save the new value to localStorage, converting it to a JSON 
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  // Return the current value and the setter function
  return [storedValue, setValue]
}


