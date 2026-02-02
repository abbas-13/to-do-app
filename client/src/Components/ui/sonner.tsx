import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group bg-[#FAFBFF]! rounded-lg! border-1! shadow-lg",
          description:
            "group-data-[type=error]:text-red-600! group-data-[type=success]:text-green-600! group-data-[type=warning]:text-orange-500! group-data-[type=info]:text-blue-600!",
          title:
            "group-data-[type=error]:text-red-600! group-data-[type=success]:text-green-600! group-data-[type=warning]:text-orange-500! group-data-[type=info]:text-blue-600! font-medium",
          icon: "group-data-[type=error]:text-red-500 group-data-[type=success]:text-green-500 group-data-[type=warning]:text-orange-400 group-data-[type=info]:text-blue-500",
          actionButton:
            "hover:bg-[#2097f3]/90 border-2! group-data-[type=error]:text-red-600! group-data-[type=success]:text-green-500! group-data-[type=warning]:text-orange-400! group-data-[type=info]:text-blue-600! group-data-[type=error]:border-red-500! group-data-[type=success]:border-green-600! group-data-[type=warning]:border-orange-400! group-data-[type=info]:border-blue-600! text-white",
          cancelButton: "bg-gray-200 hover:bg-gray-300",
          closeButton: "text-gray-500 hover:text-gray-900",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
