import SubscriptionModel from '../models/subscription.model.js';

export const createSubscription =async (req, res, next) => {
    try{
        const subscription  = await SubscriptionModel.create({
            ...req.body,
            user: req.user._id,
        })

        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: subscription
        });
    }catch(error){
        next(error);
    }
}

export const getSubscriptions = async (req, res, next) => {
    try{
        if(req.user._id != req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource"
            });
        }
        const subscriptions = await SubscriptionModel.find({ user:req.user._id});

        if(!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subscriptions found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User Subscriptions retrieved successfully",
            data: subscriptions
        });
    }catch(e){
        next(e);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try{
        const subscriptions = await SubscriptionModel.find({});
        if(!subscriptions || subscriptions.length === 0){
            return res.status(404).json({
                success:false,
                message: "No subscriptions found"
            })
        }
        res.status(200).json({
            success: true,
            message: "All subscriptions retrieved successfully",
            data: subscriptions
        });
    }catch(e){
        next(e);
    }
}

export const updateSubscription = async (req, res, next) => {
    try{
        if(req.user._id != req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this subscription"
            });
        }

        const subscriptionId = req.body.subId;
        const oldData = await SubscriptionModel.findById(subscriptionId);
        if(!oldData) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }
        const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
            subscriptionId, 
            { name: req.body.name, price: req.body.price}, 
            { new: true } 
        )

        res.status(200).json({
            success: true,
            message: "Subscription updated successfully",
            data: {
                updatedSubscription : updatedSubscription,
                oldData: oldData
            }
        })

    }catch(e){
        next(e);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try{
        if(req.user._id != req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this subscription"
            });
        }
        
        const subscriptionId = req.body.subId;
        const subscription = await SubscriptionModel.findByIdAndDelete(subscriptionId);
        if(!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Subscription deleted successfully",
                data: subscription
            });
        }



    }catch(e){
        next(e);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try{
        if(req.user._id != req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this subscription"
            });
        }
        const subscriptionId = req.body.subId;
        const oldData = await SubscriptionModel.findById(subscriptionId);
        const newData = await SubscriptionModel.findByIdAndUpdate(subscriptionId,
            { status: 'cancelled' }, 
            { new: true } 
        );
        
        if(!newData) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: {
                newData: newData,
                oldData: oldData
            }
        });

    }catch(e){
        next(e);
    }
}