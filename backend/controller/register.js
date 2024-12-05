const User = require("../model/user");
const register = async (req, res, next) => {
    const { name, role } = req.body;
    let user = await User.findOne({ name, role });
    if (user) {
        return res.status(200).json({
            success: true,
            message: 'User Already Exist',
            user: user
        })
    }
    user = new User({
        name,
        role
    });
    await user.save();
    return res.status(200).json({
        success: true,
        message: 'User Registered',
        user: user
    })
};
module.exports = { register };