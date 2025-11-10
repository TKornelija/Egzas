import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "admin", "editor"], default: "admin", index: true },
    isActive: { type: Boolean, default: true, index: true },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "admin_users" }
);

AdminUserSchema.methods.setPassword = async function (pwd) {
  this.passwordHash = await bcrypt.hash(pwd, 12);
};
AdminUserSchema.methods.verifyPassword = function (pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

export const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
