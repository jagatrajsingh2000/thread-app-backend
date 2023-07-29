import UserService, { createUserPayload, getUserTokenPayload } from "../../services/user"


const queries = {
    getUserToken: async (
      _: any,
      payload: getUserTokenPayload
    ) => {
      const token = await UserService.getUserToken({
        email: payload.email,
        password: payload.password,
      });
      return token;
    },
    getCurrentLoggedInUser: async (_: any, parameter: any, context: any) => {
      if(context && context.user){
        const id = context.user.id;
        const user = await UserService.getUserById(id);
        return user;
      }
      throw new Error("I dont know who are you")
    },
  };
const mutations = {
    createUser: async (_: any, payload: createUserPayload) => {
        const res = await UserService.createUser(payload);
        return res.id;
      },
}

export const resolvers = { queries, mutations}