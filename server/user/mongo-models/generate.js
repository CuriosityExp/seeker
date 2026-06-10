const openai = require("../config/openai");

class Generator {
  static async generateJobRecommend(profile) {
    try {
      const prompt = `Berikan rekomendasi pekerjaan untuk saya. Batasi 3 rekomendasi pekerjaan saja
      dan buat dalam format JSON. Berikut data diri saya:
      ${profile}`;
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 1000,
      });
      return response.choices[0].text;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = Generator;
