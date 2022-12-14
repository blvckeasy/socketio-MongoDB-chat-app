import mongoose, { Schema, model } from "mongoose";
import UUID from 'node-uuid'
import bcrypt from 'bcrypt'


const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  _id: {
    type: String,
    default: UUID.v1,
  },
  
  socket_id: {
    type: String,
  },
  
  profile_img: {
    type: String,
    default: 'user.jpg'
  },

  username: {
    type: String,
    minLength: [5, "Username is too short. [5, 40]"],
    maxLength: [40, "Username is too long. [5, 40]"],
    required: true,
    index: {
      unique: true
    }
  },

  password: {
    type: String,
    minLength: [8, 'Password length is too short. [8, 35]'],
    maxLength: [30, 'password length is too long. [8, 35]'],
    required: true
  },

  registered_date: {
    type: Date,
    default: Date.now,
  }
})

function hashPassword(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          
          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
}

UserSchema.pre('save', hashPassword);
UserSchema.pre('update', hashPassword)

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

UserSchema.methods.checkPassword = async function (candidatePassword) {
  try {
    const user = this;
    const isMatch = await new Promise(function (resolve, reject) {
      bcrypt.compare(candidatePassword, user.password, function (err, isMatch) {
        if (err) return reject(err);
        resolve(isMatch);
      })
    })

    return isMatch
  } catch (error) {
    throw error;
  }
}


export default mongoose.model("Users", UserSchema)