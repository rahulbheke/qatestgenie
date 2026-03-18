export type AppType = "web" | "mobile" | "api";
export type TestingType = "regression" | "smoke" | "sanity" | "api";

export interface SimTestCase {
  id: string;
  scenario: string;
  steps: string[];
  expected: string;
}

export interface AutomationStrategy {
  automateFirst: string[];
  keepManual: string[];
  riskAreas: string[];
}

export interface RecommendedTool {
  name: string;
  purpose: string;
  icon: string;
}

export interface ExecutionPlan {
  pipeline: string[];
  frequency: string;
  environments: string[];
}

export interface StrategyResult {
  testCases: SimTestCase[];
  strategy: AutomationStrategy;
  tools: RecommendedTool[];
  executionPlan: ExecutionPlan;
}

let counter = 0;
const nextId = () => `TC-${String(++counter).padStart(3, "0")}`;

const webTestCases: Record<TestingType, (m: string) => SimTestCase[]> = {
  regression: (m) => [
    { id: nextId(), scenario: `Verify ${m} page loads correctly after recent code changes`, steps: ["Navigate to the application URL", `Open the ${m} page`, "Verify all elements render"], expected: "Page loads without errors; all components visible" },
    { id: nextId(), scenario: `Validate ${m} form submission with valid data`, steps: ["Fill in all required fields with valid data", "Click Submit", "Wait for response"], expected: "Form submits successfully with confirmation message" },
    { id: nextId(), scenario: `Check ${m} search functionality returns accurate results`, steps: ["Enter a known search term", "Click Search", "Review results"], expected: "Search results match the query; no irrelevant items" },
    { id: nextId(), scenario: `Verify ${m} navigation links are not broken`, steps: ["Click each nav link on the page", "Verify destination loads", "Check back navigation"], expected: "All links resolve correctly; no 404 errors" },
    { id: nextId(), scenario: `Test ${m} responsive layout on different viewports`, steps: ["Open DevTools", "Switch to mobile/tablet/desktop sizes", "Verify layout adapts"], expected: "No overflow, broken layouts, or hidden content" },
    { id: nextId(), scenario: `Validate ${m} data persistence after page refresh`, steps: ["Enter data and save", "Refresh the page", "Verify data is retained"], expected: "Data persists correctly after refresh" },
    { id: nextId(), scenario: `Check ${m} error handling for server errors`, steps: ["Simulate a 500 server error", "Observe UI behavior", "Check error messaging"], expected: "User-friendly error message displayed; no crash" },
  ],
  smoke: (m) => [
    { id: nextId(), scenario: `Verify ${m} application launches without critical errors`, steps: ["Open the application URL", "Check browser console for errors"], expected: "Application loads; no critical console errors" },
    { id: nextId(), scenario: `Login to ${m} with valid credentials`, steps: ["Enter valid username/password", "Click Login"], expected: "User is authenticated and redirected to dashboard" },
    { id: nextId(), scenario: `Verify ${m} main dashboard elements`, steps: ["Navigate to dashboard", "Check key widgets and sections"], expected: "All primary sections visible and functional" },
    { id: nextId(), scenario: `Test ${m} logout functionality`, steps: ["Click Logout button", "Verify redirect to login"], expected: "User session ends; redirect to login page" },
    { id: nextId(), scenario: `Check ${m} basic CRUD operation works`, steps: ["Create a record", "Read it back", "Update one field", "Delete it"], expected: "All CRUD operations complete without errors" },
  ],
  sanity: (m) => [
    { id: nextId(), scenario: `Verify ${m} critical bugfix is resolved`, steps: ["Reproduce the original bug steps", "Observe behavior"], expected: "Bug no longer occurs; expected behavior observed" },
    { id: nextId(), scenario: `Check ${m} new feature works as specified`, steps: ["Navigate to the new feature", "Perform primary action", "Verify output"], expected: "Feature works per acceptance criteria" },
    { id: nextId(), scenario: `Validate ${m} affected module after code merge`, steps: ["Open the affected module", "Run through primary flow", "Check data integrity"], expected: "Module functions correctly after merge" },
    { id: nextId(), scenario: `Verify ${m} integration points after deployment`, steps: ["Trigger API calls from the UI", "Check third-party integrations"], expected: "Integrations respond correctly" },
    { id: nextId(), scenario: `Check ${m} config changes took effect`, steps: ["Verify updated configuration values", "Test behavior dependent on config"], expected: "Application reflects configuration changes" },
  ],
  api: (m) => [
    { id: nextId(), scenario: `Verify ${m} API endpoint responds with 200 OK`, steps: ["Send GET request to the endpoint", "Check response status"], expected: "Status code 200 with valid response body" },
    { id: nextId(), scenario: `Test ${m} API with invalid authentication`, steps: ["Send request without auth token", "Check response"], expected: "401 Unauthorized returned" },
    { id: nextId(), scenario: `Validate ${m} API response schema`, steps: ["Send valid request", "Parse response JSON", "Validate against schema"], expected: "Response matches expected schema" },
    { id: nextId(), scenario: `Test ${m} API rate limiting`, steps: ["Send rapid consecutive requests", "Monitor response codes"], expected: "429 Too Many Requests after threshold" },
    { id: nextId(), scenario: `Verify ${m} API pagination works correctly`, steps: ["Request page 1", "Request page 2", "Compare results"], expected: "Pages return unique, ordered results" },
    { id: nextId(), scenario: `Test ${m} API with boundary input values`, steps: ["Send requests with min/max/empty values", "Check responses"], expected: "Proper validation errors or success for each case" },
  ],
};

