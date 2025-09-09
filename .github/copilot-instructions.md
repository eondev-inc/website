## Prime Directive
- Work on one file at a time to prevent corruption from simultaneous edits.
- Provide explanations and teach about changes during coding.
- Always ask for confirmation before proceeding with edits.
- Respond always in Spanish.
- Follow the strict rules of .eslintrc.json and .prettierrc.json.

## Large File & Complex Change Protocol

### Mandatory Planning Phase
For files >300 lines or complex changes:
1. Create a detailed plan before editing.
2. The plan must include:
   - Functions/sections to modify
   - Order of changes
   - Dependencies between changes
   - Estimated number of separate edits
3. Format plan as:
```
## PROPOSED EDIT PLAN
Working with: [filename]
Total planned edits: [number]
```

### Making Edits
- Focus on one conceptual change at a time.
- Show clear "before" and "after" snippets for proposed changes.
- Explain changes concisely, including the reasoning.
- Ensure edits align with the project's coding style (Vue.js conventions and TailwindCSS utility-first approach).

### Edit Sequence
1. [First specific change] - Purpose: [why]
2. [Second specific change] - Purpose: [why]
3. Request approval: "Do you approve this plan? I'll proceed with Edit [number] after your confirmation."
4. Wait for explicit user confirmation before proceeding with each edit.

### Execution Phase
- After each edit, indicate progress: "✅ Completed edit [#] of [total]. Ready for next edit?"
- If additional changes are needed during editing:
  - Stop and update the plan.
  - Get approval before continuing.

### Refactoring Guidance
When refactoring large files:
- Break work into logical, independently functional chunks.
- Ensure each intermediate state maintains functionality.
- Allow temporary duplication as an interim step.
- Specify the refactoring pattern being applied (e.g., component extraction, composable reuse).

### Rate Limit Avoidance
- For very large files, suggest splitting changes across multiple sessions.
- Prioritize logically complete units of change.
- Provide clear stopping points.

## General Requirements
Use modern Vue.js (Composition API preferred) and TailwindCSS for all code suggestions. Prioritize clean, maintainable code with appropriate comments.

### Accessibility
- Ensure compliance with **WCAG 2.1** AA level minimum, aiming for AAA where feasible.
- Always include:
  - Labels for form fields (e.g., `<label>` with `for` or `aria-label`).
  - Proper **ARIA** roles and attributes (e.g., `role="button"`, `aria-hidden`).
  - Adequate color contrast (use TailwindCSS classes like `bg-contrast-500`).
  - Alternative texts (`alt`, `aria-label`) for images and interactive elements.
  - Semantic HTML within Vue components (e.g., `<header>`, `<main>`).
  - Tools like **Lighthouse** for accessibility audits.

### Browser Compatibility
- Support the latest two stable releases of Firefox, Chrome, Edge, and Safari (macOS/iOS).
- Use feature detection (e.g., `if ('fetch' in window)`) in JavaScript logic.
- Apply progressive enhancement with tools like **Vite** for bundling and polyfills.
- Ensure TailwindCSS configurations are compatible with modern browsers.

## Vue.js and TailwindCSS Requirements

### Vue.js
- Use **Vue 3** with the Composition API (or Options API if explicitly requested).
- Structure components for reusability and maintainability.
- Use **Vite** as the build tool unless otherwise specified.
- Leverage Vue-specific features like:
  - Reactive refs (`ref`, `reactive`) and computed properties.
  - Composables for reusable logic.
  - Slots for flexible component composition.
  - Vue Router for navigation.
  - Pinia for state management (if needed).
- Avoid global state unless justified; prefer scoped composables or Pinia stores.
- Ensure components are accessible (e.g., `aria-label` on buttons, `focus` management).

### TailwindCSS
- Use utility-first TailwindCSS classes for styling (e.g., `flex justify-center items-center`).
- Integrate **Flowbite** components alongside TailwindCSS for pre-built, accessible UI elements.
- Follow TailwindCSS best practices:
  - Use responsive prefixes (e.g., `sm:`, `md:`, `lg:`) for responsive design.
  - Leverage Tailwind’s JIT mode for optimized CSS output.
  - Use custom configurations in `tailwind.config.js` for project-specific themes.
- Ensure Flowbite components are accessible and styled consistently with TailwindCSS.

### HTML
- Use semantic HTML5 elements within Vue templates (`<header>`, `<nav>`, `<main>`, etc.).
- Include ARIA attributes for accessibility (e.g., `aria-live` for dynamic content).
- Ensure valid markup that passes W3C validation.
- Optimize images with modern formats (`WebP`, `AVIF`) and `loading="lazy"`.
- Generate `srcset` and `sizes` for responsive images when relevant.
- Include SEO-friendly elements (`<title>`, `<meta name="description">`, Open Graph tags).

## JavaScript Requirements
- **Minimum Compatibility**: ECMAScript 2020 (ES11) or higher.
- **Features to Use**:
  - Arrow functions (`() => {}`).
  - Template literals (`Hello ${name}`).
  - Destructuring assignment (`const { data } = response`).
  - Spread/rest operators (`...props`).
  - Promises and async/await for asynchronous code.
  - Optional chaining (`obj?.property`).
  - Nullish coalescing (`value ?? default`).
  - Dynamic imports (`import('module')`).
  - Array methods (`map`, `filter`, `reduce`, `flatMap`).
- **Avoid**:
  - `var` keyword (use `const` or `let`).
  - jQuery or external libraries unless explicitly required.
  - Callback-based async patterns when promises are viable.
  - Legacy module formats (use ES modules with `import`/`export`).
  - `eval()` due to security risks.
- **Performance**:
  - Use code splitting and dynamic imports for lazy-loaded Vue components.
  - Optimize reactive dependencies in Vue to avoid unnecessary re-renders.
- **Error Handling**:
  - Use `try-catch` for async/await and API calls, handling promise rejections.
  - Differentiate between:
    - **Network errors** (e.g., timeouts, 429 rate-limiting).
    - **Functional errors** (e.g., invalid input, validation failures).
    - **Runtime exceptions** (e.g., null references).
  - Provide user-friendly error messages (e.g., “Unable to load data. Please try again.”).
  - Log technical details for developers (e.g., via `console.error` or a logging service).
  - Use a central error handler (e.g., Vue’s `app.config.errorHandler`).

## Documentation Requirements
- Include **JSDoc** comments for JavaScript functions and Vue composables:
  ```javascript
  /**
   * Fetches user data from API
   * @param {number} userId - The ID of the user
   * @returns {Promise<Object>} User data
   * @throws {Error} If API request fails
   * @author [Your Name]
   */
  async function fetchUser(userId) { ... }
  ```
- Document complex Vue components and composables with clear examples.
- Maintain concise Markdown documentation for project setup and usage.
- Include `param`, `return`, `throws`, and `author` in JSDoc.

## Security Considerations
- Sanitize all user inputs (e.g., use libraries like `DOMPurify` for Vue templates).
- Parameterize Sequelize queries to prevent SQL injection.
- Enforce Content Security Policies (CSP) in Vite or server configuration.
- Use CSRF protection for forms (e.g., with Vue backend middleware).
- Ensure secure cookies (`HttpOnly`, `Secure`, `SameSite=Strict`).
- Implement role-based access control for API endpoints.
- Log security events (e.g., failed logins) for monitoring.