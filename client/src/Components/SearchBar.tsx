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
        className="bg-bone/95 border-transparent text-ink placeholder:text-dusty-mauve focus-visible:ring-magenta"
        id="outlined-basic"
        placeholder="Search"
        value={input}
        onChange={handleInputChange}
      />
    </form>
  );
};
