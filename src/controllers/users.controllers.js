const express = require("express");
const router = express.Router();
const User = require("../models/users.model");
const crypto = require("crypto");

const accountSid = "ACc6743498ecc5594abd932f7ae6680d88";
const authToken = "d4b9674f3177fe4061cff881718270b6";
const smsKey = "123456";
let twilioNum = "+19854124683";
const client = require("twilio")(accountSid, authToken);

router.get("/users", async (req, res) => {
  try {
    const user = await User.find().lean().exec();
    return res.send(user);
  } catch (err) {
    res.sendStatus(400);
  }
});
router.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.sendStatus(200);
  } catch (err) {
    if (err.keyPattern.email > 0) {
      res.sendStatus(300);
    } else if (err.keyPattern.phone > 0) {
      res.sendStatus(400);
    }
  }
});
router.get("/userData", async (req, res) => {
  try {
    let qurey = req.query.email;

    const user = await User.findOne({ email: qurey }).lean().exec();

    if (!user) {
      return res.sendStatus(400);
    }
    return res.send(user);
  } catch (err) {
    return res.sendStatus(400);
  }
});
router.get("/sendOTP", (req, res) => {
 
  const  phone  = "+91"+req.query.number;
  console.log(phone)
  const otp = Math.floor(100000 + Math.random() * 900000); // generate OTP

  const ttl = 2 * 60 * 1000; // OTP expire time

  let expires = Date.now();

  expires += ttl;

  const data = `${phone}.${otp}.${expires}`;

  const hash = crypto.createHmac("sha256", smsKey).update(data).digest("hex");

  const fullHash = `${hash}.${expires}`;

  client.messages

    .create({
      body: `Your Otp Is  ${otp}`,

      from: twilioNum,

      to: phone,
    })

    .then((messages) => {
      res.status(200).json({ status:true,phone, hash: fullHash, otp });
    })

    .catch((err) => {
      console.error("phone : ", err.message);

      return res.json({ error: err.message });
    });
});
module.exports = router;
