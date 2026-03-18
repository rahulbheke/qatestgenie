export type Severity = "critical" | "high" | "medium" | "low";
export type Priority = "P0" | "P1" | "P2" | "P3";

export interface TestCase {
  id: string;
  title: string;
  steps: string[];
  expected: string;
  severity: Severity;
  priority: Priority;
}

export interface GeneratedTests {
  positive: TestCase[];
  negative: TestCase[];
  edge: TestCase[];
}

let idCounter = 0;
const makeId = (prefix: string) => `${prefix}-${String(++idCounter).padStart(3, "0")}`;

export function formatTestCase(tc: TestCase): string {
  const lines = [
    `ID: ${tc.id}`,
    `Title: ${tc.title}`,
    `Priority: ${tc.priority} | Severity: ${tc.severity}`,
    `Steps:`,
    ...tc.steps.map((s, i) => `  ${i + 1}. ${s}`),
    `Expected Result: ${tc.expected}`,
  ];
  return lines.join("\n");
}

export function formatAllTestCases(results: GeneratedTests): string {
  const sections = [
    { label: "POSITIVE (Happy Path)", cases: results.positive },
    { label: "NEGATIVE (Error Handling)", cases: results.negative },
    { label: "EDGE (Boundary)", cases: results.edge },
  ];
  return sections
    .map((s) => `═══ ${s.label} ═══\n\n${s.cases.map(formatTestCase).join("\n\n")}`)
    .join("\n\n");
}

export function mergeGeneratedTests(results: GeneratedTests[]): GeneratedTests {
  return {
    positive: results.flatMap((r) => r.positive),
    negative: results.flatMap((r) => r.negative),
    edge: results.flatMap((r) => r.edge),
  };
}

export function generateTestCases(feature: string): GeneratedTests {
  const positive: TestCase[] = [
    {
      id: makeId("POS"),
      title: "Successful operation with valid input",
      steps: [
        `Navigate to the ${feature} feature`,
        "Provide all required valid inputs",
        "Submit the request",
      ],
      expected: `The ${feature} completes successfully and the user sees a confirmation.`,
      severity: "critical",
      priority: "P0",
    },
    {
      id: makeId("POS"),
      title: "Verify correct data is displayed",
      steps: [
        `Open the ${feature} section`,
        "Provide sample valid data",
        "Observe the output or response",
      ],
      expected: "All returned data matches the expected format and values.",
      severity: "high",
      priority: "P1",
    },
    {
      id: makeId("POS"),
      title: "Repeat operation is idempotent",
      steps: [
        `Perform the ${feature} action once`,
        "Perform the same action again with identical inputs",
      ],
      expected: "The system handles the duplicate gracefully without errors or duplicated data.",
      severity: "medium",
      priority: "P2",
    },
  ];

  const negative: TestCase[] = [
    {
      id: makeId("NEG"),
      title: "Empty required fields",
      steps: [
        `Open the ${feature} form`,
        "Leave all required fields empty",
        "Attempt to submit",
      ],
      expected: "Validation errors are shown for each required field. Submission is blocked.",
      severity: "critical",
      priority: "P0",
    },
    {
      id: makeId("NEG"),
      title: "Invalid data format",
      steps: [
        `Navigate to ${feature}`,
        "Enter data in an incorrect format (e.g., letters in a numeric field)",
        "Submit the form",
      ],
      expected: "The system rejects the input and displays a clear error message.",
      severity: "high",
      priority: "P1",
    },
    {
      id: makeId("NEG"),
      title: "Unauthorized access attempt",
      steps: [
        "Log out or use an unauthenticated session",
        `Try to access ${feature} directly`,
      ],
      expected: "Access is denied and the user is redirected to a login or error page.",
      severity: "critical",
      priority: "P0",
    },
  ];

  const edge: TestCase[] = [
    {
      id: makeId("EDG"),
      title: "Maximum length input",
      steps: [
        `Open the ${feature} input`,
        "Enter the maximum allowed characters in every text field",
        "Submit",
      ],
      expected: "The system accepts the input without truncation or errors.",
      severity: "medium",
      priority: "P2",
    },
    {
      id: makeId("EDG"),
      title: "Special characters and unicode",
      steps: [
        `Navigate to ${feature}`,
        "Enter special characters (é, ñ, 你好, 🚀) in text fields",
        "Submit and verify stored data",
      ],
      expected: "All special characters are preserved correctly in storage and display.",
      severity: "high",
      priority: "P1",
    },
    {
      id: makeId("EDG"),
      title: "Concurrent submissions",
      steps: [
        `Open ${feature} in two browser tabs`,
        "Submit different data simultaneously from both tabs",
      ],
      expected: "Both submissions are processed correctly without data corruption or race conditions.",
      severity: "medium",
      priority: "P2",
    },
  ];

  return { positive, negative, edge };
}
