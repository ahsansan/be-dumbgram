// Model tabel message
const { tbMessage, tbUser } = require("../../models");

// Mencari parameter yang sesuai
const { Op } = require("sequelize");

exports.addChat = async (req, res) => {
  try {
    const id = req.params.id;
    const idUser = req.user.id;

    const message = req.body.message;

    // Pengecekan user penerima
    const check = await tbUser.findOne({
      where: {
        id: id,
      },
    });

    if (!check) {
      return res.status(400).send({
        status: "failed",
        message: "receiver id not found",
      });
    }

    // Pensan disimpan di database
    const data = await tbMessage.create({
      idReceiver: id,
      idSender: idUser,
      message: message,
    });

    const messageSender = await tbMessage.findOne({
      where: {
        id: data.id,
      },
      include: {
        model: tbUser,
        as: "receiver",
        attributes: {
          exclude: ["createdAt", "updatedAt", "bio", "email", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idReceiver", "idSender"],
      },
    });

    // Menampikan ketika data berhasil di tambahkan
    res.status(200).send({
      status: "success",
      data: {
        messageSender,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const idUser = req.user.id;

    const check = await tbUser.findOne({
      where: {
        id: id,
      },
    });

    if (!check) {
      return res.status(400).send({
        status: "failed",
      });
    }

    // Memanggil parameter untuk di tampilkan semua pesan
    const messages = await tbMessage.findAll({
      where: {
        [Op.or]: [
          {
            idSender: id,
            idReceiver: idUser,
          },
          {
            idSender: idUser,
            idReceiver: id,
          },
        ],
      },
      include: {
        model: tbUser,
        as: "sender",
        attributes: {
          exclude: ["createdAt", "updatedAt", "bio", "email", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idSender", "idReceiver"],
      },
    });

    // Jika berhasil
    res.status(200).send({
      status: "success",
      data: {
        message: messages,
      },
    });

    // Jika error server
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
