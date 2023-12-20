import { useState } from "react";

export const SearchBar = () => {
  const [input, setInput] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    setInput(event.target.value);
  };
  return (
    <div>
      <form
        className="flex p-2 rounded-lg items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          className="rounded-xl shadow-md hover:drop-shadow-xl hover:bg-white p-2 w-96 bg-gray-100"
          value={input}
          placeholder="Search"
        />
      </form>
    </div>
  );
};
