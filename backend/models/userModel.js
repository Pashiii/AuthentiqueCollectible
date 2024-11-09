import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, default: "user" },
    address: [
      {
        name: String,
        phone: String,
        region: String,
        province: String,
        municipality: String,
        barangay: String,
        street: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    contact: String,
    firstname: String,
    lastname: String,
    birthday: Date,
    isVerified: { type: Boolean, default: false },
    verificationID: {
      type: {
        image: [
          {
            public_id: { type: String },
            url: { type: String },
          },
        ],
        verified: { type: Boolean, default: false },
      },
      default: {},
    },
    resetPasswordToken: String,
    resetPasswordExpireAt: Date,
    verificationToken: String,
    verificationTokenExpireAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = function (cadidatePasword) {
  return bcrypt.compare(cadidatePasword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
