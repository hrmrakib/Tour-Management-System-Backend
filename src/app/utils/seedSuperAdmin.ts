import appConfig from "../config/env";
import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";
import { IAuthProvider, IsActive, Role } from "../modules/user/user.interface";

const seedSuperAdmin = async () => {
  const isSuperAdminEmail = appConfig.SUPER_ADMIN_EMAIL;

  const isSuperAdminExist = await User.findOne({ email: isSuperAdminEmail });

  if (isSuperAdminExist) {
    console.log("Super admin already exist");
    return;
  }

  const hashPassword = await bcrypt.hash(
    appConfig.SUPER_ADMIN_PASSWORD,
    appConfig.BCRYPT_SALT_ROUNDS
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: appConfig.SUPER_ADMIN_EMAIL as string,
  };

  const superAdmin = await User.create({
    name: "Super Admin",
    email: appConfig.SUPER_ADMIN_EMAIL,
    password: hashPassword,
    role: Role.SUPER_ADMIN,
    isActive: IsActive.ACTIVE,
    isVarified: true,
    auths: [authProvider],
  });

  console.log("✅ Super admin created successfully!");

  return superAdmin;
};

export default seedSuperAdmin;
