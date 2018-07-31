
function login(req, res) {
  const accessToken = req.user.genereteAccessToken();
  const user = req.user.toJSON();
  return res.json({accessToken, user});
}

export default {
  login
}

