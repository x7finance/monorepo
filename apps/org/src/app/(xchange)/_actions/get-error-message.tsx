export const getErrorMessage = (error: Error & { code?: number }): string => {
  // User rejection errors
  if (
    error.message.includes("User rejected the request.") ||
    error.code === 4001
  ) {
    return "You rejected the transaction request."
  }

  // Insufficient funds
  if (error.message.includes("insufficient funds")) {
    return "Insufficient funds for the transaction."
  }

  // Transaction signature denied
  if (error.message.includes("user denied transaction signature")) {
    return "You denied the transaction signature."
  }

  // Transaction underpriced
  if (
    error.message.includes("transaction underpriced") ||
    error.message.includes("-32002")
  ) {
    return "The transaction gas price is too low."
  }

  // Unsupported method
  if (error.code === 4200) {
    return "The requested method is not supported."
  }

  // Unauthorized access
  if (error.code === 4100) {
    return "Unauthorized operation."
  }

  // Disconnected
  if (error.code === 4900) {
    return "MetaMask is disconnected."
  }

  // Chain not added
  if (error.code === 4901) {
    return "The requested chain has not been added to your wallet."
  }

  // Generic internal errors
  if (error.code === -32603) {
    return "An internal error occurred in your wallet."
  }

  // Default error message for unhandled cases
  return "An error occurred. Please try again."
}
