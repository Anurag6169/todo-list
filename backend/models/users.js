const mongoose = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");

const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please enter task name!"],
    },
    is_completed:{
        type:Boolean,
        require:[true,"Please set status!"],
        default:false
    },
    is_deleted:{
      type:Boolean,
      default:false
    }
});

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Please enter a first name"],
      },
      last_name: {
        type: String,
        required: [true, "Please enter a last name"],
      },
      email: {
        type: String,
        unique: true,
        required: [true, "Please enter an email"],
        validate: [isEmail, "Please provide a valid email address"],
        lowercase: true,
      },
      password: {
        type: String,
        validate: [isStrongPassword, "Please provide a valid password"],
        minlength: 8,
      },
      tasks:{
        type:[taskSchema],
        default:[]
      }
});

// static method to login instructor
userSchema.statics.login = async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
      const passwordMatched = await bcrypt.compare(password, user.password);
      if (passwordMatched) {
        return user;
      }
      throw Error("Incorrect Password");
    }
    throw Error("This email address does not exist");
};

userSchema.statics.hashPassword = async (password) => {
  if (password != undefined) {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return password;
  }
};  
  

const User = mongoose.model("user", userSchema);

module.exports = User;