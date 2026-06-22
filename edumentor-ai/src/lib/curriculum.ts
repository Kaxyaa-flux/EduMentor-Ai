export const CURRICULUM_MAP: Record<string, string[]> = {
  "Python": [
    "Variables & Types",
    "Control Flow (Loops & Ifs)",
    "Lists & Tuples",
    "Functions & Scope",
    "Dictionaries & Sets",
    "Object-Oriented Programming",
    "APIs & Requests"
  ],
  "JavaScript": [
    "Variables & Let/Const",
    "Functions & Arrow Functions",
    "Arrays & Objects",
    "DOM Manipulation",
    "Promises & Async/Await",
    "Fetch API"
  ],
  "Java": [
    "Syntax & Data Types",
    "Control Flow",
    "Classes & Objects",
    "Inheritance & Polymorphism",
    "Collections Framework",
    "Exception Handling"
  ],
  "C": [
    "Basic Syntax & Types",
    "Operators & Expressions",
    "Control Structures",
    "Functions",
    "Arrays & Strings",
    "Pointers & Memory"
  ],
  "C++": [
    "Basic Syntax & Types",
    "Control Structures",
    "Functions & Overloading",
    "Pointers & References",
    "Classes & Objects",
    "STL & Templates"
  ],
  "HTML/CSS": [
    "HTML Elements & Structure",
    "Forms & Inputs",
    "CSS Selectors & Colors",
    "Box Model",
    "Flexbox & Grid",
    "Responsive Design"
  ]
}

export function getCurriculumForTopic(topic: string): string[] {
  return CURRICULUM_MAP[topic] || CURRICULUM_MAP["Python"]
}
