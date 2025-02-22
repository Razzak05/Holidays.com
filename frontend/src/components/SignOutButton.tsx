import { useMutation, useQueryClient } from "@tanstack/react-query"; // Add useQueryClient
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

type MutationError = {
  message: string;
};

const SignOutButton = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient(); // Add this
  const mutation = useMutation<void, MutationError>({
    mutationFn: apiClient.signOut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] }); // Invalidate query
      showToast({ message: "Logout Successful!", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  return (
    <button
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Signing Out..." : "Sign Out"}
    </button>
  );
};

export default SignOutButton;
