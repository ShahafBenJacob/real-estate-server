var express = require("express");
var router = express.Router();

const api = require('../db/api/login');

router.post("/", async (req, res, next) => {
  try{
    const user = await api.login(req.body.email, req.body.password);
    //If there is a user
    if(user){
      res.cookie('auth', user, {maxAge: 1000*60*60*24});
      res.status(200).json(user);
    }else{
      res.status(200).json({error: 'Invalid email or password'});
    }
  }catch(error){
    //return error to the user
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
