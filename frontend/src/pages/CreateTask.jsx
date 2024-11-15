import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import Header from "../components/Header";

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const createTaskMutation = useMutation(
    async (newTask) => {
      const response = await fetch(`${baseUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
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
    createTaskMutation.mutate({ title, description });
  };

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          Create Task
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </Container>
    </>
  );
}
