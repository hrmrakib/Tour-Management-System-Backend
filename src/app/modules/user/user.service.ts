import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const {  email, ...rest } = payload;

  const isUserExist = User.findOne({email});
  const user = await User.create({
    email,
    ...rest
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  const total = await User.countDocuments();
  
  return {
    meta: { total },
    users,
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
};
