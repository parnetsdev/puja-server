router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password)
      return res
        .status(400)
        .json({ error: "please enter all the required fields!" });
  
    // email validation.
    const emailReg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    if (!emailReg.test(email))
      return res
        .status(400)
        .json({ error: "please enter a valid email address." });
  
    try {
      const doesUserExits = await User.findOne({ email });
  
      if (!doesUserExits)
        return res.status(400).json({ error: "Invalid email or password!" });
  
      // if there were any user present.
      const doesPasswordMatch = await bcrypt.compare(
        password,
        doesUserExits.password
      );
  
      if (!doesPasswordMatch)
        return res.status(400).json({ error: "Invalid email or password!" });
  
      const payload = { _id: doesUserExits._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      const user = { ...doesUserExits._doc, password: undefined };
      return res.status(200).json({ token, user });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
  });