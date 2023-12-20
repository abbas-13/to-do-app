export const ToDo = () => {
  return (
    <div className="bg-gray-200 rounded-lg w-full m-2 p-2">
      <div className=" relative w-100%">
        <input type="checkbox" />
        <label className="font-semibold ml-2"> to-do Name</label>
        <label className="absolute mr-2 inset-y-0 right-0"> Date</label>
      </div>
      <p className="text-sm m-2 ml-6"> Content</p>
    </div>
  );
};
