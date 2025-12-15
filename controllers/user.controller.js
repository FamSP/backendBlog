const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const UserModel = require("../models/User");
require("dotenv").config();
const secret = process.env.SECRET;
console.log(secret);

// สร้าง salt 10 รอบ

exports.register = async (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบช่องว่าง
  if (!username || !password) {
    return res.status(400).send({ message: "กรุณากรอกให้ครบจ้า" });
  }

  try {
    // เช็คชื่อซ้ำ
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: "Username is already used" });
    }
    const salt = bcrypt.genSaltSync(10);
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = bcrypt.hashSync(password, salt);

    // บันทึกลง DB
    await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.send({
      message: "User Register Success",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  //1 check username & password
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "กรุณากรอกให้ครบจ้า" });
  }

  //2 username is existed
  try {
    const userDoc = await UserModel.findOne({ username: username });
    if (!userDoc) {
      return res.status(400).send({ message: "ไม่มี user นี้ในระบบ" });
    }
    //3  compare password
    const isPasswordMatch = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ message: "รหัสผ่านไม่ถูกต้อง" });
    }
    //4 generate token
    jwt.sign({ username, id: userDoc.id }, secret, {}, (err, token) => {
      if (err) {
        res
          .status(500)
          .sent({ message: "internal Server Error: Authentication failed!" });
      }
      res.sent({ message: "Login Succesfullt", token: token });
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
