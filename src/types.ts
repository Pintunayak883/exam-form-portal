// types.ts
export type User = {
  id: string;
  name: string;
  aadhaarNo: string;
  phone: string;
  currentDate: string;
  status: "pending" | "approve" | "reject";
};
