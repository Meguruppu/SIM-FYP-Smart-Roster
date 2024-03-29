const express = require('express')
const path = require('path')
const bodyParser = require("body-parser")
var session = require('express-session')
var flush = require('connect-flash')
const spawn = require("child_process").spawn

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(session({
    secret:'oHn2mKV567n1m$%^',
    resave:false,
    saveUninitialized:true
}))
app.use(flush())

app.set('views','./views')
app.set('view engine','ejs')

//static files
app.use(express.static('public'))
app.use('/css',express.static(__dirname +"public/css/"))
app.use('/js',express.static(__dirname +"public/js/"))
app.use('/img',express.static(__dirname +"public/img/"))

app.use(express.json())
const loggedin = []

function getFiles() {
    fs = require('fs')
    files = fs.readdirSync('./views')
    console.log(files)
    if(files.includes('AdminCreateAdminAccountGUI.ejs')){
        console.log('yes')
    }
}

getFiles()

app.get('/homepage', (req,res) =>{
    res.render(ssn.userprof + 'Page');
})

app.get('/resetpassword', (req,res) =>{
    res.render('ResetPassword', {username : ssn.username});
})

app.post("/resetpass", (req,res)=>{
    ssn = req.session
    const myJSON = {
        password: req.body.newpass,
        employeeid: ssn.emlpoyeeidentity
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./ResetPasswordController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    var bool = data.toString()
    })
    res.redirect('/homepage')
})

app.get('/manager_createws', (req, res) => {
    // Render the UpdateManagerAccount.ejs page
    res.render('CreateWorkShift');
});

app.get('/employee_createLeave', (req, res) => {
    // Render the EmployeeCreateLeave.ejs page
    res.render('EmployeeCreateLeave');
});


app.get('/', (req, res) => {
    res.redirect('/logingui')
})

app.get('/logout', (req,res) => {
    ssn = req.session
    if(ssn.userprof){
        delete ssn.userprof
    }
    res.redirect('/')
})

app.get('/logingui', (req,res) =>{
    ssn = req.session
    var pythonProcess = spawn('python',["./UserProfileSelectorController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('LoginGUI',{myList, message: req.flash('message')})
            console.log(myList)
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
    if(ssn.userprof){
        res.redirect("/homepage")
    }
})

app.post("/logingui", (req,res)=>{
    ssn = req.session
    ssn.emlpoyeeidentity = 0
    ssn.username = req.body.Username
    const myJSON = {
        username: req.body.Username,
        password: req.body.Password,
        mainrole: req.body.selectedoption
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./LoginController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    req.flash('message', null)
    var bool = data.toString()
    console.log(bool)
    if (bool == "False\r\n")
    {
        req.flash('message', null);
        req.flash('message','Invalid User')
        res.redirect('/logingui')
        
    }
    else
    {
        if(loggedin.length != 0){
            loggedin.length = 0
        }
        if(loggedin.length === 0){
            var pythonProcess2 = spawn('python',["./GetEmployeeIDController.py",myJSON2])
                pythonProcess2.stdout.on('data',(data)=>{
                var alldata2 = JSON.parse(data.toString())
                myJSON["employeeid"] = alldata2[0][0]   
                ssn.emlpoyeeidentity = myJSON["employeeid"]
                console.log(ssn.emlpoyeeidentity)
                ssn.userprof = req.body.selectedoption
                res.redirect('/homepage')  
            })
            req.flash('message', null);
            loggedin.push(myJSON)
            req.flash('message','Enter Details')
            
        }
    }
})
})

app.get('/createuserorprofile', (req,res) =>{
    res.render('CreateUserOrProfile');
})

app.get('/createadminaccount', (req,res) =>{
    res.render('AdminCreateAdminAccountGUI',{message: req.flash('message15')});
    console.log(ssn.userprof)
})

app.post('/createadminaccount', (req,res) =>{
    const myJSON = {
        fullname : req.body.name,
        address : req.body.Address,
        email : req.body.email,
        phonenumber : req.body.Number,
        username : req.body.username,
        password : req.body.password,
        Maxhrs : req.body.MaxHours
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./AdminCreateAdminAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    req.flash('message15', null)
    var bool = data.toString()
    console.log(bool.trim())
    if (bool.trim() == "Failed")
    {
        req.flash('message15','Unable to create User. Double check your values entered')
        res.redirect('/createadminaccount')
    }
    else
    {
        req.flash('message15','User Account Created')
        res.redirect('/createadminaccount')
    }
})
})

app.get('/createemployeeaccount', (req,res) =>{
    res.render('AdminCreateEmployeeAccountGUI',{message: req.flash('message16')});
})

