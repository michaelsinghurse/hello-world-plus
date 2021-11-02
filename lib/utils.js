function isValidName(name) {
  if (
    typeof name !== 'string'    ||
    name.length < 2             ||
    name.length > 20            ||
    /[^a-z,A-Z]/.test(name)
  ) {
   return false;
  }

  return true;
}

function normalizeName(name) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

module.exports = {
  isValidName,
  normalizeName
};
