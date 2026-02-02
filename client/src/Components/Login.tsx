import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

export const Login = () => {
  return (
    <div className="h-screen bg-background flex justify-center items-center">
      <Card className="flex items-center flex-col w-[300px] bg-secondary! dark:bg-[#1a202c] py-4 pb-8">
        <div className="flex gap-2 items-center">
          <img src="/check.png" width={40} />
          <h1 className="bg-gradient-to-r from-[#2097F3] to-[#60B4F5] bg-clip-text text-transparent text-transparent text-[42px] text-balance font-extrabold">
            To-Do
          </h1>
        </div>
        <div className="border mt-2 border-gray-200 w-11/12"></div>
        <h2 className="scroll-m-20 p-4 text-sm font-[400] text-ring tracking-tight first:mt-0">
          Please sign in to continue
        </h2>
        <form className="flex flex-col gap-4 items-center w-4/5 px-4">
          <div className="flex flex-col gap-1 w-full">
            <label>Email</label>
            <Input className="dark:bg-gray-200" />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label>Password</label>
            <Input className="dark:bg-gray-200" />
          </div>
          <Button
            className="bg-[#2097f3] w-full h-[40px] text-[16px] cursor-pointer hover:bg-[#FFFFFF] hover:border-2 hover:border-[#2097f3] active:bg-[#2097f3] active:text-white hover:text-black active:outline-2 active:outline-[#85C7F8] hover:shadow-lg active:shadow-none active:border-1 active:border-white text-white"
            variant="outline"
          >
            Sign In
          </Button>
          <a
            href={`${import.meta.env.VITE_API_URL}/auth/google`}
            className="text-[16px] rounded-md! w-full max-h-[40px] cursor-pointer hover:bg-[#FFFFFF]! dark:bg-[#EEEEEE] dark:hover:bg-white! dark:text-black border-2 dark:border-[#EEEEEE] dark:hover:border-2 dark:hover:border-[#EEEEEE]! dark:active:bg-[#EEEEEE]! dark:active:outline-2 dark:active:outline-white flex items-center gap-2 rounded-sm p-2 px-3"
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
        </form>
      </Card>
    </div>
  );
};
