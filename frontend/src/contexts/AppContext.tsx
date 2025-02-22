import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as apiClient from "../api-client";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

export type AppContextType = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const showToast = ({ message, type }: ToastMessage) => {
    if (type === "SUCCESS") {
      toast.success(message, { autoClose: 2000 });
    } else {
      toast.error(message, { autoClose: 2000 });
    }
  };

  // Validate token to determine if the user is logged in
  const { isError } = useQuery({
    queryKey: ["validateToken"],
    queryFn: apiClient.validateToken,
    retry: false,
  });

  return (
    <AppContext.Provider
      value={{
        showToast,
        isLoggedIn: !isError,
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
