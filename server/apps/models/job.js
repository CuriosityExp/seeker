const { getDb } = require("../config/config");
const { ObjectId } = require("mongodb");

class Job {
  static jobCollection() {
    return getDb().collection("jobs");
  }

  static async findAll() {
    const jobCollection = this.jobCollection();
    return await jobCollection.find().toArray();
  }

  static async findByPk(jobId) {
    const jobCollection = this.jobCollection();
    return await jobCollection.findOne({
      _id: new ObjectId(jobId),
    });
  }

  static async create({
    url,
    logo,
    jobTitle,
    companyName,
    companyLocation,
    salary,
    workExperience,
  }) {
    try {
        const jobCollection =  this.jobCollection()
        const newJob = await jobCollection.insertOne({
          url,
          logo,
          jobTitle,
          companyName,
          companyLocation,
          salary,
          workExperience,
        });
        return await userCollection.findOne({
          _id: new ObjectId(newJob.insertedId),
        });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = Job;
