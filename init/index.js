const mongoose=require("mongoose");
let initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then((res)=>{
    console.log("connection successful")
})
.catch((err)=>{
    console.log(err);
});

async function initDb(){
    await Listing.deleteMany({});
    initData.data=initData.data.map((ele)=>({
        ...ele,owner:'68c83ae4c0fafe12ee4e2cb8'
    }))
    await Listing.insertMany(initData.data);
    console.log("db initialised");
};
initDb();
