// Memanggil models
const { tbUser } = require("../../models");
// Joi
const joi = require("joi");
// Bcrypt
const bcrypt = require("bcrypt");
// Token
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const data = req.body;

    // Validasi input
    const schema = joi.object({
      fullName: joi.string().min(4).required(),
      email: joi.string().email().required(),
      username: joi.string().min(4).required(),
      password: joi.string().min(6).required(),
    });

    // Deklarasi validasi
    const { error } = schema.validate(data);

    // Jika data tidak valid
    if (error) {
      return res.status(400).send({
        status: "Isilah data dengan sesuai",
        error: error.details[0].message,
      });
    }

    // Menanggulangi duplikasi
    const checkEmail = await tbUser.findOne({
      where: {
        email: data.email,
      },
    });

    // Jika email telah didaftarkan
    if (checkEmail) {
      return res.status(400).send({
        status: "Pendaftaran gagal",
        message: "Email sudah pernah didaftarkan",
      });
    }

    // Sembunyikan password
    const hashStrenght = 10;
    const hashhedPassword = await bcrypt.hash(data.password, hashStrenght);

    // Jika tidak ada error
    const dataUser = await tbUser.create({
      ...data,
      password: hashhedPassword,
    });

    // Generate token
    const tokenData = {
      id: dataUser.id,
      fullName: dataUser.fullName,
      email: dataUser.email,
      password: dataUser.password,
    };
    const secretKey = process.env.SECRET_KEY;

    const token = jwt.sign(tokenData, secretKey);

    // Jika semuanya berhasil
    res.status(200).send({
      status: "Pendaftaran berhasil",
      data: {
        user: {
          fullName: dataUser.fullName,
          username: dataUser.username,
          email: dataUser.email,
          token,
        },
      },
    });
  } catch (err) {
    //  Jika error
    console.log(err);
    res.status(500).send({
      status: "Pendaftaran gagal",
      message: "server error",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const data = req.body;

    // Validasi input
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    });

    // Deklarasi validasi
    const { error } = schema.validate(data);

    // Jika data tidak valid
    if (error) {
      return res.status(400).send({
        status: "Isilah data dengan sesuai",
        error: error.details[0].message,
      });
    }

    // Cek Email
    const dataOnTable = await tbUser.findOne({
      where: {
        email: data.email,
      },
    });

    // Jika belum didaftarkan
    if (!dataOnTable) {
      return res.status(400).send({
        status: "Login gagal",
        message: "Email dan password tidak cocok",
      });
    }

    // Cek Password
    const validatePassword = await bcrypt.compare(
      data.password,
      dataOnTable.password
    );

    // Password Salah
    if (!validatePassword) {
      return res.status(400).send({
        status: "Login gagal",
        message: "Email dan password tidak cocok",
      });
    }

    // Generate token
    const tokenData = {
      id: dataOnTable.id,
      fullName: dataOnTable.fullName,
      email: dataOnTable.email,
      password: dataOnTable.password,
    };

    const secretKey = process.env.SECRET_KEY;

    const token = jwt.sign(tokenData, secretKey);

    // Jika semuanya berhasil
    res.status(200).send({
      status: "Login berhasil",
      data: {
        user: {
          fullName: dataOnTable.fullName,
          username: dataOnTable.username,
          email: dataOnTable.email,
          token,
        },
      },
    });
  } catch (err) {
    //  Jika error
    console.log(err);
    res.status(500).send({
      status: "Login gagal",
      message: "server error",
    });
  }
};
