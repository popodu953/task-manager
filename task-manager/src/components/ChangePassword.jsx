import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ModalWrapper from "./ModalWrapper";
import { DialogTitle } from "@headlessui/react";
import Textbox from "./Textbox";
import Button from "./Button";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";

const ChangePassword = ({ open, setOpen }) => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  const submitHandler = async (data) => {
    try {
      const result = await changePassword({
        // currentPassword: data.currentPassword, // Commented out - not required in UI
        currentPassword: "dummy", // Temporary dummy value since server still expects it
        newPassword: data.newPassword,
      });

      if (result.data.status) {
        toast.success("Password changed successfully");
        reset();
        setOpen(false);
      } else {
        toast.error(result.data.message);
      }
    } catch (error) {
      console.log("Change password error:", error);
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  if (!open) return null;

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <DialogTitle
          as="h2"
          className="text-xl font-bold leading-6 text-gray-900 text-center mb-6"
        >
          Change Password
        </DialogTitle>

        <div className="space-y-4">
          {/* Current Password Field - COMMENTED OUT BUT KEPT FOR FUTURE USE */}
          {/* 
          <Textbox
            placeholder="Enter current password"
            type="password"
            name="currentPassword"
            label="Current Password"
            register={register("currentPassword", {
              required: "Current password is required",
            })}
            error={errors.currentPassword ? errors.currentPassword.message : ""}
          />
          */}

          <Textbox
            placeholder="Enter new password"
            type="password"
            name="newPassword"
            label="New Password"
            register={register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.newPassword ? errors.newPassword.message : ""}
          />

          <Textbox
            placeholder="Confirm new password"
            type="password"
            name="confirmPassword"
            label="Confirm New Password"
            register={register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            error={errors.confirmPassword ? errors.confirmPassword.message : ""}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-3 rounded-lg font-medium transition-colors"
            onClick={() => {
              reset();
              setOpen(false);
            }}
            label="Cancel"
          />
          
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center px-4 py-3">
              <span className="text-sm text-blue-600">Changing password...</span>
            </div>
          ) : (
            <Button
              label="Change Password"
              type="submit"
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition-colors"
            />
          )}
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ChangePassword;