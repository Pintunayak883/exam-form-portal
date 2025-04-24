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
import Image from "next/image";

// Admin Dashboard Component
export default function AdminDashboard() {
  // Sample data (replace with API calls)
  const stats = {
    totalCandidates: 150,
    pendingForms: 30,
    approvedForms: 100,
    rejectedForms: 20,
  };

  const recentSubmissions = [
    {
      id: 1,
      name: "Pintu Nayak",
      aadhaar: "XXXX-XXXX-1234",
      formName: "AFCAT 01/2025",
      date: "15-Apr-2025",
      status: "Pending",
    },
    {
      id: 2,
      name: "Kirti",
      aadhaar: "XXXX-XXXX-5678",
      formName: "ICG CGCAT 02/2025",
      date: "10-Apr-2025",
      status: "Approved",
    },
  ];

  return (
    <>
      <div className="h-full">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground  shadow-md mb-6">
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
              <p className="text-2xl font-bold text-primary">
                {stats.totalCandidates}
              </p>
            </CardContent>
          </Card>
          <Card className="card-custom">
            <CardHeader>
              <CardTitle>Pending Forms</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-yellow-500">
                {stats.pendingForms}
              </p>
              <Button className="btn-custom mt-2 w-full">Review Now</Button>
            </CardContent>
          </Card>
          <Card className="card-custom">
            <CardHeader>
              <CardTitle>Approved Forms</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {stats.approvedForms}
              </p>
            </CardContent>
          </Card>
          <Card className="card-custom">
            <CardHeader>
              <CardTitle>Rejected Forms</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-destructive">
                {stats.rejectedForms}
              </p>
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
                  <TableHead className="text-left">Form Name</TableHead>
                  <TableHead className="text-left">Date</TableHead>
                  <TableHead className="text-left">Status</TableHead>
                  <TableHead className="text-left">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.name}
                    </TableCell>
                    <TableCell>{submission.aadhaar}</TableCell>
                    <TableCell>{submission.formName}</TableCell>
                    <TableCell>{submission.date}</TableCell>
                    <TableCell
                      className={
                        submission.status === "Pending"
                          ? "text-yellow-500"
                          : submission.status === "Approved"
                          ? "text-green-500"
                          : "text-destructive"
                      }
                    >
                      {submission.status}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="mr-2">
                          View
                        </Button>
                        {submission.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
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
    </>
  );
}
