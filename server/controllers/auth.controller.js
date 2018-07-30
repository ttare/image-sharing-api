
function login(req, res) {
  const accessToken = req.user.genereteAccessToken();
  return res.json({accessToken});
}

export default {
  login
}
