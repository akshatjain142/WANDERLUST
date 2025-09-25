const mongoose=require("mongoose");
let Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
       url:{
        type:String,
        required:true}
        ,
       filename:String
    },
    location:{
        type:String
    },
    price:{
        type:Number
    },
    country:{
        type:String
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:Review
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        },
    },
    category:{
        type:String,
        enum:["Trending","Mountains","Rooms","Iconic Cities","Domes","Arctic","Amazing Pools","Farms","Camping","Boats","Castles"],
        required:true
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;