app.post('/createemployeeaccount', (req,res) =>{
    const myJSON = {
        fullname : req.body.name,
        address : req.body.Address,
        email : req.body.email,
        phonenumber : req.body.Number,
        username : req.body.username,
        password : req.body.password,
        Maxhrs : req.body.MaxHours
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./AdminCreateEmployeeAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    req.flash('message16', null)
    var bool = data.toString()
    console.log(bool)
    if (bool.trim() == "Failed")
    {
        req.flash('message16','Unable to create User. Double check your values entered')
        res.redirect('/createemployeeaccount')
    }
    else
    {
        req.flash('message16','User Account Created')
        res.redirect('/createemployeeaccount')
    }
})
})

app.get('/createmanageraccount', (req,res) =>{
    res.render('AdminCreateManagerAccountGUI',{message: req.flash('message17')});
})

app.post('/createmanageraccount', (req,res) =>{
    const myJSON = {
        fullname : req.body.name,
        address : req.body.Address,
        email : req.body.email,
        phonenumber : req.body.Number,
        username : req.body.username,
        password : req.body.password,
        Maxhrs : req.body.MaxHours
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./AdminCreateManagerAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    req.flash('message17', null);
    var bool = data.toString()
    console.log(bool)
    if (bool.trim() == "Failed")
    {
        req.flash('message17','Unable to create User. Double check your values entered')
        res.redirect('/createmanageraccount')
    }
    else
    {
        req.flash('message17','User Account Created')
        res.redirect('/createmanageraccount')
    }
})
})

app.get('/chooseaccount', (req,res) =>{
    res.render('ChooseAccount');
})


app.get('/admin_update', (req,res) =>{
    res.render('AdminUpdateChoose');
})

