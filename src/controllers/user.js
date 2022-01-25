// Memanggil models
const { tbUser, tbFollow } = require("../../models");
// Auth

exports.getUsers = async (req, res) => {
  try {
    // Mencari semua users
    const users = await tbUser.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    // Tampilan ketika berhasil
    res.status(200).send({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.editUser = async (req, res) => {
  try {
    const id = req.params.id;

    // data body
    const data = req.body;

    // cek id
    const checkId = await tbUser.findOne({
      where: {
        id: id,
      },
    });

    // Jika id tidak ada
    if (!checkId) {
      return res.status(400).send({
        status: "failed",
        message: `Id: ${id} not found`,
      });
    }

    const dataUpload = {
      ...data,
      image: req.file.filename,
    };

    // Proses update
    await tbUser.update(dataUpload, {
      where: {
        id: id,
      },
    });

    // Data setelah di update
    let dataUpdate = await tbUser.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      where: {
        id: id,
      },
    });

    dataUpdate = JSON.parse(JSON.stringify(dataUpdate));

    // Mengedit image link
    dataUpdate = {
      ...dataUpdate,
      image: process.env.UPLOAD_PATH + dataUpdate.image,
    };

    // Berhasil update
    res.status(200).send({
      status: "success",
      data: {
        user: dataUpdate,
      },
    });

    // error server
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Mengambil id dari params
    const id = req.params.id;

    // Menghapus data berdasarkan id
    const deleteData = await tbUser.destroy({
      where: {
        id: id,
      },
    });

    // Jika id tidak ada
    if (!deleteData) {
      return res.status(400).send({
        status: "failed",
        message: "ID not found",
      });
    }

    // Berhasil Menghapus
    res.status(200).send({
      status: `Id ${id} deleted`,

      data: {
        id,
      },
    });

    // Jika error
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.followers = async (req, res) => {
  try {
    const id = req.params.id;

    const id_user = await tbUser.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "password",
          "bio",
          "image",
          "username",
          "email",
          "fullName",
        ],
      },
      include: {
        model: tbFollow,
        as: "followers",
        include: {
          model: tbUser,
          as: "followers",
          attributes: {
            exclude: ["createdAt", "updatedAt", "bio", "password", "email"],
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "idFollowers", "idFollowings"],
        },
      },
    });

    if (!id_user) {
      return res.status(400).send({
        status: "failed",
        message: "user not found",
      });
    }

    // Tampilkan Followers
    res.status(200).send({
      status: "success",
      data: {
        id_user,
      },
    });

    // Jika Server error
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.followings = async (req, res) => {
  try {
    const id = req.params.id;

    const id_user = await tbUser.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "password",
          "bio",
          "image",
          "username",
          "email",
          "fullName",
        ],
      },
      include: {
        model: tbFollow,
        as: "followings",
        include: {
          model: tbUser,
          as: "followings",
          attributes: {
            exclude: ["createdAt", "updatedAt", "bio", "password", "email"],
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "idFollowers", "idFollowings"],
        },
      },
    });

    if (!id_user) {
      return res.status(400).send({
        status: "failed",
        message: "user not found",
      });
    }

    // Tampilkan Followings
    res.status(200).send({
      status: "success",
      data: {
        id_user,
      },
    });

    // Jika Server error
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
