"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { fetchUsers, updateUserStatus, User } from "@/redux/userSlice";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function AllCandidates() {
  const dispatch = useDispatch<typeof store.dispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingApprove, setUpdatingApprove] = useState<{
    [id: string]: boolean;
  }>({});
  const [updatingReject, setUpdatingReject] = useState<{
    [id: string]: boolean;
  }>({});
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = users
    .filter(
      (u) =>
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.aadhaarNo.includes(searchTerm)) &&
        (statusFilter === "all" || u.status === statusFilter)
    )
    .sort((a, b) =>
      a.status === "pending" && b.status !== "pending"
        ? -1
        : b.status === "pending" && a.status !== "pending"
        ? 1
        : 0
    );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pageData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusUpdate = async (
    id: string,
    status: "approve" | "reject"
  ) => {
    if (status === "approve") setUpdatingApprove((p) => ({ ...p, [id]: true }));
    else setUpdatingReject((p) => ({ ...p, [id]: true }));

    try {
      await dispatch(updateUserStatus({ id, status })).unwrap();
      toast.success(`User ${status}ed successfully`);
    } catch {
      toast.error("Status update failed");
    } finally {
      if (status === "approve")
        setUpdatingApprove((p) => ({ ...p, [id]: false }));
      else setUpdatingReject((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <div className="h-full p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              placeholder="Search by name or Aadhaar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-1/4">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Aadhaar</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>Loading...</TableCell>
                </TableRow>
              ) : pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No candidates found</TableCell>
                </TableRow>
              ) : (
                pageData.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.aadhaarNo}</TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell>{u.currentDate}</TableCell>
                    <TableCell
                      className={
                        u.status === "pending"
                          ? "text-yellow-500"
                          : u.status === "approve"
                          ? "text-green-500"
                          : "text-destructive"
                      }
                    >
                      {u.status}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/users/user-submissions/viewform?id=${u.id}`
                            )
                          }
                        >
                          View
                        </Button>
                        {u.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() =>
                                handleStatusUpdate(u.id, "approve")
                              }
                              disabled={updatingApprove[u.id]}
                            >
                              {updatingApprove[u.id] ? (
                                <ClipLoader size={12} />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(u.id, "reject")}
                              disabled={updatingReject[u.id]}
                            >
                              {updatingReject[u.id] ? (
                                <ClipLoader size={12} />
                              ) : (
                                "Reject"
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
