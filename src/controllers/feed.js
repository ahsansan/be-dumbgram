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
      status: "success",
      message: "upload feed success",
      data: {
        dataUpload,
      },
    });
  } catch (err) {
    // Jika Error
    console.log(err);
    res.status(500).send({
      status: "failed",
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
          "fullName",
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
              exclude: ["updatedAt", "followers", "followings", "idUser"],
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
              "fullName",
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
      status: "success",
      message: "feeds",
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
        status: "failed",
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
        status: "failed",
        message: "id feed not found",
      });
    }

    // cek jika udah like atau belum
    const check = await tbLike.findOne({
      where: {
        idUser: idUser,
        idFeed: id,
      },
    });

    if (check) {
      await tbLike.destroy({ where: { idFeed: id, idUser: idUser } });
      // cek if feed
      const datas = await tbFeed.findOne({
        where: {
          id: id,
        },
      });

      // menambhkan 1 dan update like feed
      const likes = datas.like - 1;
      await tbFeed.update(
        { like: likes },
        {
          where: {
            id: id,
          },
        }
      );

      res.status(200).send({
        status: "success",
        id,
      });
    } else {
      // cek if feed
      const data = await tbFeed.findOne({
        where: {
          id: id,
        },
      });

      // tambahkan data ke like
      await tbLike.create({
        idFeed: id,
        idUser: idUser,
      });

      // menambhkan 1 dan update like feed
      const likes = (data.like += 1);
      await tbFeed.update(
        { like: likes },
        {
          where: {
            id: id,
          },
        }
      );

      res.status(200).send({
        status: "success",
        id: id,
      });
    }

    // Jika error
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
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
      status: "success",
      data: {
        comments: comments,
      },
    });

    // tampilkan ketika server eror
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
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
      idFeed: req.params.id,
    };

    await tbComment.create(dataComment);

    res.status(200).send({
      status: "success",
      message: "comment success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
