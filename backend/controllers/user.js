const User = require("../models/users");
const jwt = require("jsonwebtoken");


const createJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

const filterDeleted = (tasks)=>{
    const fTasks=[];
    tasks.map(task=>{
        if(task.is_deleted == false){
            fTasks.push(task);
        }
    })
    return fTasks;
}

//authentication
module.exports.login_post = async (req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);
       
        const jwtToken = createJWT(user._id);
       
        res.status(200).json({ 
            message: "Login successful!",
            jwt: jwtToken
        });
    }catch(err){
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

//registration for new user
module.exports.register_post = async (req,res)=>{
    try{
        const {first_name,last_name,email,password,conf_password} = req.body;
        if(password != conf_password) throw Error("Passwords must match");
        
        const user = new User({
            first_name:first_name,
            last_name:last_name,
            email:email,
            password:password,
        });

        user.password = await User.hashPassword(user.password);
        await user.save();
        const jwtToken = createJWT(user._id);
        
        res.status(201).json({ 
            message: "Registration Successful",
            jwt:jwtToken
        });
    }catch(err){
        console.log(err);
        res.send({"error":err.message});
    }
}

//get task details
module.exports.tasks_post = async (req,res)=>{
    const user = await User.findById(res.user.id);

    const tasks = filterDeleted(user.tasks);
    res.send(tasks);
}

//add new tasks
module.exports.add_task_post = async (req,res)=>{
    const user = await User.findById(res.user.id);

    user.tasks.push({
        name:req.body.task_name
    });
    await user.save();

    const tasks = filterDeleted(user.tasks);
    res.send(tasks);
}

//change task status
module.exports.change_status_post = async (req,res)=>{
    
    console.log(req.body);
    const user = await User.findById(res.user.id);
    user.tasks.map(task=>{
        if(task.id  == req.body.task_id){
            task.is_completed=req.body.status;
            return;
        }
    })
    await user.save();
    
    const tasks = filterDeleted(user.tasks);
    res.send(tasks);
}

//delete any tazsk
module.exports.delete_task_post = async (req,res)=>{
    console.log(req.body);
    const user = await User.findById(res.user.id);
    user.tasks.map(task=>{
        if(task.id == req.body.task_id){
            task.is_deleted = true;
            return;
        }
    })
    await user.save();
    console.log(user.tasks);

    const tasks = filterDeleted(user.tasks);
    res.send(tasks);
}