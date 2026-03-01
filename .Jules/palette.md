## 2024-08-01 - Asynchronous Authentication in User Flows

**Learning:** When a user action requires authentication, it's crucial to handle the login process asynchronously within the same context rather than navigating away abruptly. The previous implementation used a simple `<Link>` to the checkout page, which would have broken the flow for unauthenticated users. By replacing it with a button that triggers an async `handleProceedToCheckout` function, we can gracefully initiate a login popup, provide immediate feedback with a loading state, and only navigate upon success.

**Action:** In future tasks, whenever an action is gated by authentication, I will implement a similar async pattern. I will use a button with disabled/loading states to provide clear feedback and ensure the user's flow is not interrupted. This makes the experience smoother and more intuitive.
