const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.hash)) {
       if(user.accountActive === true) {
           const {hash, ...userWithoutHash} = user.toObject();
           const token = jwt.sign({sub: user.id}, config.secret, { expiresIn: '1h' });
           return {
               ...userWithoutHash,
               token
           };
       }else{
           throw 'Your account is pending approval.'
       }
    }
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

async function hashPassword(User) {
    const { password }  = User;
    const passwordHash = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });
    return passwordHash;
}

async function update(id, userParam) {

        const user = await User.findById(id);

        // validate
        if (!user) throw 'User not found';
        if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
            throw 'Username "' + userParam.username + '" is already taken';
        }

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