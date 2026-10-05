import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { toast } from "sonner";
import { AuthContext } from "@/Context/AuthContext";
import { Logo } from "@/Components/Logo";

export interface SignUpForm {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>();
  const [showPassword, setShowPassword] = useState({
    pwd: false,
    confirmPwd: false,
  });

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      await refreshUser();
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      if (errorMessage === "User already exists") {
        toast.error(errorMessage, {
          position: "top-center",
          action: {
            label: "Login",
            onClick: () => navigate("/login"),
          },
        });
      }
      console.error("Sign up failed", errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center items-center px-4 py-10">
      <Card className="flex items-center flex-col w-[360px] bg-petal dark:bg-card border-border pt-6 pb-8">
        <Logo size={40} wordmarkClassName="text-foreground text-[42px]" />
        <div className="border-t border-border mt-2 w-11/12"></div>
        <h2 className="scroll-m-20 p-4 text-sm font-[400] text-muted-foreground tracking-tight first:mt-0">
          Please sign up to continue
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 items-center w-4/5 px-4"
        >
          <div className="flex flex-col w-full">
            <label>Email</label>
            <Input
              {...register("email", {
                required: "Please enter email",
              })}
              type="text"
              name="email"
              placeholder="enter your email"
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p className="text-xs text-red-500 mt-1 text-center">
                  {message}
                </p>
              )}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Name</label>
            <Input
              {...register("name", {
                required: "Please enter your name",
              })}
              type="text"
              name="name"
              placeholder="enter your name"
            />
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="text-xs text-red-500 mt-1 text-center">
                  {message}
                </p>
              )}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Password</label>
            <InputGroup className="gap-2 mt-2">
              <InputGroupInput
                {...register("password", {
                  required: "Please enter a password of at least 8 characters",
                  minLength: 8,
                })}
                placeholder="enter a password"
                type={showPassword.pwd ? "text" : "password"}
                name="password"
              />
              <InputGroupAddon
                align="inline-end"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    pwd: !prev.pwd,
                  }))
                }
              >
                {showPassword.pwd ? (
                  <EyeIcon className="cursor-pointer" />
                ) : (
                  <EyeOffIcon className="cursor-pointer" />
                )}
              </InputGroupAddon>
            </InputGroup>
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => (
                <p className="text-xs text-red-500 mt-1 text-center">
                  {message}
                </p>
              )}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Confirm Password</label>
            <InputGroup className="gap-2 mt-2">
              <InputGroupInput
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "Passwords do no match";
                    }
                  },
                })}
                placeholder="confirm your password"
                type={showPassword.confirmPwd ? "text" : "password"}
                name="confirmPassword"
              />
              <InputGroupAddon
                align="inline-end"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    confirmPwd: !prev.confirmPwd,
                  }))
                }
              >
                {showPassword.confirmPwd ? (
                  <EyeIcon className="cursor-pointer" />
                ) : (
                  <EyeOffIcon className="cursor-pointer" />
                )}
              </InputGroupAddon>
            </InputGroup>
          </div>
          <ErrorMessage
            errors={errors}
            name="confirmPassword"
            render={({ message }) => (
              <p className="text-xs text-red-500 mt-1 text-center">{message}</p>
            )}
          />

          <Button className="w-5/6 mt-2 h-[42px] text-[15px]" type="submit">
            Sign Up
          </Button>
        </form>
        <a
          href={"/login"}
          className="text-sm underline mt-4 font-medium cursor-pointer underline-offset-2 text-magenta tracking-tight first:mt-0"
        >
          Already have an account? Sign in here
        </a>
      </Card>
    </div>
  );
};
