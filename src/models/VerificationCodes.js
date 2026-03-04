import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true
    },
    codeHash: {
      type: String,
      required: true,
      select: false
    },
    type: {
      type: String,
      enum: ["email_verification", "password_reset", "two_factor"],
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("VerificationCode", verificationCodeSchema);
