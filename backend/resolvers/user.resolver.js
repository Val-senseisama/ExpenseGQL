import { users } from '../dummyData/data.js'

const userResolver ={
    Query: {
        users: () => {
            return users
        },
        user: (_, {userId}) =>{
            return users.find((u) => userId === u._id)
        }
    },
    Mutation: {}

}

export default userResolver