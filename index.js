const { app, BrowserWindow, nativeImage } = require('electron');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const expressApp = express();
const port = 3090;
const User = require('./mongo/users');

mongoose.connect('mongodb+srv://root:q8n7MKjqbgluikbZ@cluster0.zsdig.mongodb.net/New_project?retryWrites=true&w=majority&appName=Cluster0' ,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Conectado com sucesso ao MongoDB");
}).catch((err)=>{
    console.log(err.message);
});

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({
    extended: true
}));

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use(session({
    secret: '124578963369784512',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

expressApp.engine('html',require('ejs').renderFile);
expressApp.set('view engine', 'html');
expressApp.use('/public', express.static(path.join(__dirname, 'src/public')));
expressApp.set('views', path.join(__dirname, '/src/pages'));

expressApp.get('/', (req, res)=>{
    res.send('Vá para a página de criação de usuário!: <a href="/create-user">criar usuário</a>');
});

expressApp.get('/create-user', (req, res)=>{
    res.render('create_user.ejs');
});

expressApp.post('/create-user', async (req, res)=>{ 
    try{
        if(await User.findOne({ name: req.body.name_create })){
            res.redirect('/create-user');
        }else{
            const pass = await bcrypt.hash(req.body.password_create, 10);

            User.create({
                name: req.body.name_create,
                password: pass
            }).then(()=>{
                res.redirect('/login');
            }).catch(err =>{
                res.status(501).send('Erro ao tentar criar usuário:',err,'<a href="/create-user">Tentar novamente</a>');
            });
        }
    }catch{
        res.status(500).send();
    }
});

expressApp.get('/login', (req, res)=>{
    res.render('login.ejs');
});

expressApp.post('/validate-login', async (req, res)=>{
    try{
        const user = await User.findOne({
            name: req.body.name_login,
        });

        if(!user){
            return res.redirect('/login');
        }

        if(await bcrypt.compare(req.body.password_login, user.password)){
            req.session.user = user.name;
            return res.redirect('/home');
        }else{
            return res.redirect('/login');
        }
    }catch(err){
        console.error('erro ao validar login:', err);
        return res.status(500).send('Erro ao validar login!');
    }
});

expressApp.get('/home', (req, res)=>{
    if(req.session.user){
        res.render('home.ejs', { user: req.session.user });
    }else{
        res.redirect('/login');
    }
});

function startExpressServer() {
    return new Promise((resolve, reject)=>{
        const server = expressApp.listen(port, (err)=>{
            if(err){
                reject(err);
            }else{
                console.log('O servidor rodando!');
                resolve();
            }
        });
    });
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 700,
        icons: path.join(__dirname, 'icon', 'icon_principal.png'),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(`http://localhost:${port}`);
}

app.on('ready', async ()=>{
    try{
        await startExpressServer();
        createWindow();

        app.on('activate', () => {
            if(BrowserWindow.getAllWindows().length === 0){
                createWindow();
            }
        });
    }catch(err){
        console.log("Erro ao iniciar o servidor Express:", err);
    }
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});