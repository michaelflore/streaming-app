const ROLES = ["user", "admin"];
import User from "./../models/user.model";
import Role from "./../models/role.model";

const checkDuplicateEmail = (req, res, next) => {

    // Email
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }
        next();
    });
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }

    next();
};

const isAdmin = async (req, res, next, id) => {

    let user = await User.findById(id);
// console.log(user.roles)

    let roles = await Role.find({ _id: { $in: user.roles} } )
// console.log(roles)
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "Admin") {
            next();
            return;
        }
    }

    res.status(403).json({message: "Requires Admin Role!"});
}

export { checkDuplicateEmail, checkRolesExisted, isAdmin };