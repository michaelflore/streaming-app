import User from './../models/user.model';
import extend from 'lodash/extend';

const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id).populate("roles", "-__v")
        if (!user) {
            return res.status('400').json({
                error: "User not found"
            })
        }

        // Can't mutate mongodb user from query
        // console.log(user)
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}

//Fetch List of Users
const adminBoard = async (req, res) => {
    try {
        let users = await User.find().select(" name email updated created");
        res.json(users);
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

const read = (req, res) => {
    return res.json(req.profile);
}

const update = async (req, res) => {
    try {
        let user = req.profile;
        user = extend(user, req.body);
        user.updated = Date.now();
        await user.save();

        //After saving
        user.hashed_password = undefined;
        user.salt = undefined;

        res.json(user)
    } catch (e) {
        return res.status(400).json({ error: e})
    }
}

const remove = async (req, res) => {
    try {
        let user = req.profile;
        let deletedUser  = await user.remove();
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;
        res.json(deletedUser);
    } catch (e) {
        return res.status(400).json({ error: "Error when removing."})
    }
}

export { userByID, adminBoard, read, update, remove };