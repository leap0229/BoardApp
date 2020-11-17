class DuplicateUserError extends Error {
  constructor(message = 'Duplicate entry') {
    super(message);
    this.name = "DuplicateUserError";
  }
}

module.exports = {
    DuplicateUserError
};