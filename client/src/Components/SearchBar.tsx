import { Input } from "@/Components/ui/input";
import type { SearchBarProps } from "@/assets/Types";

export const SearchBar = ({
  lists,
  setSearchResult,
  input,
  setInput,
}: SearchBarProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const searchList = (query: string) => {
    const resultList = lists.filter(
      (list) => list.name.toLowerCase() === query.toLowerCase().trim(),
    );
    if (input) {
      setSearchResult(resultList);
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchList(input);
  };

  return (
    <form
      className="flex m-2 items-center justify-center"
      onSubmit={handleSearch}
    >
      <Input
        className="dark:bg-gray-200! dark:text-black! dark:placeholder:text-gray-500"
        id="outlined-basic"
        placeholder="Search"
        value={input}
        onChange={handleInputChange}
      />
    </form>
  );
};
