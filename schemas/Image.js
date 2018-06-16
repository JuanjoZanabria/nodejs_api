var imageSchema = mongoose.Schema({
  name: {
    firstName: String,
    lastName: String,
    fullName: String
  },
  email: String,
  picture: String,
  created: Date
});
