import { Appshell } from "./Components/Appshell";
import { ToDo } from "./Components/To-Do";

function App() {
  return (
    <div>
      <Appshell>
        <button className="m-2 shadow-md hover:drop-shadow-xl hover:bg-blue-700 p-2 w-24 rounded-lg bg-blue-500 text-white">
          Add +
        </button>
        <ToDo />
      </Appshell>
    </div>
  );
}

export default App;
