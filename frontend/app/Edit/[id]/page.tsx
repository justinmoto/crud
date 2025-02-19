"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define props explicitly
interface EditStudentProps {
  className?: string;
}

const EditStudent: React.FC<EditStudentProps> = ({ className }) => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>(); // Ensure `id` is a string
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    if (id) getUser();
  }, [id]);

  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/getuser/${id}`);
      if (response.data.length > 0) {
        setInputs(response.data[0]);
      }
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/edit/${id}`, inputs);
      router.push("/AddedStudent");
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className || ""}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={inputs.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={inputs.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={inputs.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Update Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditStudent;
