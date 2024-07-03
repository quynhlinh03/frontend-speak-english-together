export interface IFormInputs {
  fullName: string;
  level: string;
  nationality: string;
  nativeLanguage: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const levelData = [
  {
    image:
      "https://img.freepik.com/premium-vector/cute-little-dinosaur-with-alphabet-number-3_64235-1094.jpg?w=826",
    label: "Beginner",
    value: "BEGINNER",
  },
  {
    image:
      "https://img.freepik.com/premium-vector/cute-little-dinosaur-with-alphabet-number-2_64235-1096.jpg?w=826",
    label: "Intermediate",
    value: "INTERMEDIATE",
  },
  {
    image:
      "https://img.freepik.com/premium-vector/cute-little-dinosaur-with-alphabet-number-1_64235-1095.jpg?w=826",
    label: "Advanced",
    value: "ADVANCED",
  },
];

export const levelSpeakData = [
  {
    image:
      "https://img.freepik.com/premium-vector/cute-little-dinosaur-with-alphabet-number-3_64235-1094.jpg?w=826",
    label: "Easy",
    value: "EASY",
  },
  {
    image:
      "https://img.freepik.com/premium-vector/cute-little-dinosaur-with-alphabet-number-2_64235-1096.jpg?w=826",
    label: "Medium",
    value: "MEDIUM",
  },
  {
    image:
      "https://img.freepik.com/premium-vector/cute-little-dinosaur-with-alphabet-number-1_64235-1095.jpg?w=826",
    label: "Hard",
    value: "HARD",
  },
];
