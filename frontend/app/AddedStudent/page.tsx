'use client'
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";

const Students = () => {
  const {id} = useParams();
  const [users, setUsers] = useState([
    {
      id,
      name: "",
      email: "",
      username: "",
      password: "",
    }
  ]);

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    axios.get('http://localhost:8000/api/students')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching students:", error);
      });
  }

  const deleteUser = (id: string | number) => {
    axios.delete(`http://localhost:8000/api/delete/${id}`)
      .then((response) => {
        console.log(response.data);
        getUsers();
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Student List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((student, index) => (
            <TableRow key={index}>
              <TableCell>{student.id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.username}</TableCell>
              <TableCell>{student.password}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Link href={`/Edit/${student.id}`}>Edit</Link>
                  </Button>
                  <Button onClick={() => deleteUser(student.id)} variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Students;
