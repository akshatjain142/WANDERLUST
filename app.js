if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
};

const express=require("express");
const mongoose=require("mongoose");
const app=express();
const port=8080;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expressError = require("./utils/expressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const dbURL=process.env.ATLAS_URL

const store=MongoStore.create({
    mongoUrl:dbURL,
    cryto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("Error",()=>{
    console.log("ERROR-MONGOOSE SESSION STORE",err);
});

let sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        "maxAge":7*24*60*60*1000,
        httpOnly:true
    }
};

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

async function main(){
    await mongoose.connect(dbURL);
}
main().then((res)=>{
    console.log("connection successful")
})
.catch((err)=>{
    console.log(err);
});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", (req, res) => {
    res.render("home");
});

//error handler
app.use((req,res,next)=>{
    next(new expressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="some error occured"}=err;
    res.status(status).render("error.ejs",{message});
});


//app listening
app.listen(port,()=>{
    console.log(`listening on port 8080`);
});



