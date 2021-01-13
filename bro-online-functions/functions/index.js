const functions = require('firebase-functions');
const app = require('express')();
const {db, admin} = require('./util/admin');

// TODO: Please note that you need to fill out the config below; you should find this in the firebase console; once you created a project
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

// FBAuth == Firebase Auth
const FBAuth = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return res.status(403).json({error: 'Unauthorized'});
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            return db.collection('users')
                .where('userId', '==', req.user.uid)// TODO how to set the userId automatically on the DB?
                .limit(1)
                .get();
        })
        .then((data) => {
            req.user.userName = data.docs[0].data().userName;
            return next();
        })
        .catch((err) => {
            console.error('Error while verifying token ', err);
            return res.status(403).json(err);
        })
}

app.get('/groups/:docId', FBAuth, (req, res) => {
    let groupMembers = [];
    let groupMembersUserName = [];
    db
        .doc(`/groups/${req.params.docId}`)
        .collection("groupMembers")
        .get()
        .then((data) => {
            data.forEach((doc) => {
                groupMembersUserName.push(doc.data().userName)
            })

            if (groupMembersUserName.length !== 0) {
                getNameFromUserName(groupMembersUserName, groupMembers, res);
            }
        }).catch((err) => {
            console.error(err);
    })
})

function getNameFromUserName(groupMembersUserName, groupMembers, res) {
    db
        .collection('users')
        .where('userName', 'in', groupMembersUserName)
        .get()
        .then((data) => {
            data.forEach((doc) => {
                groupMembers.push({
                    name: doc.data().name
                })
            })
            return res.json(groupMembers);
        }).catch((err) => {
            console.error(err);
    })
}

// Signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        userName: req.body.userName,
        namee: req.body.namee
    }

    let token, userId;
    db.doc(`/users/${newUser.userName}`).get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({handle: 'this userName is already taken'})
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                userName: newUser.userName,
                email: newUser.email,
                userId,
                namee: newUser.namee
            }

            return db.doc(`/users/${newUser.userName}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
    })
})

app.post('/login', (req,res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    }

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({token});
        })
});


app.get('/get_interest', FBAuth, (req, res) => {
    const userName = req.user.userName;

    db
        .collection('users')
        .doc(userName)
        .collection('interests')
        .get()
        .then((data) => {
            let interests = [];

            data.forEach((doc) => {
                let schema = {
                    name: doc.data().name,
                    docId: doc.id
                }

                interests.push(schema);
            });

            return res.json(interests);
        }).catch((err) => {
            console.error(err);
        })
})

app.post('/add_interest', FBAuth, (req, res) => {
    const userName = req.user.userName;
    const newInterest = {
        name: req.body.name
    }
    let docId;

    db
        .collection('users')
        .doc(userName)
        .collection('interests')
        .add(newInterest)
        .then((doc) => {
            docId = doc.id;

            db
                .doc(`/groups/${docId}`)
                .set({
                    creator: userName,
                    name: newInterest.name
                })
                .then(() => {
                    res.json("SUCCESS");
                })
                .catch((err) => {
                    console.error(err);
                    return res.status(500).json({error: err.code});
                })
        })
        .catch(err => {
                res.status(500).json({error: 'something went wrong'})
                console.error(err);
            })
})

app.get('/user', FBAuth, (req,res) => {
    let userData = {};
    userData.credentials = {};
    userData.credentials.userName = {};

    userData.credentials.userName = req.user.userName;
    return res.json(userData);
})

app.get('/users', FBAuth, (req, res) => {
    const jsonSchema = [];

    db
        .collection('users')
        .get()
        .then((data) => {
            data.forEach((doc) => {
                jsonSchema.push({
                    name: doc.data().namee,
                    userName: doc.data().userName
                });

            })
            res.json(jsonSchema);
        }).catch((err) => {
            console.error(err);
    })
})

app.post('/add_member', FBAuth, (req, res) => {
    const docId = req.body.docId;
    const newMember = {
        userName: req.body.userName
    }

    db
        .collection('groups')
        .doc(docId)
        .collection('groupMembers')
        .add(newMember)
        .then(() => {
            res.json("SUCCESS");
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
        })
})

exports.api = functions.region('europe-west2').https.onRequest(app);
