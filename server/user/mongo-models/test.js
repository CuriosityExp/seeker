
class Test{
  static async getUsers(){
    try {
      return ["udin"]
    } catch (error) {
      throw error
    }
  }
}

module.exports = Test