const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class Generator {
  static async generateTodo(profile) {
    try {
      if (!profile) {
        throw new Error("Uh oh, no profile was provided");
      }
      const prompt = `
  from this job vacancy detail create to do list in JSON stringify format . Here is the data:
  ${profile}
  `;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 1000,
      });
      const completion = response.data.choices[0].text;
      const todos = JSON.parse(completion);
      return todos;
    } catch (error) {
      next(error);
    }
  }

  static async generateParams(profile) {
    try {
      if (!profile) {
        throw new Error("Uh oh, no profile was provided");
      }
    } catch (error) {}
  }
}

module.exports = Generator;
