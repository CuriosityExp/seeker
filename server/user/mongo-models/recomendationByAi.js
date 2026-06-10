const openai = require("../config/openai");

class Search {
  static async RecomendationJobAi(profile) {
    try {
      if (!profile) {
        throw new Error("Input your profile");
      }
      const prompt = `
      show list title job, show only 3 in JSON stringify format. Here is the data:
  ${profile}
  `;
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 1000,
      });
      const completion = response.choices[0].text;
      const jobsByAi = JSON.parse(completion);
      return jobsByAi;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Search;