app.get('/createuserprofile', (req,res) =>{
    var pythonProcess = spawn('python',["./UserProfileSelectorController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('AdminCreateUserProfileGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/createuserprofile', (req,res) =>{
    const myJSON = {
        employeeid : req.body.employeeid,
        profile : req.body.selectedoption,
        role : req.body.role
    }
    const myJSON2 = JSON.stringify(myJSON)
    var pythonProcess = spawn('python',["./CreateUserProfileController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    req.flash('message', null);
    var bool = data.toString()
    console.log(bool)
    if (bool.trim() == "Failed")
    {
        req.flash('message','Unable to create Profile. Double check your values entered')
        res.redirect('/createuserprofile')
    }
    else
    {
        req.flash('message','User Profile Created')
        res.redirect('/createuserprofile')
    }
})
})

app.get('/admin_update', (req,res) =>{
    res.render('AdminUpdateChoose');
})

app.get('/updateuserprofile', (req,res) =>{
    res.render('AdminUpdateUserProfileGUI',{message: req.flash('message')})
})

app.post('/updateuserprofile', (req,res) =>{
    const myJSON = {
        employeeid : req.body.employeeid,
        selectedoption : req.body.selectedoption,
        role : req.body.role
    }
    const myJSON2 = JSON.stringify(myJSON)
    var pythonProcess = spawn('python',["./UpdateUserProfileController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    var bool = data.toString()
    console.log(bool)
    req.flash('message', null);
    if (bool.trim() == "Failed")
    {
        req.flash('message','Unable to update Profile. Double check your values entered')
        res.redirect('/updateuserprofile')
    }
    else
    {
        req.flash('message','User Profile Updated')
        res.redirect('/updateuserprofile')
    }
})
})

app.get('/adminupdateaccountchoose', (req,res) =>{
    res.render('AdminUpdateChooseAccount')
})

app.get('/adminupdateadminaccount', (req,res) =>{
    var pythonProcess = spawn('python',["./grabUserAccountTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('AdminUpdateAdminAccountGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/adminupdateadminaccount', (req,res) =>{
    const myJSON = {
        employeeid : req.body.employeeid,
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./AdminUpdateAdminAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    var bool = data.toString()
    console.log(bool)
    req.flash('message', null);
    if (bool.trim() == "Failed")
    {
        req.flash('message','Unable to update Admin Account. Double check your values entered')
        res.redirect('/adminupdateadminaccount')
    }
    else
    {
        req.flash('message','Admin Account Updated')
        res.redirect('/adminupdateadminaccount')
    }
})
})

app.get('/adminupdatemanageraccount', (req,res) =>{
    var pythonProcess = spawn('python',["./grabUserAccountTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('AdminUpdateManagerAccountGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/adminupdatemanageraccount', (req,res) =>{
    const myJSON = {
        employeeid : req.body.employeeid,
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./AdminUpdateManagerAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    var bool = data.toString()
    console.log(bool)
    req.flash('message', null);
    if (bool.trim() == "Failed")
    {
        req.flash('message','Unable to update Manager Account. Double check your values entered')
        res.redirect('/adminupdatemanageraccount')
    }
    else
    {
        req.flash('message','Manager Account Updated')
        res.redirect('/adminupdatemanageraccount')
    }
})
})

app.get('/adminupdateemployeeaccount', (req,res) =>{
    var pythonProcess = spawn('python',["./grabUserAccountTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('AdminUpdateEmployeeAccountGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/adminupdateemployeeaccount', (req,res) =>{
    const myJSON = {
        employeeid : req.body.employeeid,
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./AdminUpdateEmployeeAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    var bool = data.toString()
    console.log(bool)
    req.flash('message', null);
    if (bool.trim() == "Failed")
    {
        req.flash('message','Unable to update Employee Account. Double check your values entered')
        res.redirect('/adminupdateemployeeaccount')
    }
    else
    {
        req.flash('message','Employee Account Updated')
        res.redirect('/adminupdateemployeeaccount')
    }
})
})

app.get('/admindeleteaccountchoose', (req,res) =>{
    res.render('AdminDeleteAccountChoiceGUI')
})

app.get('/admindeleteadminaccount', (req,res) =>{
    res.render('AdminDeleteAdminAccountGUI',{ message: req.flash('message')})
})

app.post('/admindeleteadminaccount', (req,res) =>{
    const myJSON = {
        employeeid : req.body.employeeid
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./AdminDeleteAdminAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    var bool = data.toString()
    console.log(bool)
    req.flash('message', null);
    if (bool.trim() == "Failed")
    {
        req.flash('message','Unable to delete Admin Account. Double check your values entered')
        res.redirect('/admindeleteadminaccount')
    }
    else
    {
        req.flash('message','Admin Account Deleted')
        res.redirect('/admindeleteadminaccount')
    }
})
})

app.get('/admindeletemanageraccount', (req,res) =>{
    res.render('AdminDeleteManagerAccountGUI',{ message: req.flash('message')})
})

app.post('/admindeletemanageraccount', (req,res) =>{
    const myJSON = {
        employeeid : req.body.employeeid
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./AdminDeleteManagerAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    var bool = data.toString()
    console.log(bool)
    req.flash('message', null);
    if (bool.trim() == "Failed")
    {
        req.flash('message','Unable to delete Manager Account. Double check your values entered')
        res.redirect('/admindeletemanageraccount')
    }
    else
    {
        req.flash('message','Manager Account Deleted')
        res.redirect('/admindeletemanageraccount')
    }
})
})

app.get('/admindeleteemployeeaccount', (req,res) =>{
    res.render('AdminDeleteEmployeeAccountGUI',{ message: req.flash('message')})
})

app.post('/admindeleteemployeeaccount', (req,res) =>{
    const myJSON = {
        employeeid : req.body.employeeid
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./AdminDeleteEmployeeAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    var bool = data.toString()
    console.log(bool)
    req.flash('message', null);
    if (bool.trim() == "Failed")
    {
        req.flash('message','Unable to delete Employee Account. Double check your values entered')
        res.redirect('/admindeleteemployeeaccount')
    }
    else
    {
        req.flash('message','Employee Account Deleted')
        res.redirect('/admindeleteemployeeaccount')
    }
})
})

app.get('/admin_view', (req,res) =>{
    res.render('AdminViewChoose')
})

app.get('/admin_view', (req,res) =>{
    res.render('AdminViewChoose')
})

app.get('/adminviewaccountchoose', (req,res) =>{
    res.render('AdminViewChooseAccount')
})

app.get('/adminviewuserprofile', (req,res) =>{
    var pythonProcess = spawn('python',["./AdminViewUserProfileController.py"])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    if (data.toString().trim() == "No table left")
    {
        req.flash('message17','No Table Left')
        res.render('AdminViewUserProfileGUI',{message: req.flash('message17')})
    }
    else
    {
        req.flash('message17','Tables found')
        res.render('AdminViewUserProfileGUI',({"results": alldata, message: req.flash('message17')}))
    }
}) 
})

app.get('/adminviewadminaccount', (req,res) =>{
    var pythonProcess = spawn('python',["./AdminViewAdminAccountsController.py"])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    if (data.toString().trim() == "No table left")
    {
        req.flash('message17','No Table Left')
        res.render('AdminViewAdminAccountGUI',{message: req.flash('message17')})
    }
    else
    {
        req.flash('message17','Tables found')
        res.render('AdminViewAdminAccountGUI',({"results": alldata, message: req.flash('message17')}))
    }
})
})

app.get('/adminviewmanageraccount', (req,res) =>{
    var pythonProcess = spawn('python',["./AdminViewManagerAccountsController.py"])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    if (data.toString().trim() == "No table left")
    {
        req.flash('message17','No Table Left')
        res.render('AdminViewManagerAccountGUI',{message: req.flash('message17')})
    }
    else
    {
        req.flash('message17','Tables found')
        res.render('AdminViewManagerAccountGUI',({"results": alldata, message: req.flash('message17')}))
    }
})
})

