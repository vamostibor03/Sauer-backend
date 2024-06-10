import mongoose, { Document, Schema } from "mongoose"
import bcrypt from "bcrypt"

export interface IUser extends Document {
  username: string
  password: string
  googleId: string
  comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: false, unique: true },
  password: { type: String, required: false },
  googleId: { type: String },
})

userSchema.pre("save", async function (next) {
  const user = this as IUser

  if (!user.isModified("password")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    next()
  } catch (err) {
    next(err as Error)
  }
})

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model<IUser>("User", userSchema)
export default User
