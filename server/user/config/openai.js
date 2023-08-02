const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

module.exports = openai