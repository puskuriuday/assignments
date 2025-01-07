const mongoose = require("mongoose");

( async () => {
    await mongoose.connect("");
    console.log("ok db connected");
})();

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const admin = new Schema({
    username : {
        type : String,
        unique : true
    },
    password : String
});

const course = new Schema({
    title : String,
    description : String,
    price : Number,
    imageLink : String,
    Published : Boolean,
    adminId : ObjectId
});

const user = new Schema({
    username : {
        type : String,
        unique : true
    },
    password : String
});

const purchasedcourse = new Schema({
    userId : ObjectId,
    courseId : ObjectId
});

const adminModel = mongoose.model("admins",admin);
const courseModel = mongoose.model("courses",course);
const userModel = mongoose.model("users",user);
const purchasedcourseModel = mongoose.model("purchasedCourses",purchasedcourse);

module.exports = {
    adminModel,
    courseModel,
    userModel,
    purchasedcourseModel
}