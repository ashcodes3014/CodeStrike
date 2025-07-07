const mongoose = require('mongoose');
const {Schema} = mongoose;

const submissionSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    problemId:{
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required:true
    },
    code:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:['c++',"java","javascript"]
    },
    status:{
        type:String,
        enum:['pending','accepted','wrong','error'],
        default: 'pending'
    },
    runtime:{
        type:Number,
        default: 0
    },
    memory:{
        type:Number,
        default: 0
    },
    errorMessage:{
        type:String,
        default: ''
    },
    testcasePassed:{
        type:Number,
        default: 0
    },
    totaltestcased:{
        type:Number,
        default: 0
    },

},{
    timestamps:true
});


const Submission = mongoose.model("submission",submissionSchema);

module.exports = Submission;