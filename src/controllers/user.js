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
      status: "Gagal cek user",
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
        status: "Gagal Mengubah Profile",
        message: `Tidak ada user dengan id: ${id}`,
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
      status: "Berhasil Mengubah Profile",
      data: {
        user: dataUpdate,
      },
    });

    // error server
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "Gagal Mengubah Profile",
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
        status: "Gagal menghapus data",
        message: "ID tidak ditemukan",
      });
    }

    // Berhasil Menghapus
    res.status(200).send({
      status: `Berhasil Menghapus id ${id}`,

      data: {
        id,
      },
    });

    // Jika error
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "Gagal menghapus",
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
        status: "Gagal",
        message: "id tidak ditemukan",
      });
    }

    // Tampilkan Followers
    res.status(200).send({
      status: "Berhasil",
      data: {
        id_user,
      },
    });

    // Jika Server error
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "Gagal",
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
        status: "Gagal",
        message: "id tidak ditemukan",
      });
    }

    // Tampilkan Followings
    res.status(200).send({
      status: "Berhasil",
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
