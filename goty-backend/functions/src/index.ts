import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';


const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://firestore-grafica-ddf33.firebaseio.com"
})

const db = admin.firestore();

export const helloWorld = functions.https.onRequest((request, response) => {
    response.json("Hello from Firebase!");
});


//Express
const app = express();
app.use(cors({ origin: true }));

app.get('/goty', async (req, res) => {
    const gotyRef = db.collection('goty');
    const docSnap = await gotyRef.get();
    const juegos = docSnap.docs.map(doc => doc.data());

    res.json(juegos);
});

export const api = functions.https.onRequest(app);

app.post('/goty/:id', async (req, res) => {
    const id = req.params.id;
    const gameRef = db.collection('goty').doc(id);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
        res.status(404).json({
            ok: false,
            message: 'Don\'t exists game with the id ' + id
        });
    }
    else {

        const before = gameSnap.data() || { votos: 0 };
        await gameRef.update({
            votos: before.votos + 1
        });

        res.json({
            ok: true,
            message: 'Thanks for you vote to ' + before.name
        });
    }
});