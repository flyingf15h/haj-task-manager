import { useEffect } from "react";

function NewUser() {
  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
      console.log("Generated new guest userId:", userId);
    } else {
      console.log("Existing guest userId:", userId);
    }
  }, []);
  return null; 
}

export default NewUser;
