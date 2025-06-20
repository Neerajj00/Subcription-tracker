import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
        minLength:4,
        maxLength:30,
    },
    price:{
        type:Number,
        required:[true, "subscription price is required"],
        min:[0,"Price must be greater than 0"],
    },
    currency:{
        type:String,
        enum:['USD','IND','EUR'],
        default:['USD']
    },
    frequency:{
        type:String,
        enum:['daily','weekly','monthly','yearly'],
    },
    category:{
        type:String,
        enum:['sports','news','entertainment','lifestyle','technology','finance','politics','other'],
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:['active','cancelled','expired'],
        defualt:'active'
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator:(value) => value <= new Date(),
            message: "start date must be in the past",
        }
    },
    renewalDate:{
        type:Date,
        validate:{
            validator:function (value){ return value > this.startDate },
            message: "renewal date must be after start date",
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true,
    }

},{timestamps:true})

subscriptionSchema.pre('save',function(next){
    if(!this.renewalDate){
        const renewalPeriod = {
            daily : 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        this.renewalDate = new Date(this.startDate); // set renewal date to start date
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]); // add the frequency period to the start date

    }
    // Check if renewal date is in the past and set status accordingly
    if(this.renewalDate < new Date()){
        this.status = 'expired'; // if renewal date is in the past, set status to expired
    }

    next();
})

export default mongoose.model('SubscriptionModel', subscriptionSchema);