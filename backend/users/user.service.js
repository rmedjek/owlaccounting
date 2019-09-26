const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Joi = require('@hapi/joi');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getJWTToken,
    getEncryptedPassword
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });

    if (user && await bcrypt.compareSync(password, user.hash)) {
        if(user.accountActive === true) {
            const {hash, ...userWithoutHash} = user.toObject();
            const token = jwt.sign({sub: user.id}, config.secret, { expiresIn: '1h' });
            return {
                ...userWithoutHash, token
            };
        } else {
            throw 'Your account is pending approval.'
        }
    }
}

async function getJWTToken(user) {
    return jwt.sign({sub: user.id}, config.secret, { expiresIn: '1h' });
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);
    user.role = "3";
    user.accountActive = false;
    // hash password
    if (userParam.password) {
        user.hash = await hashPassword(userParam);
    }
    // save user
    await user.save();
}

async function getEncryptedPassword(password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}

async function hashPassword(User) {
    const { password }  = User;
    return await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });
}

async function update(id, userParam) {

    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // if (user.email !== userParam.email && await User.findOne({ email: userParam.email})) {
    //     throw 'Email "' + userParam.email + '" is already in the system'
    // }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);
    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

// function validateForgotSchema(body) {
//     const schema = Joi.object().key({
//         email: Joi.string()
//             .email()
//             .required(),
//     });
//     const {error, value} = Joi.validate(body, schema);
//     if (error && error.details) {
//         return {error};
//     }
//     return {value};
// }

// function validateSignupSchema(body) {
//     const schema = Joi.object({
//         email: Joi.string()
//             .email()
//             .required(),
//         password: Joi.string().required(),
//         name: Joi.string().required(),
//     });
//     const { error, value } = Joi.validate(body, schema);
//     if (error && error.details) {
//         return { error };
//     }
//     return { value };
// }