app.get('/adminviewemployeeaccount', (req,res) =>{
    var pythonProcess = spawn('python',["./AdminViewEmployeeAccountsController.py"])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    if (data.toString().trim() == "No table left")
    {
        req.flash('message17','No Table Left')
        res.render('AdminViewEmployeeAccountGUI',{message: req.flash('message17')})
    }
    else
    {
        req.flash('message17','Tables found')
        res.render('AdminViewEmployeeAccountGUI',({"results": alldata, message: req.flash('message17')}))
    }
})
})

app.get('/admin_searchfilter', (req,res) =>{
    res.render('AdminSearchFilterChooseGUI')
})

app.get('/admin_searchaccounts', (req,res) =>{
    res.render('AdminSearchAccountsGUI')
})

app.get('/adminsearchadmin', (req,res) =>{
    var pythonProcess = spawn('python',["./grabUserAccountTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('AdminSearchAdminAccountGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/adminsearchadmin', (req,res) =>{
    const jsonObj = {
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    var pythonProcess = spawn('python',["./AdminSearchAdminAccountsController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    req.flash('message', null);
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    
    if (data.toString().trim() == "No table left" || data.toString().trim() == "Failed")
    {
        console.log(data.toString())
        req.flash('message','Failed Search')
        res.redirect('/adminsearchadmin')   
    }
    else
    {
        res.render('AdminSearchAdminTableGUI',{"results": alldata}) 
    }
})
});

app.get('/adminsearchmanager', (req,res) =>{
    var pythonProcess = spawn('python',["./grabUserAccountTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('AdminSearchManagerAccountGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/adminsearchmanager', (req,res) =>{
    const jsonObj = {
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    var pythonProcess = spawn('python',["./AdminSearchManagerAccountsController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    req.flash('message', null);
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    
    if (data.toString().trim() == "No table left" || data.toString().trim() == "Failed")
    {
        console.log(data.toString())
        req.flash('message','Failed Search')
        res.redirect('/adminsearchmanager')   
    }
    else
    {
        res.render('AdminSearchManagerTableGUI',{"results": alldata}) 
    }
})
});

app.get('/adminsearchemployee', (req,res) =>{
    var pythonProcess = spawn('python',["./grabUserAccountTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('AdminSearchEmployeeAccountGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/adminsearchemployee', (req,res) =>{
    const jsonObj = {
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    var pythonProcess = spawn('python',["./AdminSearchEmployeeAccountsController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    req.flash('message', null);
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    
    if (data.toString().trim() == "No table left" || data.toString().trim() == "Failed")
    {
        console.log(data.toString())
        req.flash('message23','Failed Search')
        res.redirect('/adminsearchemployee')   
    }
    else
    {
        res.render('AdminSearchEmployeeTableGUI',{"results": alldata}) 
    }
})
});

//UpdateManagerAccount
app.get('/updatemanageraccount', (req,res) =>{
    var pythonProcess = spawn('python',["./grabUserAccountTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('UpdateManagerAccount',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/updatemanageraccount', (req,res) =>{
    const emlpoyeeidentity = req.session.emlpoyeeidentity
    const myJSON = {
        employeeid : emlpoyeeidentity,
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const myJSON2 = JSON.stringify(myJSON)
    console.log(myJSON2)
    var pythonProcess = spawn('python',["./UpdateManagerAccountController.py",myJSON2])
    pythonProcess.stdout.on('data',(data)=>{
    var bool = data.toString()
    console.log(bool)
    req.flash('message', null);
    if (bool.trim() == "Failed")
    {
        req.flash('message','Unable to update Employee Account. Double check your values entered')
        res.redirect('/UpdateManagerAccount')
    }
    else
    {
        req.flash('message','Employee Account Updated')
        res.redirect('/UpdateManagerAccount')
    }
})
})


app.get('/manager_createws', (req, res) => {
    // Render the UpdateManagerAccount.ejs page
    res.render('CreateWorkShift');
});

app.post('/CreateWorkShift', (req, res) => {
    const { date, shift, start, end } = req.body;
    const dataToSend = JSON.stringify({ date, shift, start, end });
    
    // Spawn Python process and pass JSON data as argument
    const pythonProcess = spawn('python', ['./CreatewsController.py', dataToSend]);
    
    pythonProcess.stdout.on('data', (data) => {
      const result = data.toString().trim();
      if (result === 'Failed') {
        res.status(500).send('Unable to create workshift. Double check your values entered');
      } else {
        res.send('Workshift Created');
      }
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error('Error from Python Script:', data.toString());
      res.status(500).send('Error from python script');
    });
  });

app.get('/managerfilterpreference', (req,res) =>{
    var pythonProcess = spawn('python',["./grabShiftPreferenceController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('ManagerFilterPreferenceGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/managerfilterpreference', (req,res) =>{
    const jsonObj = {
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    var pythonProcess = spawn('python',["./ManagerFilterShiftPreferenceController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    
    if (data.toString().trim() == "No table left" || data.toString().trim() == "Failed")
    {
        console.log(data.toString())
        req.flash('message23','Failed Search')
        res.redirect('/managerfilterpreference')   
    }
    else
    {
        res.render('ManagerFilterShiftPrefTableGUI',{"results": alldata}) 
    }
})
});

app.get('/manager_viewshiftpref', (req,res) =>{
    var pythonProcess = spawn('python',["./ManagerViewShiftPreferenceController.py"])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    if (data.toString().trim() == "No table left")
    {
        req.flash('message17','No Table Left')
        res.render('ManagerViewShiftPrefGUI',{message: req.flash('message17')})
    }
    else
    {
        req.flash('message17','Tables found')
        res.render('ManagerViewShiftPrefGUI',({"results": alldata, message: req.flash('message17')}))
    }
})
})

app.get('/managerviewemployeeaccounts', (req,res) =>{
    var pythonProcess = spawn('python',["./ManagerViewEmployeeAccountsController.py"])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    if (data.toString().trim() == "No table left")
    {
        req.flash('message17','No Table Left')
        res.render('ManagerViewEmployeeAccountsGUI.ejs',{message: req.flash('message17')})
    }
    else
    {
        req.flash('message17','Tables found')
        res.render('ManagerViewEmployeeAccountsGUI.ejs',({"results": alldata, message: req.flash('message17')}))
    }
})
})

app.get('/managerfilteremployeeaccounts', (req,res) =>{
    var pythonProcess = spawn('python',["./ManagerFiltergrabTableColumns.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('ManagerFilterEmployeeAccountGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/managerfilteremployeeaccounts', (req,res) =>{
    const jsonObj = {
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    var pythonProcess = spawn('python',["./ManagerFilterEmployeeController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    
    if (data.toString().trim() == "No table left" || data.toString().trim() == "Failed")
    {
        console.log(data.toString())
        req.flash('message23','Failed Search')
        res.redirect('/managerfilteremployeeaccounts')   
    }
    else
    {
        res.render('ManagerFilterEmployeeAccountsTableGUI',{"results": alldata}) 
    }
})
});

app.get('/managersearchemployeeaccounts', (req,res) =>{
    var pythonProcess = spawn('python',["./ManagerFiltergrabTableColumns.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('ManagerSearchEmployeeAccountGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/managersearchemployeeaccounts', (req,res) =>{
    const jsonObj = {
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    var pythonProcess = spawn('python',["./ManagerSearchEmployeeController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    
    if (data.toString().trim() == "No table left" || data.toString().trim() == "Failed")
    {
        console.log(data.toString())
        req.flash('message23','Failed Search')
        res.redirect('/managersearchemployeeaccounts')   
    }
    else
    {
        res.render('ManagerSearchEmployeeAccountsTableGUI',{"results": alldata}) 
    }
})
});


app.get('/manager_viewws', (req, res) => {
    var pythonProcess = spawn('python', ["./ManagerViewWorkshiftsController.py"]);
    let alldata = "";
    pythonProcess.stdout.on('data', (data) => {
        alldata += data.toString();
    });
    pythonProcess.stdout.on('end', () => {
        try {
            const jsonData = JSON.parse(alldata.trim());
            if (jsonData === "No table left") {
                req.flash('message17', 'No Table Left');
                res.render('ManagerViewWorkshiftssGUI', { message: req.flash('message17') });
            } else {
                req.flash('message17', 'Tables found');
                res.render('ManagerViewWorkshiftssGUI', { results: jsonData, message: req.flash('message17') });
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            req.flash('message17', 'Error retrieving data');
            res.render('ManagerViewWorkshiftssGUI', { message: req.flash('message17') });
        }
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
});



app.get('/manager_deletews', (req, res) => {
    var pythonProcess = spawn('python', ["./ManagerViewWorkshiftsController.py"]);
    let alldata = "";
    pythonProcess.stdout.on('data', (data) => {
        alldata += data.toString();
    });
    pythonProcess.stdout.on('end', () => {
        try {
            const jsonData = JSON.parse(alldata.trim());
            if (jsonData === "No table left") {
                req.flash('message17', 'No Table Left');
                res.render('DeleteWsGUI', { message: req.flash('message17') });
            } else {
                req.flash('message17', 'Tables found');
                res.render('DeleteWsGUI', { results: jsonData, message: req.flash('message17') });
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            req.flash('message17', 'Error retrieving data');
            res.render('DeleteWsGUI', { message: req.flash('message17') });
        }
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
});


app.post('/manager_deletews', (req,res) =>{
    const button = req.body.buttonid
    const csvArray = button.split(',')
    const jsonObj = {
        id : csvArray[0]
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    console.log(jsonObj2)
    var pythonProcess = spawn('python',["./DeletewsController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    var alldata = data.toString().trim()
    console.log(alldata)
    if (alldata == "Success")
    {
        req.flash('message4','Deleted Successfully')
        res.redirect('/manager_deletews')
        
    }
    else
    {
        req.flash('message4','Unsuccessful')
        res.redirect('/manager_deletews') 
    }
})
})

app.get('/managerapproveleave', (req, res) => {
    var pythonProcess = spawn('python', ["./ManagerViewPendingLeaveController.py"]);
    let alldata = "";
    pythonProcess.stdout.on('data', (data) => {
        alldata += data.toString();
    });
    pythonProcess.stdout.on('end', () => {
        try {
            const jsonData = JSON.parse(alldata.trim());
            if (jsonData === "No table left") {
                req.flash('message17', 'No Table Left');
                res.render('ManagerApproveLeaveGUI', { message: req.flash('message17') });
            } else {
                req.flash('message17', 'Tables found');
                res.render('ManagerApproveLeaveGUI', { results: jsonData, message: req.flash('message17') });
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            req.flash('message17', 'Error retrieving data');
            res.render('ManagerApproveLeaveGUI', { message: req.flash('message17') });
        }
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
});

app.post('/managerapproveleave', (req,res) =>{
    const button = req.body.buttonid
    const csvArray = button.split(',')
    const jsonObj = {
        id : csvArray[0]
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    console.log(jsonObj2)
    var pythonProcess = spawn('python',["./ManagerApproveLeaveController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    var alldata = data.toString().trim()
    console.log(alldata)
    if (alldata == "Success")
    {
        req.flash('message4','Approved Successfully')
        res.redirect('/managerapproveleave')
        
    }
    else
    {
        req.flash('message4','Unsuccessful')
        res.redirect('/managerapproveleave') 
    }
})
})

app.get('/managerrejectleave', (req, res) => {
    var pythonProcess = spawn('python', ["./ManagerViewPendingLeaveController.py"]);
    let alldata = "";
    pythonProcess.stdout.on('data', (data) => {
        alldata += data.toString();
    });
    pythonProcess.stdout.on('end', () => {
        try {
            const jsonData = JSON.parse(alldata.trim());
            if (jsonData === "No table left") {
                req.flash('message17', 'No Table Left');
                res.render('ManagerRejectLeaveGUI', { message: req.flash('message17') });
            } else {
                req.flash('message17', 'Tables found');
                res.render('ManagerRejectLeaveGUI', { results: jsonData, message: req.flash('message17') });
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            req.flash('message17', 'Error retrieving data');
            res.render('ManagerRejectLeaveGUI', { message: req.flash('message17') });
        }
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
});

app.post('/managerrejectleave', (req,res) =>{
    const button = req.body.buttonid
    const csvArray = button.split(',')
    const jsonObj = {
        id : csvArray[0]
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    console.log(jsonObj2)
    var pythonProcess = spawn('python',["./ManagerRejectLeaveController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    var alldata = data.toString().trim()
    console.log(alldata)
    if (alldata == "Success")
    {
        req.flash('message4','Approved Successfully')
        res.redirect('/managerrejectleave')
        
    }
    else
    {
        req.flash('message4','Unsuccessful')
        res.redirect('/managerrejectleave') 
    }
})
})


app.get('/manager_viewempleave', (req, res) => {
    var pythonProcess = spawn('python', ["./ManagerViewLeaveController.py"]);
    let alldata = "";
    pythonProcess.stdout.on('data', (data) => {
        alldata += data.toString();
    });
    pythonProcess.stdout.on('end', () => {
        try {
            const jsonData = JSON.parse(alldata.trim());
            if (jsonData === "No table left") {
                req.flash('message17', 'No Table Left');
                res.render('ManagerViewLeavesGUI', { message: req.flash('message17') });
            } else {
                req.flash('message17', 'Tables found');
                res.render('ManagerViewLeavesGUI', { results: jsonData, message: req.flash('message17') });
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            req.flash('message17', 'Error retrieving data');
            res.render('ManagerViewLeavesGUI', { message: req.flash('message17') });
        }
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
});

app.get('/manager_viewattendance', (req, res) => {
    var pythonProcess = spawn('python', ["./ManagerViewAttendanceController.py"]);
    let alldata = "";
    pythonProcess.stdout.on('data', (data) => {
        alldata += data.toString();
    });
    pythonProcess.stdout.on('end', () => {
        try {
            const jsonData = JSON.parse(alldata.trim());
            if (jsonData === "No table left") {
                req.flash('message17', 'No Table Left');
                res.render('ManagerViewAttendanceGUI', { message: req.flash('message17') });
            } else {
                req.flash('message17', 'Tables found');
                res.render('ManagerViewAttendanceGUI', { results: jsonData, message: req.flash('message17') });
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            req.flash('message17', 'Error retrieving data');
            res.render('ManagerViewAttendanceGUI', { message: req.flash('message17') });
        }
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
});

app.get('/managerfilterattendance', (req,res) =>{
    var pythonProcess = spawn('python',["./grabAttendanceTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('ManagerFilterAttendanceGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/managerfilterattendance', (req,res) =>{
    const jsonObj = {
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    var pythonProcess = spawn('python',["./ManagerFilterAttendnaceController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    
    if (data.toString().trim() == "No table left" || data.toString().trim() == "Failed")
    {
        console.log(data.toString())
        req.flash('message23','Failed Search')
        res.redirect('/managerfilterattendance')   
    }
    else
    {
        res.render('ManagerFilterAttendanceTableGUI',{"results": alldata}) 
    }
})
});

app.get('/managermanualassignemployees', (req,res) =>{
    var pythonProcess = spawn('python',["./grabShiftPreferenceController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('ManagerManualAssignEmployeesGUI',{myList, message4: req.flash('message4')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/managermanualassignemployees', (req, res) => {
    const { employeeid, date, selectedoption } = req.body;
    const dataToSend = JSON.stringify({ employeeid, date, selectedoption });
    
    // Spawn Python process and pass JSON data as argument
    const pythonProcess = spawn('python', ['./ManagerManualAssignEmployeesController.py', dataToSend])
    
    pythonProcess.stdout.on('data', (data) => {
      const result = data.toString().trim()
      if (result === 'Failed') {
        res.status(500).send('Unable to Assign workshift. Double check your values entered')
      } else {
        req.flash('message4','Assigned Successfully')
        res.redirect('/managermanualassignemployees')
      }
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error('Error from Python Script:', data.toString())
      res.status(500).send('Error from python script')
    });
});

// Create Employee leave route
app.get('/EmployeeCreateLeave', (req,res) =>{
    res.render('EmployeeCreateLeave');
})

app.post('/EmployeeCreateLeave', (req, res) => {
    const employeeId = req.session.emlpoyeeidentity
    // const myJSON = {
    //     employeeId : emlpoyeeidentity,
    //     value : req.body.value
    // }
    // const myJSON2 = JSON.stringify(myJSON)
    const { date, leavetype } = req.body;
    const dataToSend = JSON.stringify({ employeeId, date, leavetype });
    console.log("Employee identity: " + employeeId)
    console.log(dataToSend)
    // Spawn Python process and pass JSON data as argument
    const pythonProcess = spawn('python', ['./CreateEmployeeLeaveController.py', dataToSend]);
    
    pythonProcess.stdout.on('data', (data) => {
      const result = data.toString().trim();
      if (result === 'Failed EmployeeLeaveClass') {
        res.status(500).send('Unable to create leave.')
      } else {
        req.flash('message4','Leave created successfully')
        res.redirect('/employee_createLeave')
      }
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error('Error from Python Script:', data.toString())
      res.status(500).send('Error from python script')
    });
});

app.get('/employee_clockinout', (req,res) =>{
    res.render('EmployeeClockinClockOutGUI')
})

app.get('/employeeclockin', (req,res) =>{
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()
    console.log(currentTime)
    res.render('EmployeeClockInGUI', { currentDate, currentTime, message6: req.flash('message6') })
})

app.post('/employeeclockin', (req, res) => {
    // Get current date and time
    ssn = req.session
    employeeid = req.session.emlpoyeeidentity
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()
    const clockInTime = new Date().toLocaleString()
    console.log(currentDate)
    console.log(currentTime)
    shiftid = req.body.shiftid
    const dataToSend = JSON.stringify({ employeeid, currentDate, currentTime, shiftid });

    // Send the current time as a response
    const pythonProcess = spawn('python', ['./EmployeeClockInController.py', dataToSend]);

    let outputData = '';

    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        req.flash('message6', null);
        if (code === 0) {
            console.log(outputData.trim())
            if (outputData.trim() === '') {
                req.flash('message6', 'Clocked In At: ' + clockInTime)
                res.redirect(`employeeclockin`);
            } else {
                req.flash('message6', 'Check that you are assigned to the correct shift or you have clock out of all shifts.')
                res.redirect(`employeeclockin`);
            }
        } else {
            console.error('Python process exited with code:', code);
            res.redirect(`employeeclockin?error=Error from python script`);
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Error from Python Script:', data.toString());
        res.redirect(`employeeclockin?error=Error from python script`);
    });
});

app.get('/employeeclockout', (req,res) =>{
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()
    console.log(currentTime)
    res.render('EmployeeClockOutGUI', { currentDate, currentTime, message5: req.flash('message5') })
})

app.post('/employeeclockout', (req, res) => {
    // Get current date and time
    ssn = req.session
    employeeid = req.session.emlpoyeeidentity
    const currentTime = new Date().toLocaleTimeString()
    const clockInTime = new Date().toLocaleString()
    console.log(currentTime)
    shiftid = req.body.shiftid
    const dataToSend = JSON.stringify({ employeeid, currentTime });

    // Send the current time as a response
    const pythonProcess = spawn('python', ['./EmployeeClockOutController.py', dataToSend]);

    let outputData = '';

    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        req.flash('message5', null);
        if (code === 0) {
            console.log(outputData.trim())
            if (outputData.trim() === 'Clock-out time updated successfully.') {
                req.flash('message5', 'Clocked Out At: ' + clockInTime)
                res.redirect(`employeeclockout`);
            } else {
                req.flash('message5', 'Check That you have clocked in before.')
                res.redirect(`employeeclockout`);
            }
        } else {
            console.error('Python process exited with code:', code);
            res.redirect(`employeeclockout?error=Error from python script`);
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Error from Python Script:', data.toString());
        res.redirect(`employeeclockout?error=Error from python script`);
    });
});


app.get('/employee_viewall', (req, res) => {
    const employeeId = req.session.emlpoyeeidentity;
    const dataToSend = JSON.stringify({ employeeId });
    var pythonProcess = spawn('python', ["./EmployeeViewAccountController.py", dataToSend]);
    console.log(dataToSend);
    pythonProcess.stdout.on('data', (data) => {
        try {
            var alldata = JSON.parse(data.toString());
            console.log(alldata);
        } catch (error) {
            console.log(alldata);
        }
        if (data.toString().trim() == "No table left") {
            req.flash('message17', 'No Table Left');
            res.render('EmployeeViewAccount', { message: req.flash('message17') });
        } else {
            req.flash('message17', 'Tables found');
            res.render('EmployeeViewAccount', { alldata: alldata, message: req.flash('message17') });
        }
    });
});


app.get('/manager_filterws', (req,res) =>{
    var pythonProcess = spawn('python',["./grabworkshiftsTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('FilterWsGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/manager_filterws', (req,res) =>{
    const jsonObj = {
        selectedoption : req.body.selectedoption,
        value : req.body.value
    }
    const jsonObj2 = JSON.stringify(jsonObj)
    var pythonProcess = spawn('python',["./FilterwsController.py",jsonObj2])
    pythonProcess.stdout.on('data',(data)=>{
    try{
        var alldata = JSON.parse(data.toString())
    }catch(error)
    {
        console.log(alldata)
    }
    
    if (data.toString().trim() == "No table left" || data.toString().trim() == "Failed")
    {
        console.log(data.toString())
        req.flash('message23','Failed Search')
        res.redirect('/manager_filterws')   
    }
    else
    {
        res.render('ManagerFilterWorkShiftTable',{"results": alldata}) 
    }
})
});

//Update workshift
app.get('/manager_updatews', (req,res) =>{
    var pythonProcess = spawn('python',["./grabworkshiftsTableColumnsController.py"])
    pythonProcess.stdout.on('data',(data) =>{
        try{
            var myList = JSON.parse(data.toString())
            res.render('UpdateWsGUI',{myList, message: req.flash('message')})
        }catch(error){
            console.error('Error parsing JSON data:, error')
            res.status(500).send('Error parsing JSON data')
        }
    })
    pythonProcess.stderr.on('data',(data) =>{
        console.error('Error from Python Script:', data.toString())
        res.status(500).send('Error from python script')
    })
})

app.post('/manager_updatews', (req, res) => {
    const { id, selectedoption, value } = req.body;
    const myJSON = {
        id: id,
        selectedoption: selectedoption,
        value: value
    };
    const myJSON2 = JSON.stringify(myJSON);
    const pythonProcess = spawn('python', ["./UpdatewsController.py", myJSON2]);

    pythonProcess.stdout.on('data', (data) => { 
        const result = data.toString().trim();        
        // Check the result and respond accordingly
        if (result === "Failed") {
            req.flash('message', 'Unable to update WorkShift. Double check your values entered');
        } else {
            req.flash('message', 'WorkShift Updated');
        }      
        // Redirect back to the same page
        res.redirect('/manager_updatews');
    });

    // Handle errors from the Python process
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        req.flash('message', 'Error updating WorkShift');
        res.redirect('/manager_updatews');
    });
});












//Listening to port 3000
app.listen(port, () => console.info('Listening on port ',port))