import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Button, Container, Typography, CircularProgress } from "@mui/material";

export default function ViewTask() {
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

  const deleteMutation = useMutation(
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

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Task Details
      </Typography>
      <Typography variant="h6">ID: {task.id}</Typography>
      <Typography variant="h6">Title: {task.title}</Typography>
      <Typography variant="h6">Description: {task.description}</Typography>
      <Typography variant="h6">Status: {task.status}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`edit`)}
        sx={{ mt: 2, mr: 2 }}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteMutation.mutate()}
        sx={{ mt: 2 }}
      >
        Delete
      </Button>
    </Container>
  );
}
