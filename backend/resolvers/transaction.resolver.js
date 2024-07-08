import Transaction from '../models/transactionModel.js'
import User from '../models/userModel.js';

const transactionResolver = {
    Query:{
        transactions:async(p, a, context) =>{
            try {
                if(!context.getUser()) throw new Error("Unauthorised");
                const userId = await context.getUser()._id;a

                const transactions = await Transaction.find({userId});
                console.log(userId);
                return transactions;
            } catch (error) {
                console.log("Error getting transactions:", error);
                throw new Error(error.message || "internal server error");
            
            }
        },
        transaction: async(_, {transactionId}) => {
            try {
                const transaction = await Transaction.findById(transactionId);
            return transaction;
            } catch (error) {
                console.log("Error getting transaction:", error);
                throw new Error(error.message || "internal server error");
            
            }
            
        },
        categoryStatistics: async(_, a, context)=>{
            if(!context.getUser()) throw new Error("Unauthorised");
            const userId = context.getUser()._id;
            const transactions = await Transaction.find({userId});
            const categoryMap = {};

            transactions.forEach((transaction) => {
                if(!categoryMap[transaction.category])
                    {
                        categoryMap[transaction.category] = 0;
                    }
                    categoryMap[transaction.category] += transaction.amount;
            });
            
            return Object.entries(categoryMap).map(([category, totalAmount]) => ({category, totalAmount}));
        }
    },
    Mutation: {
        createTransaction: async(_, {input}, context) => {
           try {
            const newTransaction = new Transaction({
                ...input,
                userId: context.getUser()._id
            });
            await newTransaction.save();
            return newTransaction;
           } catch (error) {
            console.log("Error in creating transaction:", error);
            throw new Error(error.message || "internal server error");
        
           }
        },
        updateTransaction: async(_, {input}) => {
            try {
              
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true});
                
                return updatedTransaction
            } catch (error) {
                console.log("Error updating transaction:", error);
                throw new Error(error.message || "internal server error");
            
            }
        },
        deleteTransaction: async(_, {transactionId}) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (error) {
                console.log("Error deleting transaction:", error);
                throw new Error(error.message || "internal server error");
            
            }
        }
    },
    Transaction:{
        user: async(parent) => {
            const userId = parent.userId;
            try {
                const user = await User.findById(userId);
                return user;
            } catch (error) {
                console.log("Error in transaction.user resolver:", error);
                throw new Error(error.message || "internal server error");
            
            }
        }
    }
}

export default transactionResolver;