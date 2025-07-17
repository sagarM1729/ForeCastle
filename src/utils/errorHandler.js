// Global error handler for wallet connection issues
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return;

  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Override console.error to suppress known wallet connection errors
  console.error = (...args) => {
    const message = args.join(' ').toLowerCase();
    
    // Suppress known wallet connection errors that don't affect functionality
    if (
      message.includes('connection interrupted') ||
      message.includes('walletconnect') ||
      message.includes('websocket connection failed') ||
      message.includes('jsonrpc') ||
      message.includes('wc@2:') ||
      message.includes('subscription error') ||
      message.includes('subscription') ||
      message.includes('trying to subscribe') ||
      message.includes('eventemitter.c') ||
      message.includes('onclose') ||
      message.includes('ws-connection')
    ) {
      // Completely suppress these messages
      return;
    }
    
    // Log all other errors normally
    originalConsoleError(...args);
  };

  // Handle unhandled promise rejections - most aggressive suppression
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message?.toLowerCase() || '';
    const stack = event.reason?.stack?.toLowerCase() || '';
    
    if (
      message.includes('connection interrupted') ||
      message.includes('walletconnect') ||
      message.includes('websocket') ||
      message.includes('subscription') ||
      message.includes('jsonrpc') ||
      stack.includes('walletconnect') ||
      stack.includes('jsonrpc') ||
      stack.includes('ws-connection')
    ) {
      // Prevent the error from showing anywhere
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  });

  // Handle window errors - most aggressive suppression
  window.addEventListener('error', (event) => {
    const message = event.message?.toLowerCase() || '';
    const filename = event.filename?.toLowerCase() || '';
    const stack = event.error?.stack?.toLowerCase() || '';
    
    if (
      message.includes('connection interrupted') ||
      message.includes('walletconnect') ||
      message.includes('websocket') ||
      message.includes('subscription') ||
      message.includes('jsonrpc') ||
      filename.includes('walletconnect') ||
      filename.includes('jsonrpc') ||
      stack.includes('walletconnect') ||
      stack.includes('jsonrpc') ||
      stack.includes('ws-connection')
    ) {
      // Prevent the error from propagating
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  });

  // Override global error handling for React error boundaries
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    const msg = (message || '').toString().toLowerCase();
    const src = (source || '').toString().toLowerCase();
    const stack = (error?.stack || '').toString().toLowerCase();
    
    if (
      msg.includes('connection interrupted') ||
      msg.includes('walletconnect') ||
      msg.includes('websocket') ||
      msg.includes('subscription') ||
      msg.includes('jsonrpc') ||
      src.includes('walletconnect') ||
      src.includes('jsonrpc') ||
      stack.includes('walletconnect') ||
      stack.includes('jsonrpc')
    ) {
      return true; // Prevent default error handling
    }
    
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };
}

// Specific handler for WalletConnect errors
export function handleWalletConnectError(error) {
  // Just silently handle the error without any output
  return {
    handled: true,
    message: null, // No message to avoid any UI disruption
    shouldRetry: false
  };
}
