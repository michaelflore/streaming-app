import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from './../../config/config';

import User from './../models/user.model';
import Role from './../models/role.model';

const signup = async (req, res) => {
    const user = new User(req.body)
    try {

        let role = await Role.findOne({ name: "User" });
        user.roles = [role._id];

        await user.save()

        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {

        //Return the error
        return res.status(401).json({
            error: "Could not sign up!"
        })
    }
}

const signin = async (req, res) => {
    try {
        let user = await User.findOne({
            "email": req.body.email
        }).populate("roles", "-__v")

        if (!user) {
            return res.status('401').json({ error: "User not found" })
        }

        if (!user.authenticate(req.body.password)) {
            return res.status('401').send({
                error: "Email and password don't match."
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, config.jwtSecret)

        res.cookie("t", token, {
            expire: new Date() + 9999
        })

        let authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }

        //Response with token
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                roles: authorities
            }
        })

    } catch (err) {
        return res.status('401').json({
            error: "Could not sign in"
        })

    }
}

const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}

const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['HS256']
})

const hasAuthorization = async (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id

    let roles = await Role.find({ _id: { $in: req.profile.roles } } )
    console.log(roles)
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "Admin") {
            next();
            return;
        }
    }

    if (!(authorized)) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export { signup, signin, signout, requireSignin, hasAuthorization };