import User from "../models/User.js";

const getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      );

    const {
      firstName,
      lastName,
      phone,
      address
    } = req.body;

    user.firstName =
      firstName ?? user.firstName;

    user.lastName =
      lastName ?? user.lastName;

    user.phone =
      phone ?? user.phone;

    if (address) {
      user.address = {
        ...user.address.toObject(),
        ...address
      };
    }

    await user.save();

    const safeUser =
      await User.findById(
        user._id
      ).select("-password");

    res.json(safeUser);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export {
  getProfile,
  updateProfile
};