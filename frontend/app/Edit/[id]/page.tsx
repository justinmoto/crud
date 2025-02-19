'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
const EditStudent = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  const router = useRouter();
  const [inputs,  setInputs] =useState({
    name: "",
    email: "",
    username: "",
  });
  const {id} = useParams();
  console.log(id);

  useEffect(() => {
      getUser();
    }, []);

  const getUser = async() => {
    try {
      axios.get(`http://localhost:8000/api/getuser/${id}`).then(function(response) {
        console.log(response.data[0])
        setInputs(response.data[0]);
      });
    }
    catch(err){
        console.error("Error fetching students");
    }
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target; // Now TypeScript knows it's an input element
    setInputs((values) => ({ ...values, [name]: value }));
  };
  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.put(`http://localhost:8000/api/edit/${id}`, inputs).then(function(response){
      console.log(response.data);
      router.push('/AddedStudent')
    })
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                  value={inputs.name || ''}
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
                  value={inputs.email || ''}
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
                  value={inputs.username || ''}
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
