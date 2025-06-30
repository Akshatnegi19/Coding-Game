import type { Challenge } from "../types/game"

export const challenges: Challenge[] = [
  {
    id: "hello-world",
    title: "Hello, World!",
    description: "Write a function that returns 'Hello, World!'",
    difficulty: "beginner",
    category: "functions",
    instructions: "Create a function called `sayHello` that returns the string 'Hello, World!'",
    starterCode: `function sayHello() {
  // Your code here
  
}`,
    solution: `function sayHello() {
  return "Hello, World!";
}`,
    testCases: [
      {
        id: "test1",
        input: [],
        expectedOutput: "Hello, World!",
        description: "Should return 'Hello, World!'",
      },
    ],
    hints: [
      "Use the 'return' keyword to return a value from a function",
      "Strings in JavaScript are enclosed in quotes",
    ],
    maxScore: 100,
  },
  {
    id: "sum-two-numbers",
    title: "Sum Two Numbers",
    description: "Write a function that adds two numbers together",
    difficulty: "beginner",
    category: "functions",
    instructions: "Create a function called `addNumbers` that takes two parameters and returns their sum",
    starterCode: `function addNumbers(a, b) {
  // Your code here
  
}`,
    solution: `function addNumbers(a, b) {
  return a + b;
}`,
    testCases: [
      {
        id: "test1",
        input: [2, 3],
        expectedOutput: 5,
        description: "addNumbers(2, 3) should return 5",
      },
      {
        id: "test2",
        input: [10, -5],
        expectedOutput: 5,
        description: "addNumbers(10, -5) should return 5",
      },
      {
        id: "test3",
        input: [0, 0],
        expectedOutput: 0,
        description: "addNumbers(0, 0) should return 0",
      },
    ],
    hints: ["Use the + operator to add two numbers", "Don't forget to return the result"],
    maxScore: 150,
  },
  {
    id: "find-max",
    title: "Find Maximum",
    description: "Find the largest number in an array",
    difficulty: "intermediate",
    category: "arrays",
    instructions: "Create a function called `findMax` that takes an array of numbers and returns the largest one",
    starterCode: `function findMax(numbers) {
  // Your code here
  
}`,
    solution: `function findMax(numbers) {
  return Math.max(...numbers);
}`,
    testCases: [
      {
        id: "test1",
        input: [[1, 5, 3, 9, 2]],
        expectedOutput: 9,
        description: "findMax([1, 5, 3, 9, 2]) should return 9",
      },
      {
        id: "test2",
        input: [[-1, -5, -3]],
        expectedOutput: -1,
        description: "findMax([-1, -5, -3]) should return -1",
      },
      {
        id: "test3",
        input: [[42]],
        expectedOutput: 42,
        description: "findMax([42]) should return 42",
      },
    ],
    hints: [
      "You can use Math.max() with the spread operator",
      "Or use a loop to compare each number",
      "Consider what happens with negative numbers",
    ],
    maxScore: 200,
    timeLimit: 300,
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    description: "Reverse the characters in a string",
    difficulty: "intermediate",
    category: "algorithms",
    instructions: "Create a function called `reverseString` that takes a string and returns it reversed",
    starterCode: `function reverseString(str) {
  // Your code here
  
}`,
    solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    testCases: [
      {
        id: "test1",
        input: ["hello"],
        expectedOutput: "olleh",
        description: "reverseString('hello') should return 'olleh'",
      },
      {
        id: "test2",
        input: ["JavaScript"],
        expectedOutput: "tpircSavaJ",
        description: "reverseString('JavaScript') should return 'tpircSavaJ'",
      },
      {
        id: "test3",
        input: [""],
        expectedOutput: "",
        description: "reverseString('') should return ''",
      },
    ],
    hints: [
      "You can convert a string to an array with split('')",
      "Arrays have a reverse() method",
      "Convert back to string with join('')",
    ],
    maxScore: 180,
  },
  {
    id: "fibonacci",
    title: "Fibonacci Sequence",
    description: "Generate the nth Fibonacci number",
    difficulty: "advanced",
    category: "algorithms",
    instructions: "Create a function called `fibonacci` that returns the nth number in the Fibonacci sequence",
    starterCode: `function fibonacci(n) {
  // Your code here
  
}`,
    solution: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    testCases: [
      {
        id: "test1",
        input: [0],
        expectedOutput: 0,
        description: "fibonacci(0) should return 0",
      },
      {
        id: "test2",
        input: [1],
        expectedOutput: 1,
        description: "fibonacci(1) should return 1",
      },
      {
        id: "test3",
        input: [6],
        expectedOutput: 8,
        description: "fibonacci(6) should return 8",
      },
      {
        id: "test4",
        input: [10],
        expectedOutput: 55,
        description: "fibonacci(10) should return 55",
        isHidden: true,
      },
    ],
    hints: [
      "Base cases: fibonacci(0) = 0, fibonacci(1) = 1",
      "For n > 1: fibonacci(n) = fibonacci(n-1) + fibonacci(n-2)",
      "Consider using recursion or iteration",
    ],
    maxScore: 300,
    timeLimit: 600,
  },
]