const mobileTestCases: Record<TestingType, (m: string) => SimTestCase[]> = {
  regression: (m) => [
    { id: nextId(), scenario: `Verify ${m} app launches on iOS and Android`, steps: ["Install latest build", "Launch the app", "Check splash screen and home"], expected: "App launches without crash on both platforms" },
    { id: nextId(), scenario: `Test ${m} gesture navigation (swipe, pinch)`, steps: ["Swipe between screens", "Pinch to zoom", "Use pull-to-refresh"], expected: "Gestures work smoothly without lag" },
    { id: nextId(), scenario: `Validate ${m} push notification delivery`, steps: ["Trigger a notification event", "Check notification center", "Tap notification"], expected: "Notification received and deep-links correctly" },
    { id: nextId(), scenario: `Check ${m} offline mode behavior`, steps: ["Enable airplane mode", "Navigate the app", "Disable airplane mode"], expected: "Cached data available; syncs on reconnect" },
    { id: nextId(), scenario: `Verify ${m} camera/gallery integration`, steps: ["Open photo upload", "Take photo or select from gallery", "Submit"], expected: "Image captured/selected and uploaded successfully" },
    { id: nextId(), scenario: `Test ${m} app performance under low memory`, steps: ["Open multiple background apps", "Switch to test app", "Perform actions"], expected: "App remains responsive; no OOM crashes" },
  ],
  smoke: (m) => [
    { id: nextId(), scenario: `Verify ${m} app installs and launches`, steps: ["Download from store/TestFlight", "Install", "Launch"], expected: "App installs and opens to onboarding/home" },
    { id: nextId(), scenario: `Test ${m} login on mobile`, steps: ["Enter credentials", "Tap Sign In"], expected: "Authenticated and lands on home screen" },
    { id: nextId(), scenario: `Check ${m} core navigation tabs`, steps: ["Tap each bottom tab", "Verify content loads"], expected: "All tabs navigate correctly" },
    { id: nextId(), scenario: `Verify ${m} app handles orientation change`, steps: ["Rotate device to landscape", "Rotate back to portrait"], expected: "UI adapts correctly; no layout breaks" },
    { id: nextId(), scenario: `Test ${m} basic data sync`, steps: ["Create data on device", "Check server/dashboard"], expected: "Data syncs correctly to backend" },
  ],
  sanity: (m) => [
    { id: nextId(), scenario: `Verify ${m} hotfix resolves reported crash`, steps: ["Reproduce original crash steps", "Observe app behavior"], expected: "App no longer crashes; stable behavior" },
    { id: nextId(), scenario: `Check ${m} updated screen renders correctly`, steps: ["Navigate to updated screen", "Check layout and data"], expected: "Screen renders per design spec" },
    { id: nextId(), scenario: `Validate ${m} deep link routing after update`, steps: ["Open deep link URL", "Check app navigation"], expected: "App navigates to correct screen" },
    { id: nextId(), scenario: `Test ${m} biometric auth after SDK update`, steps: ["Enable biometric login", "Lock and unlock app"], expected: "Biometric authentication works correctly" },
    { id: nextId(), scenario: `Verify ${m} third-party SDK integration`, steps: ["Trigger SDK-dependent feature", "Check analytics/logs"], expected: "SDK functions correctly; events tracked" },
  ],
  api: (m) => webTestCases.api(m),
};

