import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
import { useQuery, useMutation, useQueryClient } from "react-query";
import Header from "../components/Header";

export default function TaskList() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const queryClient = useQueryClient();

  const {
    data: tasks,
    error,
    isLoading,
  } = useQuery("tasks", async () => {
    const response = await fetch(`${baseUrl}/tasks`);
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

  const deleteMutation = useMutation(
    async (id) => {
      const response = await fetch(`${baseUrl}/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
      },
    }
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
                    <Link
                      to={`/tasks/${task.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Button>View</Button>
                    </Link>
                    <Link
                      to={`/tasks/${task.id}/edit`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Button>Update</Button>
                    </Link>
                    <Button
                      sx={{ backgroundColor: "red", color: "white" }}
                      onClick={() => deleteMutation.mutate(task.id)}
                    >
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
