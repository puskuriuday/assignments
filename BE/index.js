const express = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { adminModel , courseModel, userModel ,purchasedcourseModel } = require("./db.js");

const app = express();
const jwt_pass = "458965558866255ggdsbjuy+-£_hjcc";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function auth(req,res,next){
    const token = req.headers.token;
    const validation = jwt.verify(token,jwt_pass);
    if(!validation){
        return res.json({
            msg : "relogin to your account"
        });
    }else{
        req.Id = validation.Id.toString();
        next();
    }
}


app.post('/admin/signup',async (req,res) => {
    try{
    const InputSchema = z.object({
        username : z.string().min(6).max(13),
        password : z.string().min(8).max(20)
    });
    const { username , password } = req.body;
    const validation = InputSchema.safeParse(req.body);
    const hashpassword = await bcrypt.hash(password,4);
    if(!validation.success){
        return res.json({
            msg : "invaid input "
        });
    }else{
        try{
            await adminModel.create({
            username : username,
            password : hashpassword
            });
            res.json({
                msg : "registration completed"
            });
        }catch(e){
            return res.json({
                msg : "username alredy exists"
            });
        }
    }
  }catch(e){
    res.json({
        msg : "something went wrong please try agian"
    })
  } 
});

app.post('/admin/signin',async (req,res) => {
    const { username , password } = req.body;
    const validadmin = await adminModel.findOne({
        username : username,
    });
    if(!validadmin){
        return res.json({
            msg : "username not found"
        });
    }else{
        const veritypassord = await bcrypt.compare(password,validadmin.password);
        if(!veritypassord){
            res.json({
                msg : "incorrect password"
            });
        }else{
            const token = jwt.sign({
                Id : validadmin._id,
            },jwt_pass);
            res.json({
                msg : token
            })
        }
    }
});

app.post('/admin/courses',auth,async (req,res) => {
    try{
        const validSchema = z.object({
        title : z.string().min(1).max(50),
        description : z.string(),
        price : z.number(),
        imageLink : z.string(),
        published : z.boolean(),
    });
    const verifySchema = validSchema.safeParse(req.body);
    if(!verifySchema.success){
        return res.json({
            msg : "invalid input",
        });
    }else{
        const { title , description , price , imageLink , published } = req.body;
        const adminId = req.Id;
        await courseModel.create({
            title,
            description,
            price,
            imageLink,
            published,
            adminId
        }); 
        res.json({
            msg : "course created successgully"
        });
    }
  }catch(e){
    res.json({
        msg : "something went wrong server crashed"
    });
  }
    
});

app.get('/admin/courses',auth,async (req,res) => {
    const adminId = req.Id;
    const list_of_courses = await courseModel.find({
        adminId
    });
    res.json({
        msg : list_of_courses,
    });
});

app.put('/admin/courses/:courseId',auth,async (req,res) => {
    try{
            const { courseId } = req.params;
            const adminId = req.Id;
            const course = await courseModel.findByIdAndUpdate({
                courseId,
                adminId
            },{
                title : req.body.title,
                description : req.body.description,
                price : req.body.price,
                imageLink : req.body.imageLink,
                published : req.body.published
            });
            res.json({
                msg : "course updated successfully!!"
            });
        
    }catch(e){
        res.json({
            msg : "something went wrong!!!"
        })
    }
});

app.post('/users/signup',async (req,res) => {
    try{
        const validSchema = z.object({
            username : z.string().min(1).max(10),
            password : z.string().min(8).max(25)
        });
        const validInput = validSchema.safeParse(req.body);
        if(!validInput.success){
            return res.json({
                msg : "invalid input"
            });
        }else{
            const { username , password } = req.body;
            const hashpassword = await bcrypt.hash(password,3);
            await userModel.create({
                username,
                password : hashpassword
            });
            res.json({
                msg : "user registration successfull!!"
            });
        }
    }catch(e){
        res.json({
            msg : "something went wrong"
        });
    }
});

app.post('/users/signin',async (req,res) => {
    try{
        const validInput = z.object({
            username : z.string(),
            password : z.string()
        });
        const validation = validInput.safeParse(req.body);
        if(!validation.success){
            return res.json({
                msg : "invalid input format"
            });
        }else{
            const { username , password } = req.body;
            const validUser = await userModel.findOne({
                username
            });
            if(!validUser){
                return res.json({
                    msg : "user not exists,try to signup"
                });
            }else{
                const veritypassord = await bcrypt.compare(password,validUser.password);
                if(!veritypassord){
                    return res.json({
                        msg : "wrong password"
                    });
                }else{
                    const token = jwt.sign({
                        Id : validUser._id
                    },jwt_pass);
                    res.json({
                        msg : token
                    });
                }
            }
        }
    }catch(e){
        return res.json({
            msg : "something went wrong"
        });
    }
});

app.get('/users/courses',auth,async (req,res) => {
    const courses = await courseModel.find();
    res.json({
        msg : courses
    });
});

app.post('/users/courses/:courseId',auth,async (req , res) => {
    try{
        const { courseId } = req.params;
        const validcourse = await courseModel.findOne({
            _id : courseId
        });
        if(!validcourse){
            return res.json({
                msg : "invalid course selection "
            });
        }else{
            const alredypurshased = await purchasedcourseModel.findone({
                userId : req.Id,
                courseId
            });
             if(alredypurshased){
                return res.json({
                    msg : "you alreay purchased this course"
                });
             }else{
                await purchasedcourse.create({
                    userId : req.Id,
                    courseId
                });
                res.json({
                    msg : "course purchased successfully"
                });
             }
        }
    }catch(e){
        res.json({
            msg : "something went wrong"
        });
    }
});

app.get('/users/purchasedCourses',auth,async (req,res) => {
    const userId = req.Id;
    const purchased = await purchasedcourseModel.find({
        userId
    });
    let courses = [];
    for(let i = 0 ; i < purchased.length ; i++){
        const course = await courseModel.findone({
            _id : purchased[i].courseId
        });
        courses.push(course);
    }
    res.json({
        msg : courses
    });
});

app.listen(3000);