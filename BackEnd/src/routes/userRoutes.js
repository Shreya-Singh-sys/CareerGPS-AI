router.get('/profile/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).send("User not found");
  
  // Frontend check karega: user.source === 'resume' ? 'Show Resume UI' : 'Show Form UI'
  res.json(user);
});