const apiTestCases: Record<TestingType, (m: string) => SimTestCase[]> = {
  regression: (m) => [
    { id: nextId(), scenario: `Verify all ${m} endpoints return expected status codes`, steps: ["Run full endpoint suite", "Check status codes"], expected: "All endpoints return correct status codes" },
    { id: nextId(), scenario: `Validate ${m} response payloads match schema`, steps: ["Send requests to each endpoint", "Validate against JSON schema"], expected: "All payloads conform to schema" },
    { id: nextId(), scenario: `Test ${m} error responses for invalid inputs`, steps: ["Send malformed requests", "Check error responses"], expected: "Proper error codes and messages returned" },
    { id: nextId(), scenario: `Verify ${m} database integrity after API operations`, steps: ["Perform CRUD via API", "Query database directly"], expected: "Database state matches API operations" },
    { id: nextId(), scenario: `Check ${m} API performance under load`, steps: ["Run 100 concurrent requests", "Measure response times"], expected: "P95 response time under 500ms" },
    { id: nextId(), scenario: `Test ${m} webhook delivery reliability`, steps: ["Trigger webhook events", "Check delivery logs"], expected: "All webhooks delivered within SLA" },
    { id: nextId(), scenario: `Validate ${m} API versioning compatibility`, steps: ["Send requests to v1 and v2 endpoints", "Compare responses"], expected: "Both versions respond correctly; backward compatible" },
  ],
  smoke: (m) => webTestCases.smoke(m),
  sanity: (m) => webTestCases.sanity(m),
  api: (m) => webTestCases.api(m),
};

const testCaseMap: Record<AppType, Record<TestingType, (m: string) => SimTestCase[]>> = {
  web: webTestCases,
  mobile: mobileTestCases,
  api: apiTestCases,
};

function getStrategy(appType: AppType, testingType: TestingType, module: string): AutomationStrategy {
  const strategies: Record<AppType, AutomationStrategy> = {
    web: {
      automateFirst: [
        "Login/authentication flows — high frequency, stable selectors",
        "Form validations — repetitive, data-driven scenarios",
        "Cross-browser smoke tests — catch rendering regressions early",
        `${module} CRUD operations — critical path, high ROI`,
      ],
      keepManual: [
        "Exploratory testing for new features",
        "Visual/UI pixel-perfect comparisons (until visual regression tools are set up)",
        "Complex multi-step user journeys with subjective UX evaluation",
      ],
      riskAreas: [
        "Dynamic content loading (lazy-loaded components, infinite scroll)",
        "Third-party integrations (payment gateways, OAuth providers)",
        "Session/token expiration edge cases",
        "Race conditions in concurrent user operations",
      ],
    },
    mobile: {
      automateFirst: [
        "App launch and onboarding flow — first impression, high priority",
        "Login/logout on both iOS and Android",
        `${module} core feature flow — critical business path`,
        "Push notification handling — tricky to test manually at scale",
      ],
      keepManual: [
        "Gesture-based interactions (complex swipes, multi-touch)",
        "Real-device testing on fragmented Android landscape",
        "Accessibility testing (screen readers, font scaling)",
      ],
      riskAreas: [
        "OS version compatibility (especially older Android versions)",
        "Memory leaks during extended usage sessions",
        "Background/foreground state transitions",
        "Network switching (WiFi ↔ cellular) during operations",
      ],
    },
    api: {
      automateFirst: [
        "Contract/schema validation — prevents breaking changes",
        "Authentication and authorization checks — security critical",
        `${module} CRUD endpoints — core business logic`,
        "Error response validation — ensure consistent error format",
      ],
      keepManual: [
        "Exploratory API testing for undocumented edge cases",
        "Performance profiling and bottleneck analysis",
        "Security penetration testing",
      ],
      riskAreas: [
        "Breaking changes in API contracts after updates",
        "Rate limiting and throttling behavior under load",
        "Data consistency in distributed transactions",
        "Timeout handling for long-running operations",
      ],
    },
  };
  return strategies[appType];
}

function getTools(appType: AppType): RecommendedTool[] {
  const toolSets: Record<AppType, RecommendedTool[]> = {
    web: [
      { name: "Playwright", purpose: "Modern E2E testing with auto-wait and multi-browser support", icon: "🎭" },
      { name: "Selenium WebDriver", purpose: "Industry-standard browser automation for cross-browser testing", icon: "🌐" },
      { name: "Cypress", purpose: "Fast, developer-friendly E2E testing with time-travel debugging", icon: "🌲" },
      { name: "Jest + Testing Library", purpose: "Unit and integration testing for React/JS components", icon: "🧪" },
      { name: "Tosca (Enterprise)", purpose: "Model-based test automation for enterprise-scale applications", icon: "🏢" },
    ],
    mobile: [
      { name: "Appium", purpose: "Cross-platform mobile automation for iOS and Android", icon: "📱" },
      { name: "Detox", purpose: "Gray-box E2E testing for React Native apps", icon: "⚛️" },
      { name: "XCUITest", purpose: "Native iOS UI testing framework by Apple", icon: "🍎" },
      { name: "Espresso", purpose: "Native Android UI testing framework by Google", icon: "🤖" },
      { name: "BrowserStack / Sauce Labs", purpose: "Cloud-based real-device testing at scale", icon: "☁️" },
    ],
    api: [
      { name: "Postman / Newman", purpose: "API development and automated collection runner", icon: "📮" },
      { name: "REST Assured", purpose: "Java-based API testing with fluent assertion syntax", icon: "☕" },
      { name: "k6", purpose: "Load testing and performance validation for APIs", icon: "⚡" },
      { name: "Pact", purpose: "Contract testing for microservice API compatibility", icon: "🤝" },
      { name: "Tosca (Enterprise)", purpose: "End-to-end API test automation for complex enterprise systems", icon: "🏢" },
    ],
  };
  return toolSets[appType];
}

