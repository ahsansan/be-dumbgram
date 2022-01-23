// memanggil model tabel database
const { tbUser, tbFeed, tbFollow, tbLike, tbComment } = require("../../models");

// joi
const joi = require("joi");

exports.addFeed = async (req, res) => {
  try {
    const data = req.body;

    const dataUpload = {
      ...data,
      fileName: req.file.filename,
      idUser: req.user.id,
    };

    await tbFeed.create(dataUpload);

    // Jika berhasil
    res.status(200).send({
      status: "Sukses",
      message: "Berhasil mengupload data feed",
      data: {
        dataUpload,
      },
    });
  } catch (err) {
    // Jika Error
    console.log(err);
    res.status(500).send({
      status: "Gagal",
      message: "Server error",
    });
  }
};

exports.followingFeeds = async (req, res) => {
  try {
    // menemukan id
    const id = req.params.id;

    // menampilkan data
    const userData = await tbUser.findOne({
      // mengecualikan jika tidak ingin di tampilkan
      where: {
        id: id,
      },
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "bio",
          "image",
          "name",
          "username",
          "email",
        ],
      },
      include: {
        model: tbFollow,
        as: "followings",
        include: {
          model: tbUser,
          as: "followings",
          include: {
            model: tbFeed,
            as: "feed",
            include: {
              model: tbUser,
              as: "user",
              attributes: {
                exclude: ["updatedAt", "bio", "password", "email"],
              },
            },
            order: [["createdAt", "DESC"]],
            attributes: {
              exclude: ["updatedAt", "followers", "followings"],
            },
          },
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: [
              "password",
              "createdAt",
              "updatedAt",
              "bio",
              "image",
              "name",
              "username",
              "email",
            ],
          },
        },
        attributes: {
          exclude: ["updatedAt", "createdAt", "idFollowers", "idFollowings"],
        },
      },
    });

    // tampikan ketika berhasil
    res.send({
      status: "success",
      data: {
        userData,
      },
    });

    // tampilkan ketika server eror
  } catch (err) {
    console.log(err);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.feeds = async (req, res) => {
  try {
    // Menampilkan semua data
    let allfeed = await tbFeed.findAll({
      include: {
        model: tbUser,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "bio", "password", "email"],
        },
      },
      order: [["id", "DESC"]],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const parseJSON = JSON.parse(JSON.stringify(allfeed));

    allfeed = parseJSON.map((item) => {
      return {
        ...item,
        fileName: process.env.UPLOAD_PATH + item.fileName,
      };
    });

    // Jika berhasil
    res.status(200).send({
      status: "Berhasil",
      message: "Semua data feed didapatkan",
      data: {
        feeds: allfeed,
      },
    });

    // Jika error
  } catch (err) {
    console.log(err);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.likeFeed = async (req, res) => {
  try {
    const idUser = req.user.id;
    const id = req.body.id;

    // cek inputan
    const schema = joi
      .object({
        id: joi.number().required(),
      })
      .validate(req.body);

    // jika tidak memebuhi
    if (schema.error) {
      return res.status(400).send({
        status: "Gagal like",
        message: schema.error.details[0].message,
      });
    }

    // mengecek apakah id ada di feed
    const checkId = await tbFeed.findOne({
      where: {
        id: id,
      },
    });

    // mencari emaail ada atau tidak
    if (!checkId) {
      return res.status(400).send({
        status: "Gagal like",
        message: "id feed tidak ditemukan",
      });
    }

    // Tambahkan data ke like
    await tbLike.create({
      idFeed: id,
      idUser: idUser,
    });

    res.status(200).send({
      status: "Berhasil",
      id: id,
    });

    // Jika error
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "Gagal",
      message: "Server Error",
    });
  }
};

exports.commentsFeed = async (req, res) => {
  try {
    const id = req.params.id;

    const comments = await tbComment.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "idFeed", "idUser"],
      },
      include: {
        model: tbUser,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "bio", "password", "email"],
        },
      },
      where: {
        idFeed: id,
      },
      order: [["id", "DESC"]],
    });

    // tampikan ketika berhasil
    res.status(200).send({
      status: "Berhasil menampilkan komen",
      data: {
        comments: comments,
      },
    });

    // tampilkan ketika server eror
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "Gagal",
      message: "Server Error",
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const comment = req.body;

    const dataComment = {
      ...comment,
      idUser: req.user.id,
    };

    await tbComment.create(dataComment);

    res.status(200).send({
      status: "Berhasil",
      message: "Kamu berhasil menambahkan komen",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "Gagal",
      message: "Server Error",
    });
  }
};
