export interface TestCase {
  id: string;
  title: string;
  steps: string[];
  expected: string;
}

export interface GeneratedTests {
  positive: TestCase[];
  negative: TestCase[];
  edge: TestCase[];
}

let idCounter = 0;
const makeId = () => `tc-${++idCounter}`;

export function generateTestCases(feature: string): GeneratedTests {
  const f = feature.trim().toLowerCase();

  // Positive scenarios
  const positive: TestCase[] = [
    {
      id: makeId(),
      title: "Successful operation with valid input",
      steps: [
        `Navigate to the ${feature} feature`,
        "Provide all required valid inputs",
        "Submit the request",
      ],
      expected: `The ${feature} completes successfully and the user sees a confirmation.`,
    },
    {
      id: makeId(),
      title: "Verify correct data is displayed",
      steps: [
        `Open the ${feature} section`,
        "Provide sample valid data",
        "Observe the output or response",
      ],
      expected: "All returned data matches the expected format and values.",
    },
    {
      id: makeId(),
      title: "Repeat operation is idempotent",
      steps: [
        `Perform the ${feature} action once`,
        "Perform the same action again with identical inputs",
      ],
      expected: "The system handles the duplicate gracefully without errors or duplicated data.",
    },
  ];

  // Negative scenarios
  const negative: TestCase[] = [
    {
      id: makeId(),
      title: "Empty required fields",
      steps: [
        `Open the ${feature} form`,
        "Leave all required fields empty",
        "Attempt to submit",
      ],
      expected: "Validation errors are shown for each required field. Submission is blocked.",
    },
    {
      id: makeId(),
      title: "Invalid data format",
      steps: [
        `Navigate to ${feature}`,
        "Enter data in an incorrect format (e.g., letters in a numeric field)",
        "Submit the form",
      ],
      expected: "The system rejects the input and displays a clear error message.",
    },
    {
      id: makeId(),
      title: "Unauthorized access attempt",
      steps: [
        "Log out or use an unauthenticated session",
        `Try to access ${feature} directly`,
      ],
      expected: "Access is denied and the user is redirected to a login or error page.",
    },
  ];

  // Edge case scenarios
  const edge: TestCase[] = [
    {
      id: makeId(),
      title: "Maximum length input",
      steps: [
        `Open the ${feature} input`,
        "Enter the maximum allowed characters in every text field",
        "Submit",
      ],
      expected: "The system accepts the input without truncation or errors.",
    },
    {
      id: makeId(),
      title: "Special characters and unicode",
      steps: [
        `Navigate to ${feature}`,
        "Enter special characters (é, ñ, 你好, 🚀) in text fields",
        "Submit and verify stored data",
      ],
      expected: "All special characters are preserved correctly in storage and display.",
    },
    {
      id: makeId(),
      title: "Concurrent submissions",
      steps: [
        `Open ${feature} in two browser tabs`,
        "Submit different data simultaneously from both tabs",
      ],
      expected: "Both submissions are processed correctly without data corruption or race conditions.",
    },
  ];

  return { positive, negative, edge };
}
