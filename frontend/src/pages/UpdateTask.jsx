import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import Header from "../components/Header";

export default function UpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: task,
    error,
    isLoading,
  } = useQuery(["task", id], async () => {
    const response = await fetch(`http://127.0.0.1:3000/tasks/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
  }, [task]);

  const updateTaskMutation = useMutation(
    async (updatedTask) => {
      const response = await fetch(`http://127.0.0.1:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["task", id]);
        navigate("/");
      },
    }
  );

  const deleteTaskMutation = useMutation(
    async () => {
      const response = await fetch(`http://127.0.0.1:3000/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
        navigate("/");
      },
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    updateTaskMutation.mutate({ title, description, status });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          Update Task
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="ID"
            value={task.id}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteTaskMutation.mutate()}
          >
            Delete
          </Button>
        </Box>
      </Container>
    </>
  );
}
