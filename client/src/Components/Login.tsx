import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { toast } from "sonner";

import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { AuthContext } from "@/Context/AuthContext";
import { Logo } from "@/Components/Logo";

interface SignInForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInForm>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "Invalid email or password", {
          position: "top-center",
        });
        return;
      }

      await refreshUser();
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center items-center px-4 py-10">
      <Card className="flex items-center flex-col w-[320px] bg-petal dark:bg-card border-border pt-6 pb-6">
        <Logo size={40} wordmarkClassName="text-foreground text-[42px]" />
        <div className="border-t border-border mt-2 w-11/12"></div>
        <h2 className="scroll-m-20 p-4 text-sm font-[400] text-muted-foreground tracking-tight first:mt-0">
          Please sign in to continue
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 items-center w-4/5 px-4 pb-4"
        >
          <div className="flex flex-col gap-1 w-full">
            <label>Email</label>
            <Input
              {...register("email", {
                required: "Please enter your email",
              })}
              type="email"
              name="email"
              placeholder="enter email"
            />
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
          <div className="flex flex-col gap-1 w-full">
            <label>Password</label>
            <InputGroup className="gap-2 mt-2">
              <InputGroupInput
                {...register("password", {
                  required: "Please enter a password of at least 8 characters",
                  minLength: 8,
                })}
                placeholder="enter a password"
                type={showPassword ? "text" : "password"}
                name="password"
              />
              <InputGroupAddon
                align="inline-end"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
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
          <Button type="submit" className="w-full h-[42px] text-[15px]">
            Sign In
          </Button>
        </form>
        <div className="flex flex-col gap-4 items-center w-4/5 px-4">
          <a
            href={`/auth/google`}
            className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[26px] border border-border bg-bone px-4 text-[15px] font-medium text-foreground transition-colors hover:bg-accent dark:bg-transparent"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              // xmlns:xlink="http://www.w3.org/1999/xlink"
              style={{ display: "block", width: "22px" }}
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign in with Google
          </a>
          <a
            className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[26px] border border-border bg-bone px-4 text-[15px] font-medium text-foreground transition-colors hover:bg-accent dark:bg-transparent"
            href={"/auth/github"}
          >
            <svg
              style={{ width: "24px" }}
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="134 105 40 40"
            >
              <path
                fill="#1a1414"
                d="M152.61,107.44a16.29,16.29,0,0,0-5.15,31.75c.81.15,1.11-.35,1.11-.79s0-1.41,0-2.77c-4.53,1-5.49-2.18-5.49-2.18a4.31,4.31,0,0,0-1.81-2.38c-1.48-1,.11-1,.11-1a3.42,3.42,0,0,1,2.5,1.68,3.47,3.47,0,0,0,4.74,1.35,3.48,3.48,0,0,1,1-2.18c-3.62-.41-7.42-1.81-7.42-8.05a6.3,6.3,0,0,1,1.68-4.37,5.86,5.86,0,0,1,.16-4.31s1.37-.44,4.48,1.67a15.44,15.44,0,0,1,8.16,0c3.11-2.11,4.48-1.67,4.48-1.67a5.85,5.85,0,0,1,.16,4.31,6.29,6.29,0,0,1,1.67,4.37c0,6.26-3.81,7.63-7.44,8a3.89,3.89,0,0,1,1.11,3c0,2.18,0,3.93,0,4.47s.29.94,1.12.78a16.29,16.29,0,0,0-5.16-31.74Z"
              />
            </svg>
            Sign in with GitHub
          </a>
        </div>
        <a
          href={"/signup"}
          className="text-sm underline mt-4 font-medium cursor-pointer underline-offset-2 text-magenta tracking-tight first:mt-0"
        >
          New user? Sign up here
        </a>
      </Card>
    </div>
  );
};
