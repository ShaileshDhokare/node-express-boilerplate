const mapLoggedInUser = (user) => {
  const { id, firstname, lastname, username, email } = user;
  return {
    id,
    name: firstname + ' ' + lastname,
    firstname,
    lastname,
    username,
    email,
  };
};

module.exports = {
  mapLoggedInUser,
};
