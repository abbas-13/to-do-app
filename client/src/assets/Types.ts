import type { Dispatch, SetStateAction } from "react";
import type { SubmitHandler } from "react-hook-form";

export interface ToDoState {
  _id: string;
  isChecked: boolean;
  list: string;
  toDoName: string;
  date: string;
  notes: string;
  time: string;
  priority: string;
  dateCreated: Date;
}

export interface ListsStateType {
  _id: string;
  name: string;
}

export interface ListsContextType {
  lists: ListsStateType[];
  setLists: Dispatch<SetStateAction<ListsStateType[]>>;
  selectList: (id: string, name: string) => void;
  selectedList: ListsStateType;
  setSelectedList: Dispatch<SetStateAction<ListsStateType>>;
  fetchToDoLists: () => void;
  addList: () => void;
  createList: (name: string, id: string) => void;
  deleteList: (id: string) => void;
}

export interface TToDoContext {
  toDos: ToDoState[];
  setToDos: Dispatch<SetStateAction<ToDoState[]>>;
  fetchToDos: (id: string) => void;
  checkToDo: (toDoId: string, isChecked: boolean) => void;
  deleteToDo: (toDoId: string) => void;
  createToDo: (data: ToDoFormInput) => void;
  updateToDo: (toDoId: string, data: ToDoFormInput) => void;
}

export interface ToDoFormInput {
  toDoName: string;
  notes: string;
  date: Date;
  time: string;
  priority: string;
}
export interface SearchBarProps {
  lists: ListsStateType[];
  setSearchResult: Dispatch<SetStateAction<ListsStateType[]>>;
  input: string;
  setInput: (arg0: string) => void;
}

export interface ToDoFormProps {
  onSubmit: SubmitHandler<ToDoFormInput>;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  data?: ToDoState;
}

export interface ToDoItemProps {
  data: ToDoState;
}

export interface ToDoListProps {
  list: ListsStateType;
  deleteList: (arg0: string) => void;
  createList: (arg0: string, arg1: string) => void;
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  displayName: string;
}

export interface UserContextType {
  user: UserType | null;
  logOut: () => void;
}
