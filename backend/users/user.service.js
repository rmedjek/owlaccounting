const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config.json');
const User = require('./user.model');

module.exports = {
    registerAdmin,
    create,
    login
};


async function registerAdmin(userParam) {
    if (await User.findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    let htmlMsg;
    User.findOne({ email: userParam.body.email }, async (err, user) => {
        if (!user) { //add new user
            const hashedPassword = bcrypt.hashSync(userParam.body.password, 8);
            const user = User.create({
                name: userParam.body.name,
                email: userParam.body.email,
                password: hashedPassword,
                role: userParam.body.role
            }, (err, user) => {
                htmlMsg = encodeURIComponent('Registered OK, disable after first admin created!');
            })
            await user.save();
        } else { //duplicate
            htmlMsg = encodeURIComponent('Email existing, please enter a new one ...');
        }
    });
}

async function create(userParam,) {
    if (await User.findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    let htmlMsg;
    User.findOne({ email: userParam.body.email }, async (err, user) => {
        if (!user) { //add new user
            const hashedPassword = bcrypt.hashSync(userParam.body.password, 8);
            const user = User.create({
                name: userParam.body.name,
                email: userParam.body.email,
                password: hashedPassword,
                role: "normal"
            }, (err, user) => {
                htmlMsg = encodeURIComponent('Registered OK, disable after first admin created!');
            })
            await user.save();
        } else { //duplicate
            htmlMsg = encodeURIComponent('Email existing, please enter a new one ...');
        }
    });
}

async function login({ email, password }) {
    User.findOne({ email: email }, (err, user) => {
        if (!user) {
            encodeURIComponent('Email not found, try again ...');
        } else {
           if (user && bcrypt.compareSync(password, user.password)) {
                const {hash, ...userWithoutHash} = user.toObject();
                const token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                console.log('token: ', token)
                localStorage.setItem('authtoken', token)
                return {
                    ...userWithoutHash, token
                }
            }
        }
    });
}

// async function loggedUser(req, res) {
//     const token = localStorage.getItem('authtoken');
//     jwt.verify(token, config.secret, function(err, decoded) {
//         if (err) return res.status(500).send({ users: false, message: 'Failed to authenticate token.' });
//
//         // res.status(200).send(decoded);
//         User.findById(decoded.id, { password: 0 }, function (err, user) {
//             if (err) return res.status(500).send("There was a problem finding the user.");
//             if (!user) return res.status(404).send("No user found.");
//
//             res.status(200).send(user);
//         });
//     });
// }

// Register 1st Admin without JWT validation
// router.post('/registerAdmin', (req,res) => {
//     User.findOne({ email: req.body.email }, (err, user) => {
//         if (err) return res.status(500).send('Error on the server.');
//         let htmlMsg
//         if (!user) { //add new user
//             const hashedPassword = bcrypt.hashSync(req.body.password, 8);
//             User.create({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: hashedPassword,
//                 role: req.body.role
//             }, (err, user) => {
//                 if(err) return res.status(500).send('There was a problem registering user')
//                 htmlMsg = encodeURIComponent('Registered OK, disable after first admin created!');
//                 res.redirect('/admin?msg=' + htmlMsg)
//             })
//         } else { //duplicate
//             htmlMsg = encodeURIComponent('Email existing, please enter a new one ...');
//             res.redirect('/admin?msg=' + htmlMsg);
//         }
//     })
//
// })

// Register a User
// router.post('/register', (req, res) => {
//     User.findOne({ email: req.body.email }, (err, user) => {
//         if (err) return res.status(500).send('Error on the server.');
//         let htmlMsg
//         if (!user) { //add new user
//             const hashedPassword = bcrypt.hashSync(req.body.password, 8);
//             User.create({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: hashedPassword,
//                 role: "normal"
//             }, (err, user) => {
//                 if(err) return res.status(500).send('There was a problem registering user')
//                 htmlMsg = encodeURIComponent('Registered OK !');
//                 res.redirect('/?msg=' + htmlMsg)
//             })
//         } else { //duplicate
//             htmlMsg = encodeURIComponent('Email existing, please enter a new one ...');
//             res.redirect('/?msg=' + htmlMsg);
//         }
//     })
// });

// Login User
// router.post('/login', (req, res) => {
//     User.findOne({ email: req.body.email }, (err, user) => {
//         if (err) return res.status(500).send('Error on the server.');
//         let htmlMsg
//         if (!user) {
//             htmlMsg = encodeURIComponent('Email not found, try again ...');
//             res.redirect('/?invalid=' + htmlMsg);
//         } else {
//             const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
//             if (!passwordIsValid) {
//                 return res.status(401).send({ users: false, token: null });
//             }
//
//             var token = jwt.sign({ id: user._id }, config.secret, {
//                 expiresIn: 86400 // expires in 24 hours
//             });
//             localStorage.setItem('authtoken', token)
//
//             console.log('user Here: ', user);
//
//             if(user.role === 'admin'){
//                 res.redirect(`/admin/userDashboard`)
//             }else{
//                 res.redirect(`/users/view_shopping_list`);
//             }
//         }
//     });
// });

// Info of logged User
// router.get('/loggedUser', function(req, res) {
//     var token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ users: false, message: 'No token provided.' });
//
//     jwt.verify(token, config.SECRET_KEY, function(err, decoded) {
//         if (err) return res.status(500).send({ users: false, message: 'Failed to authenticate token.' });
//
//         // res.status(200).send(decoded);
//         User.findById(decoded.id, { password: 0 }, function (err, user) {
//             if (err) return res.status(500).send("There was a problem finding the user.");
//             if (!user) return res.status(404).send("No user found.");
//
//             res.status(200).send(user);
//         });
//     });
// });

