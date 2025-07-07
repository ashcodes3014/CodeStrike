const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailID:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true,
        immutable: true,
    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default: 'user'
    },
    problemSolved: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Problem',
          unique:true
        }
      ],
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
});


const User = mongoose.model("user",userSchema);

userSchema.post('findOneAndDelete',async (user) =>{
    if(user){
        await mongoose.model('submission').deleteMany({userId:user._id});
    }
})

// runs when findOneAndDelete opertion will works in our mongoDB
// pre -> runs first  // post -> after


module.exports = User;