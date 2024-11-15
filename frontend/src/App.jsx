import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskList from "./pages/TaskList";
import CreateTask from "./pages/CreateTask";
import ViewTask from "./pages/ViewTask";
import UpdateTask from "./pages/UpdateTask";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/create" element={<CreateTask />} />
        <Route path="/tasks/:id" element={<ViewTask />} />
        <Route path="tasks/:id/edit" element={<UpdateTask />} />
      </Routes>
    </Router>
  );
}

export default App;
