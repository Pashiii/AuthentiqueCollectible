import express from "express";
import User from "../models/userModel.js";
import generateToken from "../middleware/generateToken.js";
import verifyToken from "../middleware/verifyToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { sendEmail } from "../middleware/email.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstname, lastname, birthday } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).send({ message: "User already exist" });
    }

    const user = new User({
      email,
      password,
      firstname,
      lastname,
      birthday,
      verificationTokenExpireAt: Date.now() + 5 * 60 * 1000,
    });

    const JWT_SECRET = process.env.JWT_SECRET_KEY;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const secret = JWT_SECRET + hashedPassword;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/api/auth/verify/${user._id}/${token}`;
    user.verificationToken = token;
    console.log(link);

    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Verify Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
          <img src="images/logo.png" style="display: block; margin: 0 auto;"/>
          <h2 style="color: #333;">Welcome to Authentique Collectible!</h2>
          <p style="color: #555;">Thank you for registering with us. Please verify your email address to activate your account.</p>
          <p style="color: #555;">Click the button below to verify your account:</p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Your Account</a>
          <p style="color: #555;">If you did not create an account, no further action is required.</p>
          <p style="color: #555;">If the button does not work, copy and paste the following link into your browser:</p>
          <p style="color: #007BFF; word-break: break-all;">${link}</p>
          <p style="color: #999;">Thank you,<br>The Authentique Collectible</p>
        </div>
      `,
    });

    res.status(201).send({ message: "User registered successful" });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).send({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Incorrect Email and Password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Password not match" });
    }
    if (!user.isVerified) {
      const currentTime = Date.now();
      if (user.verificationTokenExpireAt < currentTime) {
        const JWT_SECRET = process.env.JWT_SECRET_KEY;
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const secret = JWT_SECRET + hashedPassword;
        const token = jwt.sign({ email: user.email, id: user._id }, secret, {
          expiresIn: "5m",
        });
        const link = `http://localhost:5000/api/auth/verify/${user._id}/${token}`;
        user.verificationToken = token;
        user.verificationTokenExpireAt = Date.now() + 5 * 60 * 1000;
        await user.save();
        await sendEmail({
          email: user.email,
          subject: "Verify Your Account",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
              <img src="images/logo.png" style="display: block; margin: 0 auto;"/>
              <h2 style="color: #333;">Welcome to Authentique Collectible!</h2>
              <p style="color: #555;">Thank you for registering with us. Please verify your email address to activate your account.</p>
              <p style="color: #555;">Click the button below to verify your account:</p>
              <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Your Account</a>
              <p style="color: #555;">If you did not create an account, no further action is required.</p>
              <p style="color: #555;">If the button does not work, copy and paste the following link into your browser:</p>
              <p style="color: #007BFF; word-break: break-all;">${link}</p>
              <p style="color: #999;">Thank you,<br>The Authentique Collectible</p>
            </div>
          `,
        });
      }
      return res.status(404).send({
        message:
          "We have sent an email, please click the link included to verify your email address.",
      });
    }
    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).send({
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error logged in user", error);
    res.status(500).send({ message: "Error logged in user" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out successfully" });
});

//user delete
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user", error);
    res.status(500).send({ message: "Error deleting user" });
  }
});

//get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (error) {
    console.log("Error fetching user", error);
    res.status(500).send({ message: "Error fetching user" });
  }
});

//get single user
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("Error fetching single user", error);
    res.status(500).send({ message: "Error fetching single user " });
  }
});

//update user role
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User role updated successfully", user });
  } catch (error) {
    console.log("Error updating user role", error);
    res.status(500).send({ message: "Error updating user role" });
  }
});

//edit for user
router.patch("/edit-profile", async (req, res) => {
  try {
    const { userId, firstname, lastname, contact, birthday } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    if (firstname !== undefined) user.firstname = firstname;
    if (lastname !== undefined) user.lastname = lastname;
    if (birthday !== undefined) user.birthday = birthday;
    if (contact !== undefined) user.contact = contact;

    await user.save();
    res.status(200).send({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday,
        contact: user.contact,
      },
    });
  } catch (error) {}
});

//add address
router.post("/user/:id/add-address", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      region,
      province,
      municipality,
      barangay,
      street,
      isDefault,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      console.log("Error");
      return res.status(404).send({ message: "User not found" });
    }

    const newAddress = {
      name,
      phone,
      region,
      province,
      municipality,
      barangay,
      street,
      isDefault: isDefault || false,
    };

    if (isDefault) {
      user.address.forEach((addr) => (addr.isDefault = false));
    }

    user.address.push(newAddress);
    await user.save();

    res.status(200).send({ message: "Address added successfully", user });
  } catch (error) {
    console.log("Error adding address", error);
    res.status(500).send({ message: "Error adding address" });
  }
});

//update the address
router.put("/users/:id/address/:addressId", async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const {
      name,
      phone,
      region,
      province,
      municipality,
      barangay,
      postal,
      street,
      isDefault,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const address = user.address.id(addressId);
    if (!address) {
      return res.status(404).send({ message: "Address not found" });
    }
    if (name !== undefined) address.name = name;
    if (phone !== undefined) address.phone = phone;
    if (region !== undefined) address.region = region;
    if (province !== undefined) address.province = province;
    if (municipality !== undefined) address.municipality = municipality;
    if (barangay !== undefined) address.barangay = barangay;
    if (postal !== undefined) address.postal = postal;
    if (street !== undefined) address.street = street;
    if (isDefault !== undefined) {
      user.address.forEach((addr) => (addr.isDefault = false));
      address.isDefault = isDefault;
    }

    await user.save();

    res.status(200).send({ message: "Address updated successfully", user });
  } catch (error) {
    console.log("Error updating address", error);
    res.status(500).send({ message: "Error updating address" });
  }
});

//delete address
router.delete("/users/:id/address/:addressId", async (req, res) => {
  try {
    const { id, addressId } = req.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Find the address in the user's addresses array
    const addressIndex = user.address.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    // Check if address exists
    if (addressIndex === -1) {
      return res.status(404).send({ message: "Address not found" });
    }

    // Remove the address from the user's address array
    user.address.splice(addressIndex, 1);

    // Save the updated user document
    await user.save();

    // Send success response
    res.status(200).send({ message: "Address removed successfully", user });
  } catch (error) {
    console.log("Error removing address", error);
    res.status(500).send({ message: "Error removing address" });
  }
});

//email to forget password
router.post("/forget-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }
    console.log(user.resetPasswordToken);
    if (
      user.resetPasswordExpireAt < Date.now() ||
      user.resetPasswordExpireAt == null
    ) {
      const token = await generateToken(user._id);

      user.resetPasswordToken = token;
      user.resetPasswordExpireAt = Date.now() + 1 * 60 * 60 * 1000;

      await user.save();
      const link = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`;
      res.status(200).send({ message: "Email sent", link });
      console.log(link);

      await sendEmail({
        email: user.email,
        subject: "Reset Your Password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
              <img src="images/logo.png" style="display: block; margin: 0 auto;"/>
              <h2 style="color: #333;">Reset Your Password</h2>
              <p style="color: #555;">We received a request to reset your password. Click the button below to reset it:</p>
              <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p style="color: #555;">If you did not request a password reset, no further action is required.</p>
              <p style="color: #555;">If the button does not work, copy and paste the following link into your browser:</p>
              <p style="color: #007BFF; word-break: break-all;">${link}</p>
              <p style="color: #999;">Thank you,<br>The Authentique Collectible</p>
            </div>
          `,
      });
    } else {
      return res.status(404).send({ message: "Failed token" });
    }
  } catch (error) {
    console.log("Error forget password", error);
    res.status(500).send({ message: "Error to forget password" });
  }
});

//user change password
router.patch("/change-password/:id", async (req, res) => {
  const { id } = req.params;
  const { password, newPassword } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Current Password Not Match" });
    }
    if (newPassword !== undefined) user.password = newPassword;
    await user.save();
    res.status(200).send({ message: "Successful Change Password" });
  } catch (error) {
    console.log("Error user change password", error);
    res.status(500).send({ message: "Failed Change Password" });
  }
});

//for reset password
router.put("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      _id: id,
      resetPasswordToken: token,
      resetPasswordExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;

    await user.save();
    res.status(200).send({ message: "Password has been reset successfully" });
    await sendEmail({
      email: user.email,
      subject: "Your Password Has Been Changed Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
          <img src="images/logo.png" alt="Company Logo" style="display: block; margin: 0 auto;"/>
          <h2 style="color: #333;">Password Changed Successfully</h2>
          <p style="color: #555;">Hello,</p>
          <p style="color: #555;">We wanted to let you know that your password has been changed successfully. If you did not make this change, please contact our support team immediately.</p>
          <p style="color: #555;">Thank you for using our service!</p>
          <p style="color: #999;">Best Regards,<br>The Authentique Collectible</p>
          <p style="font-size: 12px; color: #999;">If you have any questions, feel free to reply to this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.log("Error updating user password", error);
    res.status(500).send({ message: "Error updating user password" });
  }
});

//For verifying account
router.get("/verify/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  try {
    const user = await User.findOne({
      _id: id,
      verificationToken: token,
      verificationTokenExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(404)
        .send(
          "This link has expired. Please contact the sender of the email for more information."
        );
    }
    console.log(user);
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;
    await user.save();
    await sendEmail({
      email: user.email,
      subject: "Account Verified",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
      <img src="images/logo.png" style="display: block; margin: 0 auto;"/>
      <h2 style="color: #333;">Your Account Has Been Verified!</h2>
      <p style="color: #555;">Thank you for verifying your email address. Your account is now active!</p>
      <p style="color: #555;">You can now log in to your account and start exploring our platform.</p>
      <p style="color: #555;">If you have any questions or need assistance, feel free to reach out to our email account.</p>
      <p style="color: #555;">We’re excited to have you on board!</p>
      <p style="color: #999;">Thank you,<br>The Authentique Collectible</p>
    </div>
      `,
    });

    res.send(`
      <html>
        <head>
          <title>Verification Successful</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f9f9f9;
            }
            .container {
              text-align: center;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: white;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #4CAF50;
            }
            p {
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verified Success!</h1>
            <p>Thank you for verifying your email address.</p>
            <p>Please check your email for confirmation details.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.log("Error verifying account", error);
    res.status(500).send({ message: "Error verifying your account" });
  }
});

export default router;
