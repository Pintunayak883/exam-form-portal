"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import Axios for API call
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadButton } from "@/components/FileUploader";

interface ApplyFormData {
  name: string;
  email: string;
  dob: string;
  phone: string;
  area: string;
  landmark: string;
  address: string;
  examCityPreference1: string;
  examCityPreference2: string;
  previousCdaExperience: string;
  cdaExperienceYears: string;
  cdaExperienceRole: string;
  photo: string | null;
  signature: string | null;
  thumbprint: string | null;
  aadhaarNo: string;
  penaltyClauseAgreement: boolean;
  fever: string;
  cough: string;
  breathlessness: string;
  soreThroat: string;
  otherSymptoms: string;
  otherSymptomsDetails: string;
  closeContact: string;
  covidDeclarationAgreement: boolean;
  accountHolderName: string;
  bankName: string;
  ifsc: string;
  branch: string;
  bankAccountNo: string;
  currentDate: string;
  sonOf: string;
  resident: string;
}

export default function ApplyPage() {
  const router = useRouter();
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState("");
  const [thumbprintPreviewUrl, setThumbprintPreviewUrl] = useState("");
  const [formData, setFormData] = useState<ApplyFormData>({
    name: "",
    email: "",
    dob: "",
    phone: "",
    area: "",
    landmark: "",
    address: "",
    examCityPreference1: "",
    examCityPreference2: "",
    previousCdaExperience: "No",
    cdaExperienceYears: "",
    cdaExperienceRole: "",
    photo: null,
    signature: null,
    thumbprint: null,
    aadhaarNo: "",
    penaltyClauseAgreement: false,
    fever: "No",
    cough: "No",
    breathlessness: "No",
    soreThroat: "No",
    otherSymptoms: "No",
    otherSymptomsDetails: "",
    closeContact: "No",
    covidDeclarationAgreement: false,
    accountHolderName: "",
    bankName: "",
    ifsc: "",
    branch: "",
    bankAccountNo: "",
    currentDate: new Date().toISOString().split("T")[0],
    sonOf: "",
    resident: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [openSection, setOpenSection] = useState<string | null>(
    "Personal Details"
  );

  // Fetch user data from backend
  const getUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Bhai, pehle login toh kar le!");
        router.push("/login");
        return null;
      }

      const response = await axios.get("/api/auth/signup", {
        // Changed endpoint to /api/user
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "User data nahi mili, bhai!");
      return null;
    }
  };

  // Fetch name and email from sessionStorage and user data from backend
  useEffect(() => {
    const fetchInitialData = async () => {
      const savedName = sessionStorage.getItem("name") || "";
      const savedEmail = sessionStorage.getItem("email") || "";
      const userData = await getUser();

      if (userData) {
        // Merge user data from backend with sessionStorage, including images
        setFormData((prev) => ({
          ...prev,
          ...userData,
          name: userData.name || savedName,
          email: userData.email || savedEmail,
          photo: userData.photo || null,
          signature: userData.signature || null,
          thumbprint: userData.thumbprint || null,
          currentDate: new Date().toISOString().split("T")[0], // Always set current date
        }));
        // Update preview URLs if images exist
        setPhotoPreviewUrl(userData.photo || "");
        setSignaturePreviewUrl(userData.signature || "");
        setThumbprintPreviewUrl(userData.thumbprint || "");
      } else {
        // Fallback to sessionStorage if backend fails
        setFormData((prev) => ({
          ...prev,
          name: savedName,
          email: savedEmail,
          currentDate: new Date().toISOString().split("T")[0],
        }));
      }
      setLoading(false);
    };

    fetchInitialData();
  }, [router]);

  const handlePhotoUpload = (url: string | null) => {
    setFormData((prev) => ({ ...prev, photo: url })); // Update formData
    setPhotoPreviewUrl(url || ""); // Update preview URL
  };

  const handleSignatureUpload = (url: string | null) => {
    setFormData((prev) => ({ ...prev, signature: url })); // Update formData
    setSignaturePreviewUrl(url || ""); // Update preview URL
  };

  const handleThumbprintUpload = (url: string | null) => {
    setFormData((prev) => ({ ...prev, thumbprint: url })); // Update formData
    setThumbprintPreviewUrl(url || ""); // Update preview URL
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Login fir se karo bhai, token nahi mila");
      router.push("/login");
      return;
    }

    if (!formData.name || !formData.email || !formData.aadhaarNo) {
      setError("Name, Email, and Aadhaar No. are required!");
      return;
    }

    if (!/^\d{12}$/.test(formData.aadhaarNo)) {
      setError("Aadhaar number must be exactly 12 digits!");
      return;
    }

    if (formData.bankAccountNo && !/^\d{10,18}$/.test(formData.bankAccountNo)) {
      setError("Bank Account Number must be 10 to 18 digits only!");
      return;
    }

    const updatedData = {
      ...formData,
      photo: formData.photo || photoPreviewUrl, // Ensure photo URL is saved
      signature: formData.signature || signaturePreviewUrl, // Ensure signature URL is saved
      thumbprint: formData.thumbprint || thumbprintPreviewUrl, // Ensure thumbprint URL is saved
    };

    console.log("Saving to sessionStorage:", updatedData); // Debug log
    sessionStorage.setItem("formData", JSON.stringify(updatedData));
    router.push("apply/preview");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "aadhaarNo") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 12) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
        if (numericValue.length !== 12) {
          setError("Aadhaar number must be exactly 12 digits!");
        } else {
          setError("");
        }
      }
      return;
    }

    if (name === "bankAccountNo") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 18) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
        if (
          numericValue.length > 0 &&
          (numericValue.length < 10 || numericValue.length > 18)
        ) {
          setError("Bank Account Number must be between 10 and 18 digits!");
        } else {
          setError("");
        }
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: keyof ApplyFormData,
    checked: boolean
  ) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-blue-600">
          Loading user data, thodi der ruk bhai...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Apply as Chief Invigilator
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Details */}
          <div className="border-b border-gray-300">
            <h2
              className="text-2xl font-semibold text-blue-600 mb-4 cursor-pointer"
              onClick={() => toggleSection("Personal Details")}
            >
              Personal Details {openSection === "Personal Details" ? "▲" : "▼"}
            </h2>
            {openSection === "Personal Details" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-blue-600">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-blue-600">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dob" className="text-blue-600">
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentDate" className="text-blue-600">
                    Current Date
                  </Label>
                  <Input
                    id="currentDate"
                    name="currentDate"
                    type="date"
                    value={formData.currentDate}
                    readOnly
                    className="mt-1 border-blue-300 bg-gray-100 cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sonOf" className="text-blue-600">
                    S/o or D/o
                  </Label>
                  <Input
                    id="sonOf"
                    name="sonOf"
                    type="text"
                    value={formData.sonOf}
                    onChange={handleChange}
                    placeholder="Enter father/mother's name"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="resident" className="text-blue-600">
                    Resident
                  </Label>
                  <Input
                    id="resident"
                    name="resident"
                    type="text"
                    value={formData.resident}
                    onChange={handleChange}
                    placeholder="Enter residency details"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-blue-600">
                    Mobile No.
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="area" className="text-blue-600">
                    Area
                  </Label>
                  <Input
                    id="area"
                    name="area"
                    type="text"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter your area"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="landmark" className="text-blue-600">
                    Landmark
                  </Label>
                  <Input
                    id="landmark"
                    name="landmark"
                    type="text"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Enter a nearby landmark"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-blue-600">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="examCityPreference1"
                    className="text-blue-600"
                  >
                    Exam City Preference 1
                  </Label>
                  <Input
                    id="examCityPreference1"
                    name="examCityPreference1"
                    type="text"
                    value={formData.examCityPreference1}
                    onChange={handleChange}
                    placeholder="Enter your first preference"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="examCityPreference2"
                    className="text-blue-600"
                  >
                    Exam City Preference 2
                  </Label>
                  <Input
                    id="examCityPreference2"
                    name="examCityPreference2"
                    type="text"
                    value={formData.examCityPreference2}
                    onChange={handleChange}
                    placeholder="Enter your second preference"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label className="text-blue-600">
                    Previous CDA Exam Experience
                  </Label>
                  <RadioGroup
                    name="previousCdaExperience"
                    value={formData.previousCdaExperience}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        previousCdaExperience: value,
                      }))
                    }
                    className="flex space-x-4 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="cdaYes" />
                      <Label htmlFor="cdaYes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="cdaNo" />
                      <Label htmlFor="cdaNo">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formData.previousCdaExperience === "Yes" && (
                  <>
                    <div>
                      <Label
                        htmlFor="cdaExperienceYears"
                        className="text-blue-600"
                      >
                        No. of Years
                      </Label>
                      <Input
                        id="cdaExperienceYears"
                        name="cdaExperienceYears"
                        type="number"
                        value={formData.cdaExperienceYears}
                        onChange={handleChange}
                        placeholder="Enter years of experience"
                        className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="cdaExperienceRole"
                        className="text-blue-600"
                      >
                        Role
                      </Label>
                      <Input
                        id="cdaExperienceRole"
                        name="cdaExperienceRole"
                        type="text"
                        value={formData.cdaExperienceRole}
                        onChange={handleChange}
                        placeholder="Enter your role"
                        className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="photo" className="text-blue-600">
                    Passport Size Photo
                  </Label>
                  <UploadButton
                    endpoint="imageUploader"
                    appearance={{
                      button:
                        "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition",
                      container: "flex flex-col items-start gap-2",
                    }}
                    onUploadBegin={async () => {
                      const token = sessionStorage.getItem("token");
                      if (token) document.cookie = `token=${token}; path=/;`;
                    }}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]?.url) {
                        const url = res[0].url;
                        alert("Photo uploaded!");
                        setPhotoPreviewUrl(url);
                        handlePhotoUpload(url);
                      }
                    }}
                    onUploadError={(error) =>
                      alert("Upload error: " + error.message)
                    }
                  />
                  {photoPreviewUrl && (
                    <div className="mt-2">
                      <p className="font-medium text-sm mb-1 text-gray-700">
                        Preview:
                      </p>
                      <img
                        src={photoPreviewUrl}
                        alt="Photo"
                        className="w-40 h-40 object-cover rounded shadow"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="signature" className="text-blue-600">
                    Signature
                  </Label>
                  <UploadButton
                    endpoint="imageUploader"
                    appearance={{
                      button:
                        "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition",
                      container: "flex flex-col items-start gap-2",
                    }}
                    onUploadBegin={async () => {
                      const token = sessionStorage.getItem("token");
                      if (token) document.cookie = `token=${token}; path=/;`;
                    }}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]?.url) {
                        const url = res[0].url;
                        alert("Signature uploaded!");
                        setSignaturePreviewUrl(url);
                        handleSignatureUpload(url);
                      }
                    }}
                    onUploadError={(error) =>
                      alert("Upload error: " + error.message)
                    }
                  />
                  {signaturePreviewUrl && (
                    <div className="mt-2">
                      <p className="font-medium text-sm mb-1 text-gray-700">
                        Signature Preview:
                      </p>
                      <img
                        src={signaturePreviewUrl}
                        alt="Signature"
                        className="w-40 h-20 object-cover rounded shadow"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="thumbprint" className="text-blue-600">
                    Thumbprint
                  </Label>
                  <UploadButton
                    endpoint="imageUploader"
                    appearance={{
                      button:
                        "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition",
                      container: "flex flex-col items-start gap-2",
                    }}
                    onUploadBegin={async () => {
                      const token = sessionStorage.getItem("token");
                      if (token) document.cookie = `token=${token}; path=/;`;
                    }}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]?.url) {
                        const url = res[0].url;
                        alert("Thumbprint uploaded!");
                        setThumbprintPreviewUrl(url);
                        handleThumbprintUpload(url);
                      }
                    }}
                    onUploadError={(error) =>
                      alert("Upload error: " + error.message)
                    }
                  />
                  {thumbprintPreviewUrl && (
                    <div className="mt-2">
                      <p className="font-medium text-sm mb-1 text-gray-700">
                        Thumbprint Preview:
                      </p>
                      <img
                        src={thumbprintPreviewUrl}
                        alt="Thumbprint"
                        className="w-40 h-20 object-cover rounded shadow"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Undertaking */}
          <div className="border-b border-gray-300">
            <h2
              className="text-2xl font-semibold text-blue-600 mb-4 cursor-pointer"
              onClick={() => toggleSection("Undertaking")}
            >
              Undertaking {openSection === "Undertaking" ? "▲" : "▼"}
            </h2>
            {openSection === "Undertaking" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="aadhaarNo" className="text-blue-600">
                    Aadhaar No.
                  </Label>
                  <Input
                    id="aadhaarNo"
                    name="aadhaarNo"
                    type="text"
                    value={formData.aadhaarNo}
                    onChange={handleChange}
                    placeholder="Enter your 12-digit Aadhaar number"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    pattern="\d{12}"
                    maxLength={12}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="penaltyClauseAgreement"
                    checked={formData.penaltyClauseAgreement}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "penaltyClauseAgreement",
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor="penaltyClauseAgreement"
                    className="text-blue-600"
                  >
                    I agree to the penalty clauses and undertaking terms.
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Self-Declaration – COVID-19 */}
          <div className="border-b border-gray-300">
            <h2
              className="text-2xl font-semibold text-blue-600 mb-4 cursor-pointer"
              onClick={() => toggleSection("Self-Declaration")}
            >
              Self-Declaration – COVID-19{" "}
              {openSection === "Self-Declaration" ? "▲" : "▼"}
            </h2>
            {openSection === "Self-Declaration" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-blue-600">
                    Do you have any of the following flu-like symptoms?
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <Label>Fever</Label>
                      <RadioGroup
                        name="fever"
                        value={formData.fever}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, fever: value }))
                        }
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="feverYes" />
                          <Label htmlFor="feverYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="feverNo" />
                          <Label htmlFor="feverNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Label>Cough</Label>
                      <RadioGroup
                        name="cough"
                        value={formData.cough}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, cough: value }))
                        }
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="coughYes" />
                          <Label htmlFor="coughYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="coughNo" />
                          <Label htmlFor="coughNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Label>Breathlessness</Label>
                      <RadioGroup
                        name="breathlessness"
                        value={formData.breathlessness}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            breathlessness: value,
                          }))
                        }
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="breathlessnessYes" />
                          <Label htmlFor="breathlessnessYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="breathlessnessNo" />
                          <Label htmlFor="breathlessnessNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Label>Sore Throat</Label>
                      <RadioGroup
                        name="soreThroat"
                        value={formData.soreThroat}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            soreThroat: value,
                          }))
                        }
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="soreThroatYes" />
                          <Label htmlFor="soreThroatYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="soreThroatNo" />
                          <Label htmlFor="soreThroatNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Label>Other Symptoms</Label>
                      <RadioGroup
                        name="otherSymptoms"
                        value={formData.otherSymptoms}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            otherSymptoms: value,
                          }))
                        }
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="otherSymptomsYes" />
                          <Label htmlFor="otherSymptomsYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="otherSymptomsNo" />
                          <Label htmlFor="otherSymptomsNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {formData.otherSymptoms === "Yes" && (
                      <div>
                        <Label
                          htmlFor="otherSymptomsDetails"
                          className="text-blue-600"
                        >
                          Specify Other Symptoms
                        </Label>
                        <Input
                          id="otherSymptomsDetails"
                          name="otherSymptomsDetails"
                          type="text"
                          value={formData.otherSymptomsDetails}
                          onChange={handleChange}
                          placeholder="Specify other symptoms"
                          className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-blue-600">
                    Have you or an immediate family member come in close contact
                    with a confirmed case of the coronavirus in the last 14
                    days?
                  </Label>
                  <RadioGroup
                    name="closeContact"
                    value={formData.closeContact}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, closeContact: value }))
                    }
                    className="flex space-x-4 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="closeContactYes" />
                      <Label htmlFor="closeContactYes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="closeContactNo" />
                      <Label htmlFor="closeContactNo">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="covidDeclarationAgreement"
                    checked={formData.covidDeclarationAgreement}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "covidDeclarationAgreement",
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor="covidDeclarationAgreement"
                    className="text-blue-600"
                  >
                    I declare that all the information mentioned above is true
                    to the best of my knowledge.
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Payout */}
          <div className="border-b border-gray-300">
            <h2
              className="text-2xl font-semibold text-blue-600 mb-4 cursor-pointer"
              onClick={() => toggleSection("Payout")}
            >
              Payout Details {openSection === "Payout" ? "▲" : "▼"}
            </h2>
            {openSection === "Payout" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountHolderName" className="text-blue-600">
                    Account Holder Name
                  </Label>
                  <Input
                    id="accountHolderName"
                    name="accountHolderName"
                    type="text"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    placeholder="Enter account holder name"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bankName" className="text-blue-600">
                    Bank Name
                  </Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    type="text"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ifsc" className="text-blue-600">
                    IFSC Code
                  </Label>
                  <Input
                    id="ifsc"
                    name="ifsc"
                    type="text"
                    value={formData.ifsc}
                    onChange={handleChange}
                    placeholder="Enter IFSC code"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="branch" className="text-blue-600">
                    Branch
                  </Label>
                  <Input
                    id="branch"
                    name="branch"
                    type="text"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Enter branch name"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccountNo" className="text-blue-600">
                    Bank Account No.
                  </Label>
                  <Input
                    id="bankAccountNo"
                    name="bankAccountNo"
                    type="text"
                    value={formData.bankAccountNo}
                    onChange={handleChange}
                    placeholder="Enter 10-18 digit bank account number"
                    className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    pattern="\d{10,18}"
                    maxLength={18}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Preview Application
          </Button>
        </form>
      </div>
    </div>
  );
}
