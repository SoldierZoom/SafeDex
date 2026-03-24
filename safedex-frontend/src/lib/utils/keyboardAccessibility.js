// keyboardAccessibility.js
// Centralized logic for keyboard accessibility (focus management, keyboard shortcuts, ARIA helpers)

export function trapFocus(element) {
  const focusable = element.querySelectorAll(
    "a[href], button, textarea, input, select, [tabindex]:not([tabindex=\"-1\"])"
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleTab(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  element.addEventListener("keydown", handleTab);
  return () => element.removeEventListener("keydown", handleTab);
}

export function handleGlobalShortcuts(e, actions) {
  if (e.altKey && e.key === "a") {
    actions.openPanel && actions.openPanel();
  }
  if (e.key === "Escape") {
    actions.closePanel && actions.closePanel();
  }
}

export function setAriaAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute("aria-" + key, value);
  });
}
