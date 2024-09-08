const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const User=require("../models/user.js");


main().then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map(((obj)=>({...obj,owner:'66a28269d933a5b3ae1090eb'})));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}


// User.find({}).then((res)=>{
//     console.log(res);
// })

initDB();