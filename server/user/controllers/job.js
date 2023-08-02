const Scrap = require("../mongo-models/scrap");
const { Configuration, OpenAIApi } = require("openai");
const { Profile, WorkExperience, Education } = require("../models");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class JobController {
  static async fetchJobs(req, res, next) {
    try {
      const { query } = req.body;
      const jobs = await Scrap.kalibrrUrl(query);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  static async fetchJobGlints(req, res, next) {
    try {
      const { query } = req.body;
      const jobs = await Scrap.glintsUrl(query);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }
  static async fetchJobKarir(req, res, next) {
    try {
      const { query } = req.body;
      const jobs = await Scrap.karirUrl(query);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  static async generateRoles(req, res, next) {
    try {
      const dataProfile = await Profile.findOne({
        where: { UserId: req.user.id },
      });

      if (!dataProfile)
        throw {
          name: "CustomError",
          status: 404,
          message: "Profile not found",
        };

      const dataExperience = await WorkExperience.findAll({
        where: { ProfileId: dataProfile.id },
      });

      if (!dataExperience)
        throw {
          name: "CustomError",
          status: 404,
          message: "Work Experience not found",
        };

      const dataEducation = await Education.findAll({
        where: { ProfileId: dataProfile.id },
      });

      if (!dataEducation)
        throw {
          name: "CustomError",
          status: 404,
          message: "Education background not found",
        };
      if (dataEducation.length === 0 && dataExperience.length === 0 && !dataProfile.aboutMe) {
        throw {
          name: "CustomError", status: 400 ,message: "Profile Data not enough to generate Job Roles"
        }
      }
      const pastWork = dataExperience.map((el) => {
        return `my work experiences, i was working at ${el.company} from years ${el.startWork} untill ${el.stopWork}, my role was ${el.position} and i was a ${el.type} worker`;
      });
      console.log(pastWork);
      const eduBackground = dataEducation.map((el) => {
        return `my education background, i was graduate from ${el.College} from years ${el.startEducation} until ${el.graduatedEducation}, my major was ${el.Major} and my degree is ${el.educationalLevel}`;
      });
      console.log(eduBackground);
      const prompt = `Please give me 3 job position based on ${
        eduBackground.length > 0
          ? `my education ${eduBackground.toString()} and`
          : ""
      }  ${
        pastWork.length > 0
          ? `my work experiences ${pastWork.toString()} and`
          : ""
      }   ${
        pastWork.length === 0 && eduBackground.length === 0
          ? `and about me ${dataProfile.aboutMe}`
          : ""
      }. please make it in json format exactly like this:
      [
        {
          "jobRoles": "example job role"
        }
      ]
      `;
      console.log(prompt, "<<<<");
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 1000,
      });
      console.log(response)
      const completion = response.data.choices[0].text;
      console.log(completion);
      const roles = JSON.parse(completion);
      res.status(200).json({ message: "success", roles });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = JobController;
