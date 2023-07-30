const { checkPassword } = require("../helpers/bcrypt");
const { SignToken } = require("../helpers/jwt");
const { User, DataPerson } = require("../models");
const axios = require('axios')

class UserController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      const newUser = await User.create({ username, email, password });

      await DataPerson.create({
        UserId: newUser.id,
      });

      res.status(201).json({ message: `Register Success` });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `Internal server error` });
    }
  }
  static async login(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!password) return res.status(400).json({ message: `password is required` });

      if (username) {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).json({ message: `Invalid User` });
        const isPassword = checkPassword(password, user.password);
        if (!isPassword) return res.status(400).json({ message: `Invalid User` });

        res.status(200).json({ access_token: SignToken({ id: user.id }) });
      } else if (email) {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: `Invalid User` });

        const isPassword = checkPassword(password, user.password);
        if (!isPassword) return res.status(400).json({ message: `Invalid User` });

        res.status(200).json({ access_token: SignToken({ id: user.id }) });
      } else {
        return res.status(400).json({ message: `username/email is required` });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `Internal server error` });
    }
  }

  
  static async loginLinkedIn(req, res) {
    try {

      const {data} = await axios ({
        method: 'GET',
        url: `https://api.linkedin.com/v2/userinfo`,
        headers: {
        accept: 'application/json',
        Authorization: `Bearer $<Key>`
        }
      })

      const [username, email] = await User.findOrCreate({
        where: {email},
        defaults: {username, email, password: "XXXXXXXXX"},
        hooks: false
      })

      console.log({email, username} + "LinkedIn login berhasil")
      res.status(created ? 201 : 200 ).json({access_token: SignToken({ id : username.id }) })
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `Internal server error` });
    }
  }

  //Authentication


  //Users
  static async allUser(req, res, next) {
    try {
      const data = await User.findAll();

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async findUser(req, res, next) {
    try {
      const data = await User.findOne({
        where: { id: req.params.id },
      });

      if (!data) throw { name: "NotFound" };

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(+id);
      if (!user) throw { name: "NotFound" };

      await User.destroy({
        where: { id },
        cascade: true,
      });

      res.status(200).json({ message: `User with id ${id} has been deleted` });
    } catch (err) {
      next(err);
    }
  }

  // Data Person
  static async getDataPerson(req, res, next) {
    try {
      const data = await DataPerson.findAll({
        include: [User],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getDataPersonById(req, res, next) {
    try {
      const data = await DataPerson.findOne({
        where: { id: req.params.id },
      });

      if (!data) throw { name: "NotFound" };

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
  static async updateDataPerson(req, res, next) {
    try {
      const { id } = req.params;
      const { fullName, aboutMe, sayName, birthDate, gender, phoneNumber, domisili } = req.body;

      const findData = await DataPerson.findByPk(+id);
      if (!findData) throw { name: "NotFound" };

      await DataPerson.update(
        {
          fullName,
          aboutMe,
          sayName,
          birthDate,
          gender,
          phoneNumber,
          domisili,
        },
        { where: { id } }
      );

      res.status(200).json({ message: `Data with ${id} has been updated` });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = UserController;
