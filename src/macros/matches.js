module.exports = function matches(fragment, ast) {
  for (const key in fragment) {
    if (fragment.hasOwnProperty(key)) {
      const value = fragment[key]
      const astValue = ast[key]
      if (value && typeof value === "object" ? !matches(value, astValue) : value !== astValue) {
        return false
      }
    }
  }
  return true;
}
