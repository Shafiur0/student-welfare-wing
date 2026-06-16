/**
 * SQAT Student Welfare Wing - SQA Quiz Game Questions Data
 */

window.SQAT_QUIZ_QUESTIONS = [
  {
    id: "q-1",
    question: "Which testing type verifies that a recent code change has not adversely affected existing features?",
    options: [
      "Smoke Testing",
      "Regression Testing",
      "Sanity Testing",
      "System Testing"
    ],
    correct: 1,
    explanation: "Regression Testing is specifically performed to ensure that code updates, patches, or configuration changes have not introduced new bugs in previously verified features."
  },
  {
    id: "q-2",
    question: "In automated testing, what does the Page Object Model (POM) design pattern primarily solve?",
    options: [
      "Speeds up test execution times significantly",
      "Reduces code duplication and makes scripts easier to maintain",
      "Eliminates the need for writing assertions",
      "Directly interacts with the application database"
    ],
    correct: 1,
    explanation: "POM creates an abstraction of UI pages as classes. If the UI changes, you only update the locators inside that page class rather than updating multiple test scripts."
  },
  {
    id: "q-3",
    question: "What is the correct chronological sequence of states in the standard Defect Lifecycle?",
    options: [
      "New -> Fixed -> Open -> Retest -> Closed",
      "New -> Open -> Fixed -> Retest -> Closed",
      "Open -> New -> Fixed -> Closed -> Retest",
      "New -> Open -> Retest -> Fixed -> Closed"
    ],
    correct: 1,
    explanation: "A standard bug lifecycle moves from: New (reported) -> Open (approved by lead) -> Fixed (resolved by dev) -> Retest (validated by tester) -> Closed."
  },
  {
    id: "q-4",
    question: "In Selenium WebDriver, which locator strategy is generally considered the fastest for element lookup?",
    options: [
      "XPath",
      "CSS Selector",
      "ID",
      "Class Name"
    ],
    correct: 2,
    explanation: "Locating by ID is the fastest strategy because browsers optimize element selection internally via ID maps (similar to document.getElementById)."
  },
  {
    id: "q-5",
    question: "What is the primary difference between Severity and Priority of a defect?",
    options: [
      "Severity is the business urgency to fix; Priority is the technical impact",
      "Severity is set by Developers; Priority is set by Quality Assurance engineers",
      "Severity measures the bug's technical impact; Priority measures the business urgency",
      "They are identical terms and can be used interchangeably"
    ],
    correct: 2,
    explanation: "Severity measures the impact on system functionality (e.g., system crash is high severity). Priority measures business timeline constraints (e.g., typo on homepage is high priority)."
  },
  {
    id: "q-6",
    question: "Which automation testing tool is specifically built for modern, asynchronous web testing with auto-wait capabilities?",
    options: [
      "JMeter",
      "Playwright",
      "Selenium Grid",
      "Postman"
    ],
    correct: 1,
    explanation: "Playwright (developed by Microsoft) is built specifically for modern single-page apps, running out-of-process with native auto-waiting and browser context isolation."
  },
  {
    id: "q-7",
    question: "Which JUnit assertion verifies that two objects reference the exact same memory address location?",
    options: [
      "assertEquals()",
      "assertSame()",
      "assertNull()",
      "assertEquivalent()"
    ],
    correct: 1,
    explanation: "assertEquals() checks if values are equal (using .equals()). assertSame() checks if references are pointing to the exact same object (using ==)."
  },
  {
    id: "q-8",
    question: "What does Boundary Value Analysis (BVA) focus on testing?",
    options: [
      "The average values inside partition classes",
      "Performance bottlenecks under high workloads",
      "Values at the boundaries of equivalence partitions",
      "Code coverage percentage inside unit tests"
    ],
    correct: 2,
    explanation: "BVA focuses on values at equivalence partition boundaries (e.g. boundary, just below, just above) because defects tend to hide near parameter limits."
  },
  {
    id: "q-9",
    question: "What does the 'Arrange-Act-Assert' (AAA) pattern refer to in unit testing structures?",
    options: [
      "A pattern to code test setups, trigger functions, and verify outcomes",
      "A methodology to deploy code, run pipelines, and monitor servers",
      "An automation pipeline sequence for parallel runs",
      "A bug report layout containing title, steps, and expected results"
    ],
    correct: 0,
    explanation: "AAA organizes tests cleanly: Arrange (setup variables and state) -> Act (execute the target function) -> Assert (verify the returned results)."
  },
  {
    id: "q-10",
    question: "What type of testing evaluates if a system behaves correctly under spikes or peak virtual user load?",
    options: [
      "Sanity Testing",
      "Security Testing",
      "Load & Stress Testing",
      "Compatibility Testing"
    ],
    correct: 2,
    explanation: "Load & Stress Testing evaluates performance metrics (response times, CPU, errors) when subject to high volume workloads or unexpected spike volumes."
  }
];
