/**
 * Student Welfare Wing - SQA & Software Testing Resources Database
 * Software Quality Assurance & Testing Club (SQAT), DIU
 */

const resources = [
  {
    id: "selenium-cheatsheet",
    title: "Selenium WebDriver Cheatsheet",
    category: "cheatsheets",
    icon: "fa-solid fa-code",
    desc: "Quick reference guide for Selenium WebDriver commands in Java/Python. Includes locator strategies, wait statements, and element controls.",
    content: {
      type: "code",
      data: `// 1. Locators Examples (Java)
WebElement elementById = driver.findElement(By.id("submit-btn"));
WebElement elementByXpath = driver.findElement(By.xpath("//input[@name='search']"));
WebElement elementByCss = driver.findElement(By.cssSelector(".user-profile"));

// 2. Synchronous & Asynchronous Waits
// Implicit Wait (Sets global wait threshold)
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

// Explicit Wait (Waits for specific condition)
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));

// 3. User Actions
button.click();
elementByXpath.sendKeys("QA Automation");
elementByXpath.clear();

// 4. Handling Select Dropdowns
Select select = new Select(driver.findElement(By.id("department")));
select.selectByVisibleText("Software Engineering");

// 5. Switch to Iframe or Alert
driver.switchTo().frame("iframe-name");
driver.switchTo().alert().accept();`
    }
  },
  {
    id: "postman-cheatsheet",
    title: "Postman API Assertions Guide",
    category: "cheatsheets",
    icon: "fa-solid fa-cloud-arrow-down",
    desc: "Comprehensive cheatsheet for API test scripting in Postman, including status code checks, JSON payload parsing, and environment variables.",
    content: {
      type: "code",
      data: `// 1. Status Code Validation
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

// 2. Response Time Check
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// 3. Parsing JSON Response Body
pm.test("Validate User ID in Response", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.eql(12345);
    pm.expect(jsonData.status).to.eql("active");
});

// 4. Setting & Getting Variables
// Set Environment Variable
pm.environment.set("accessToken", pm.response.json().token);

// Get Global Variable
var baseUrl = pm.globals.get("baseUrl");

// 5. Header Assertions
pm.test("Content-Type header is application/json", function () {
    pm.response.to.have.header("Content-Type", "application/json");
});`
    }
  },
  {
    id: "jmeter-cheatsheet",
    title: "JMeter Load Testing Reference",
    category: "cheatsheets",
    icon: "fa-solid fa-gauge-high",
    desc: "Quick-start reference guide for load and performance testing with Apache JMeter. Includes threads configuration and correlation assertions.",
    content: {
      type: "text",
      data: `### 1. Thread Group Configurations
*   **Number of Threads (Users)**: Total simulated users performing requests.
*   **Ramp-Up Period (seconds)**: Duration in which all threads are spawned (e.g., 100 users ramped up in 50s = 2 users spawned per second).
*   **Loop Count**: Number of times the task executes per thread.

### 2. Timers
*   **Constant Timer**: Introduces a fixed delay between requests (simulates user think time).
*   **Gaussian Random Timer**: Delays threads by a random interval around a mean value.

### 3. Assertions
*   **Response Assertion**: Validates response text, code, or message matches expressions.
*   **Duration Assertion**: Fails a request if response time exceeds target milliseconds.

### 4. Correlation (Regular Expression Extractor)
Used to pass dynamic values (like Session IDs or CSRF tokens) from one request to subsequent ones:
*   **Reference Name**: \`session_id\`
*   **Regular Expression**: \`session_id="([^"]+)"\`
*   **Template**: \`$1$\`
*   **Match No.**: \`1\``
    }
  },
  {
    id: "testcase-template",
    title: "Standard QA Test Case Template",
    category: "templates",
    icon: "fa-solid fa-file-invoice",
    desc: "A ready-to-use tabular template outlining standard headers for comprehensive manual test case documentation.",
    content: {
      type: "table",
      data: {
        headers: ["Field", "Sample Entry", "Description"],
        rows: [
          ["Test Case ID", "TC_LOGIN_001", "Unique alphanumeric identifier."],
          ["Test Scenario", "User Login with valid credentials", "Broad testing category or user flow."],
          ["Preconditions", "User has a registered account and is on the login page", "State required before execution."],
          ["Test Steps", "1. Enter email: test@diu.edu.bd\n2. Enter password: User123!\n3. Click 'Sign In'", "Step-by-step action instructions."],
          ["Expected Result", "User dashboard loads successfully displaying 'Welcome back' message", "Desired system behavior."],
          ["Actual Result", "User logged in and dashboard loaded as expected", "Observed outcome (filled post-test)."],
          ["Status", "PASS / FAIL / BLOCK", "Execution status."]
        ]
      }
    }
  },
  {
    id: "bug-report-template",
    title: "Bug Report Template & Guide",
    category: "templates",
    icon: "fa-solid fa-bug",
    desc: "A detailed report template listing critical fields required to report software defects effectively to SWE development teams.",
    content: {
      type: "table",
      data: {
        headers: ["Header Field", "Example Value", "Guidelines"],
        rows: [
          ["Defect ID", "BUG_RESET_042", "Unique tracking ID."],
          ["Title / Summary", "Password Reset Link leads to 404 page", "Concise summary outlining action and failure."],
          ["Steps to Reproduce", "1. Navigate to Reset page\n2. Enter email and submit\n3. Click emailed link", "Numbered actions to trigger the defect."],
          ["Actual Result", "Browser redirects to DIU 404 page", "What the system actually did wrong."],
          ["Expected Result", "Browser opens the 'Create New Password' form", "What the system was supposed to do."],
          ["Severity / Priority", "High / Medium", "Impact on software usability vs scheduling fix urgency."],
          ["Environment", "Windows 11 / Chrome v120 / Staging Build 1.4", "OS, browser, device, and software build version."]
        ]
      }
    }
  },
  {
    id: "interview-manual-qa",
    title: "Manual Testing Interview Guide",
    category: "interview",
    icon: "fa-solid fa-clipboard-question",
    desc: "Curated list of standard manual testing concepts, testing lifecycles, and key terminology frequently asked in software QA job interviews.",
    content: {
      type: "text",
      data: `### 1. Manual Testing Core Q&A

**Q: What is the difference between Verification and Validation?**
*   **Verification**: Evaluating documents, plans, code, and specifications to ensure the product meets standard requirements. (Static testing - *Are we building the product right?*)
*   **Validation**: Executing the actual software to verify it matches user specifications and requirements. (Dynamic testing - *Are we building the right product?*)

**Q: What is the Defect Life Cycle?**
The sequence of states a defect goes through from discovery to closure:
1.  **New**: Logged by tester.
2.  **Assigned**: Assigned to developer.
3.  **Open**: Developer reviews it.
4.  **Fixed**: Developer edits code and fixes bug.
5.  **Pending Retest**: Ready for testing check.
6.  **Retest**: Tester tests the build.
7.  **Verified**: Tester confirms fixed.
8.  **Closed**: Finished. (Or **Reopened** if fix failed).

**Q: What is boundary value testing?**
A black-box technique where test cases focus on input thresholds (boundaries). E.g., if input must be 1 to 100, test boundaries at 0, 1, 2, 99, 100, 101.`
    }
  },
  {
    id: "interview-automation-qa",
    title: "Automation Testing QA Cheat Sheet",
    category: "interview",
    icon: "fa-solid fa-laptop-code",
    desc: "Key questions, concepts, and designs for test automation, including POM, frameworks, assertions, and exceptions.",
    content: {
      type: "text",
      data: `### 2. Test Automation Core Concepts

**Q: What is the Page Object Model (POM) design pattern?**
POM is an architectural pattern in test automation where each web page has a corresponding Page Class.
*   **Goal**: Page classes house locator definitions and action methods, keeping tests clean.
*   **Benefits**: Reduces code duplication and simplifies maintenance. If an element ID changes, you only edit the Page Class, not the individual scripts.

**Q: What are the components of a Test Automation Framework?**
1.  **Test Script Layer**: Houses the actual tests (e.g., JUnit, TestNG).
2.  **Page Objects**: Houses locators and page element controls.
3.  **Utility Layer**: Connectors for Excel/JSON readers, DB readers, reporting, and screenshots.
4.  **Drivers / APIs**: WebDrivers or API test libraries (Selenium, Playwright).
5.  **Execution Reports**: ExtentReports, Allure, or JUnit outputs.

**Q: How do you handle common exceptions in Selenium?**
*   **NoSuchElementException**: Caused by wrong selector or slow loads. Resolve with Explicit Waits.
*   **StaleElementReferenceException**: Caused when element is no longer attached to DOM. Resolve by refreshing page or relocating element.`
    }
  }
];

// Assign globally for import simplicity in browser vanilla JS
window.SQAT_RESOURCES = resources;
