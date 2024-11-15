import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { useQuery } from "react-query";
import Header from "../components/Header";

export default function TaskList() {
  const {
    data: tasks,
    error,
    isLoading,
  } = useQuery("tasks", async () => {
    const response = await fetch("http://127.0.0.1:3000/tasks");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

  const [statusFilter, setStatusFilter] = useState("");

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredTasks = useMemo(
    () =>
      statusFilter
        ? tasks?.filter((task) => task.status === statusFilter)
        : tasks || [],
    [statusFilter, tasks]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <>
      <Header />
      <Container>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          Task List
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="in progress">In Progress</MenuItem>
          </Select>
        </FormControl>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <Button>Update</Button>
                    <Button sx={{ backgroundColor: "red", color: "white" }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