function getExecutionPlan(appType: AppType, testingType: TestingType): ExecutionPlan {
  const plans: Record<TestingType, ExecutionPlan> = {
    regression: {
      pipeline: [
        "1. Developer pushes code → triggers CI pipeline",
        "2. Run unit tests (< 2 min gate)",
        "3. Build and deploy to staging environment",
        "4. Execute full regression suite in parallel",
        "5. Generate test report and notify team via Slack/Teams",
        "6. On pass → promote to pre-production",
      ],
      frequency: "On every merge to main branch + nightly full suite",
      environments: ["CI/CD (GitHub Actions / Jenkins / GitLab CI)", "Staging", "Pre-production"],
    },
    smoke: {
      pipeline: [
        "1. Deployment completes → auto-trigger smoke suite",
        "2. Run critical-path tests (< 5 min)",
        "3. Health-check all service endpoints",
        "4. Validate core UI flows (login, dashboard, key feature)",
        "5. Report pass/fail status on deployment dashboard",
      ],
      frequency: "After every deployment to any environment",
      environments: ["All environments (Dev, Staging, Production)"],
    },
    sanity: {
      pipeline: [
        "1. Bugfix/hotfix branch merged → trigger sanity suite",
        "2. Run targeted tests for affected module only",
        "3. Verify fix doesn't break adjacent functionality",
        "4. Quick regression check on related features",
        "5. Sign-off for release candidate",
      ],
      frequency: "After each bugfix/hotfix deployment",
      environments: ["Staging", "Pre-production"],
    },
    api: {
      pipeline: [
        "1. API code change detected → trigger contract tests",
        "2. Run schema validation against OpenAPI spec",
        "3. Execute functional API test suite",
        "4. Run performance baseline tests (response time, throughput)",
        "5. Validate backward compatibility with previous API version",
        "6. Generate API coverage report",
      ],
      frequency: "On every API-related commit + daily scheduled run",
      environments: ["CI/CD Pipeline", "API Gateway Staging", "Integration Environment"],
    },
  };
  return plans[testingType];
}

export function generateStrategy(
  appType: AppType,
  testingType: TestingType,
  module: string
): StrategyResult {
  counter = 0;
  const moduleName = module || "Core Module";
  const testCases = testCaseMap[appType][testingType](moduleName);
  const strategy = getStrategy(appType, testingType, moduleName);
  const tools = getTools(appType);
  const executionPlan = getExecutionPlan(appType, testingType);

  return { testCases, strategy, tools, executionPlan };
}

export function formatStrategyAsText(result: StrategyResult): string {
  const lines: string[] = [];

  lines.push("═══ TEST CASES ═══\n");
  result.testCases.forEach((tc) => {
    lines.push(`${tc.id}: ${tc.scenario}`);
    lines.push(`Steps:`);
    tc.steps.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
    lines.push(`Expected: ${tc.expected}\n`);
  });

  lines.push("═══ AUTOMATION STRATEGY ═══\n");
  lines.push("Automate First:");
  result.strategy.automateFirst.forEach((a) => lines.push(`  • ${a}`));
  lines.push("\nKeep Manual:");
  result.strategy.keepManual.forEach((m) => lines.push(`  • ${m}`));
  lines.push("\nRisk Areas:");
  result.strategy.riskAreas.forEach((r) => lines.push(`  • ${r}`));

  lines.push("\n═══ RECOMMENDED TOOLS ═══\n");
  result.tools.forEach((t) => lines.push(`${t.icon} ${t.name} — ${t.purpose}`));

  lines.push("\n═══ EXECUTION PLAN ═══\n");
  lines.push("Pipeline:");
  result.executionPlan.pipeline.forEach((p) => lines.push(`  ${p}`));
  lines.push(`\nFrequency: ${result.executionPlan.frequency}`);
  lines.push(`Environments: ${result.executionPlan.environments.join(", ")}`);

  return lines.join("\n");
}
