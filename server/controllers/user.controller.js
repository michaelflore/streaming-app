import User from './../models/user.model';
import extend from 'lodash/extend';

const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
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
        res.status(400).json({ error: e})
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
        user.password = undefined;

        await user.save();

        res.json(user)
    } catch (e) {
        return res.status(400).json({ error: "Error when updating."})
    }
}

const remove = async (req, res) => {
    try {
        let user = req.profile;
        let deletedUser  = await user.remove();
        deletedUser.password = undefined;
        res.json(deletedUser);
    } catch (e) {
        return res.status(400).json({ error: "Error when removing."})
    }
}

export { userByID, adminBoard, read, update, remove };