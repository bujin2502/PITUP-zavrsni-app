const express = require('express');
const neo4j = require('neo4j-driver');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
// const { text } = require('express');
require('dotenv').config()

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: "lčklkjslkdfnvpoisevosidjgćlskvdćydjvćlkevnćvmčylvčvlčmsčlcvsdmvčdfkjv",
    baseURL: "http://localhost:3000",
    clientID: "YvnwhhthjSBkMGY4dJNcbZLWLJAz1R9T",
    issuerBaseURL: "https://dev-xhzjybdg.us.auth0.com",
};

const app = express();

app.set('view engine', 'ejs');
app.use(express.static ('public'));
app.use(express.static ('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(auth(config));

const port = 3000;
app.listen(port);

module.exports = app;

// Otvaranje sesije
var driver = neo4j.driver('neo4j+s://36e5e105.databases.neo4j.io', neo4j.auth.basic('neo4j', 'Eg7O6ak1ErjFPeCwsi-IMcQds9gWKcQDDUx8jBN9mco'));
session = driver.session();


// Popis osoba
app.get('/stanje', function(req, res){
    session
        .run('MATCH (n:Osoba) RETURN n')
        .then(function(result){
            var osoba = [];
            result.records.forEach(function(record){
                osoba.push({
                    id: record._fields[0].identity.low,
                    ime: record._fields[0].properties.ime,
                    prezime: record._fields[0].properties.prezime,
                    godiste: record._fields[0].properties.godiste,
                    OIB: record._fields[0].properties.OIB
                });
            });
            res.render('stanje', { title: 'Lista',
                osobe: osoba,
                isAuthenticated: req.oidc.isAuthenticated(),
                user: req.oidc.user,
            });
            session.close;
        })
        .catch(function(err){
            console.log(err);
        });
});

// Lista ALARM
app.get('/lista', function(req, res){
    session
        .run('MATCH (o1:Osoba)-[r1:OBITELJ]->(o2:Osoba) WHERE (date().year - toInteger(o1.godiste)) < 18 AND o1.nadzor = "false" CALL { WITH o2 MATCH (o2)-[r2:ZAKONSKI]->(zp) RETURN COUNT(zp) AS a } CALL { WITH o2 MATCH (o2)-[r3:SOCIJALNI]->(sp) RETURN COUNT(sp) AS b } CALL { WITH o1 MATCH (o1)-[r4:NEPRILAGODJENO]->(skp) RETURN COUNT(skp) AS c } CALL { WITH o1 MATCH (o1)-[r5:ZDRAVSTVENI]->(zdp) RETURN COUNT(zdp) AS d } RETURN o1, SUM(a + b + c + d) AS Bodovi ORDER BY Bodovi DESC LIMIT 10')
        .then(function(result){
            var osoba = [];
            result.records.forEach(function(record){
                osoba.push({
                    ime: record._fields[0].properties.ime,
                    prezime: record._fields[0].properties.prezime,
                    OIB: record._fields[0].properties.OIB,
                    nadzor: record._fields[0].properties.nadzor
                });
            });
            res.render('lista', { title: 'ALARM',
                osobe: osoba,
                isAuthenticated: req.oidc.isAuthenticated(),
                user: req.oidc.user,
            });
            session.close;
        })
        .catch(function(err){
            console.log(err);
        });
});

// Poslan nadzor
app.post('/lista', function(req, res){

    var nadzor_OIB = req.body.nadzor_OIB;

    session
        .run('MATCH (o:Osoba{OIB: $nadzor_OIB}) SET o.nadzor = "true" RETURN o', {nadzor_OIB: nadzor_OIB})
        .then(function(result){
            res.redirect('/lista');
            session.close;
        })
        .catch(function(err){
            console.log(err);
        });
});

// Dodavanje događaja - Policija
app.post('/dogadjaj/dodaj_policija', function(req, res){

    var dog_OIB = req.body.dog_OIB;
    var id_ustanova = req.body.id_ustanova;
    var vrijeme = req.body.dog_vrijeme;
    var vrsta_dogadjaj = req.body.vrsta_dogadjaj;

    session
        .run('MATCH (o:Osoba{OIB: $dog_OIB}), (d:PolicijskiDjelatnik{id_djelatnik: "pol_001"}), (i:PolicijskaPostaja{id_ustanova: $id_ustanova}) MERGE (o)-[r1:ZAKONSKI]->(p:ZakonskiProblem{vrijeme: $vrijeme, vrsta_dogadaja: $vrsta_dogadjaj}) MERGE (d)-[r2:POLICIJA_EVIDENCIJA]->(p) MERGE (p)-[r3:POLICIJA_LOKACIJA]->(i) RETURN o, d, i, p', {dog_OIB: dog_OIB, id_ustanova: id_ustanova, vrijeme: vrijeme, vrsta_dogadjaj: vrsta_dogadjaj, })
        .then(function(result){
            res.redirect('/unos_dogadjaja_policija');
            session.close;
        })
        .catch(function(err){
            console.log(err);
        });
});

// Dodavanje događaja - Škola
app.post('/dogadjaj/dodaj_skola', function(req, res){

    var dog_OIB = req.body.dog_OIB;
    var id_ustanova = req.body.id_ustanova;
    var vrijeme = req.body.dog_vrijeme;
    var vrsta_dogadjaj = req.body.vrsta_dogadjaj;

    session
        .run('MATCH (o:Osoba{OIB: $dog_OIB}), (d:ŠkolskiDjelatnik{id_djelatnik: "skol_001"}), (i:ŠkolskaUstanova{id_ustanova: $id_ustanova}) MERGE (o)-[r1:NEPRILAGODJENO]->(p:ProblemŠkola{vrijeme: $vrijeme, vrsta_dogadaja: $vrsta_dogadjaj}) MERGE (d)-[r2:SKOLA_EVIDENCIJA]->(p) MERGE (p)-[r3:SKOLA_LOKACIJA]->(i) RETURN o, d, i, p', {dog_OIB: dog_OIB, id_ustanova: id_ustanova, vrijeme: vrijeme, vrsta_dogadjaj: vrsta_dogadjaj, })
        .then(function(result){
            res.redirect('/unos_dogadjaja_skola');
            session.close;
        })
        .catch(function(err){
            console.log(err);
        });
});

// Dodavanje događaja - Zdravstvo
app.post('/dogadjaj/dodaj_zdravstvo', function(req, res){

    var dog_OIB = req.body.dog_OIB;
    var id_ustanova = req.body.id_ustanova;
    var vrijeme = req.body.dog_vrijeme;
    var vrsta_dogadjaj = req.body.vrsta_dogadjaj;

    session
        .run('MATCH (o:Osoba{OIB: $dog_OIB}), (d:ZdravstveniDjelatnik{id_djelatnik: "zdr_001"}), (i:ZdravstvenaUstanova{id_ustanova: $id_ustanova}) MERGE (o)-[r1:ZDRAVSTVENI]->(p:ZdravstveniProblem{vrijeme: $vrijeme, vrsta_dogadaja: $vrsta_dogadjaj}) MERGE (d)-[r2:ZDRAVSTVO_EVIDENCIJA]->(p) MERGE (p)-[r3:ZDRAVSTVO_LOKACIJA]->(i) RETURN o, d, i, p', {dog_OIB: dog_OIB, id_ustanova: id_ustanova, vrijeme: vrijeme, vrsta_dogadjaj: vrsta_dogadjaj, })
        .then(function(result){
            res.redirect('/unos_dogadjaja_zdravstvo');
            session.close;
        })
        .catch(function(err){
            console.log(err);
        });
});


// Dodavanje događaja - Socijalna služba
app.post('/dogadjaj/dodaj_socijalna', function(req, res){

    var dog_OIB = req.body.dog_OIB;
    var id_ustanova = req.body.id_ustanova;
    var vrijeme = req.body.dog_vrijeme;
    var vrsta_dogadjaj = req.body.vrsta_dogadjaj;

    session
        .run('MATCH (o:Osoba{OIB: $dog_OIB}), (d:SocijalniRadnik{id_djelatnik: "ss_001"}), (i:SocijalnaSkrb{id_ustanova: $id_ustanova}) MERGE (o)-[r1:SOCIJALNI]->(p:SocijalniProblem{vrijeme: $vrijeme, vrsta_dogadaja: $vrsta_dogadjaj}) MERGE (d)-[r2:SOCIJALNO_EVIDENCIJA]->(p) MERGE (p)-[r3:SOCIJALNO_LOKACIJA]->(i) RETURN o, d, i, p', {dog_OIB: dog_OIB, id_ustanova: id_ustanova, vrijeme: vrijeme, vrsta_dogadjaj: vrsta_dogadjaj, })
        .then(function(result){
            res.redirect('/unos_dogadjaja_socijalna');
            session.close;
        })
        .catch(function(err){
            console.log(err);
        });
});


// Routes      
app.get('/', (req, res) => {
    res.render('index', { title: 'O aplikaciji',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
    });
});

app.get('/unos_dogadjaja_policija', (req, res) => {
    res.render('unos_dogadjaja_policija', { title: 'Unos događaja - Policija',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    });
});

app.get('/unos_dogadjaja_skola', (req, res) => {
    res.render('unos_dogadjaja_skola', { title: 'Unos događaja - Škola',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    });
});

app.get('/unos_dogadjaja_socijalna', (req, res) => {
    res.render('unos_dogadjaja_socijalna', { title: 'Unos događaja - Socijalna služba',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    });
});

app.get('/unos_dogadjaja_zdravstvo', (req, res) => {
    res.render('unos_dogadjaja_zdravstvo', { title: 'Unos događaja - Zdravstvo',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    });
});

app.get('/unos_dogadjaja_ostali', (req, res) => {
    res.render('unos_dogadjaja_ostali', { title: 'Unos događaja - Ostali',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    });
});

app.get('/analiticki_prikaz', (req, res) => {
    res.render('analiticki_prikaz', { title: 'Analitički prikaz',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    });
});

app.use((req, res) => {
    res.status(404).render('404', { title: 'Nepostojeća stranica',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
    });
});