const Job = require("../mongo-models/job");
const Scrap = require("../mongo-models/scrap");

class JobController {
  static async fetchJobs(req, res, next) {
    try {
      const { query } = req.body;
      const jobs = await Scrap.kalibrrUrl(query)
      res.status(200).json(jobs)
    } catch (error) {
      next(error);
    }
  }

  static async fetchJobGlints(req,res,next){
    try {
      const {query} = req.body
      const jobs = await Scrap.glintsUrl(query)
      res.status(200).json(jobs)
    } catch (error) {
      next (error)
    }
  }
  static async fetchJobKarir(req,res,next){
    try {
      const {query} = req.body
      const jobs = await Scrap.karirUrl(query)
      res.status(200).json(jobs)
    } catch (error) {
      next (error)
    }
  }
}

module.exports = JobController;
