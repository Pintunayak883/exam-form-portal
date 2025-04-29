"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { useEffect } from "react";
import { fetchUsers, updateUserStatus } from "@/redux/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define User type here
type User = {
  id: string;
  name: string;
  aadhaarNo: string;
  phone: string;
  currentDate: string;
  status: "pending" | "approve" | "reject";
};

// Admin Dashboard Component
export default function AdminDashboard() {
  const dispatch = useDispatch<typeof store.dispatch>();

  // Redux State Se Users aur loading/error le lo
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    // Component mount par user data fetch karo
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle status update
  const handleStatusUpdate = (id: string, status: "approve" | "reject") => {
    dispatch(updateUserStatus({ id, status }));
  };

  // Status ke base pe counts nikaalna
  const total = users.length;
  const approved = users.filter((u) => u.status === "approve").length;
  const pending = users.filter((u) => u.status === "pending").length;
  const rejected = users.filter((u) => u.status === "reject").length;
  const router = useRouter();
  return (
    <div className="h-full">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-md mb-6">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Exam Form Portal</h1>
        </div>
      </header>

      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="card-custom">
          <CardHeader>
            <CardTitle>Total Candidates</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-primary">{total}</p>
          </CardContent>
        </Card>
        <Card className="card-custom">
          <CardHeader>
            <CardTitle>Pending Forms</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-yellow-500">{pending}</p>
            <Link href={"/admin/users/user-submissions"}>
              {" "}
              <Button className="btn-custom mt-2 w-full">Review Now</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="card-custom">
          <CardHeader>
            <CardTitle>Approved Forms</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-green-500">{approved}</p>
          </CardContent>
        </Card>
        <Card className="card-custom">
          <CardHeader>
            <CardTitle>Rejected Forms</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-destructive">{rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card className="card-custom mb-6">
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Name</TableHead>
                <TableHead className="text-left">Aadhaar No.</TableHead>
                <TableHead className="text-left">Number</TableHead>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-left">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.slice(0, 3).map((submission: User) => (
                <TableRow key={submission.id}>
                  {" "}
                  {/* Changed key to id */}
                  <TableCell className="font-medium">
                    {submission.name}
                  </TableCell>
                  <TableCell>{submission.aadhaarNo}</TableCell>
                  <TableCell>{submission.phone}</TableCell>
                  <TableCell>{submission.currentDate}</TableCell>
                  <TableCell
                    className={
                      submission.status === "pending"
                        ? "text-yellow-500"
                        : submission.status === "approve"
                        ? "text-green-500"
                        : "text-destructive"
                    }
                  >
                    {submission.status}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() =>
                          router.push(
                            `/admin/users/user-submissions/viewform?id=${submission.id}`
                          )
                        }
                      >
                        View
                      </Button>
                      {submission.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() =>
                              handleStatusUpdate(submission.id, "approve")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusUpdate(submission.id, "reject")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Management */}
      <Card className="card-custom mb-6">
        <CardHeader>
          <CardTitle>Form Management</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button className="btn-custom w-full sm:w-auto">
            Create New Form
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Edit Existing Form
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Set Form Visibility
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="card-custom">
        <CardHeader>
          <CardTitle>Send Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter message for candidates..."
            className="mb-4 w-full bg-input text-foreground border-border"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="btn-custom w-full sm:w-auto">
              Send to All Candidates
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Send to Selected
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
