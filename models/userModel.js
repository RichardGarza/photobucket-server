module.exports = {
  init(mongoose) {
    // Define Schema.
    const userSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      passwordHash: String,
      passwordSalt: String,
    });

    // Define Model Using Schema
    const User = mongoose.model('User', userSchema);

    // Return Model
    return User;
  },
};
