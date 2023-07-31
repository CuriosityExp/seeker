const Job = require("../models/job");
const Scrap = require("../models/scrapping");

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

  static async fetchJobDetail(req,res,next){
    try {
        const {jobUrl} = req.body;
        const jobDetail = await Scrap.kalibrrDetail(jobUrl)
        res.status(200).json(jobDetail)
    } catch (error) {
        next(error)
    }
  }
}

module.exports = JobController;
