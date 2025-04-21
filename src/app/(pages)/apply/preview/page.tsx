"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";

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

export default function PreviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ApplyFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("formData");
    if (data) setFormData(JSON.parse(data));
    else router.push("/apply");
  }, [router]);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const downloadPdf = async () => {
    if (!pdfRef.current) return;

    setIsLoading(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const sections = pdfRef.current.querySelectorAll(".preview-section");
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10; // Margin in mm
      const contentWidth = pageWidth - 2 * margin;
      let currentY = margin; // Track vertical position on the page

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;

        // Capture section as canvas
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          logging: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        // Check if section fits on the current page
        if (currentY + imgHeight > pageHeight - margin && currentY !== margin) {
          pdf.addPage();
          currentY = margin; // Reset Y position for new page
        }

        // Add section to PDF
        pdf.addImage(imgData, "PNG", margin, currentY, contentWidth, imgHeight);

        currentY += imgHeight + 5; // Add some spacing between sections

        // Add new page if more sections remain and current page is full
        if (i < sections.length - 1 && currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
      }

      pdf.save("application-preview.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // humbly handling form submission
  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    setError("");

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Login fir se karo bhai, token nahi mila");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.put("/api/auth/signup", formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log("Response: ", response.data);
      alert("Details updated successfully!");
      sessionStorage.removeItem("formData");
      router.push("/submissions");
    } catch (err: any) {
      console.error("Error updating details: ", err);
      setError("Error updating details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // humbly showing loading state if form data is not ready
  if (!formData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Application Preview
        </h1>

        {/* humbly adding buttons for download and print */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={downloadPdf}
            className="bg-green-600 text-white hover:bg-green-700 relative"
            disabled={isLoading}
          >
            {isLoading && (
              <span className="absolute left-1/2 -translate-x-1/2">
                <ClipLoader size={20} color="#ffffff" />
              </span>
            )}
            <span className={isLoading ? "opacity-0" : ""}>Download PDF</span>
          </Button>
          <Button
            onClick={() => window.print()}
            className="bg-yellow-600 text-white hover:bg-yellow-700"
          >
            Print Preview
          </Button>
        </div>

        <div className="print-container" ref={pdfRef}>
          {/* humbly adding Appointment Letter Section (StarParth) */}
          <div className="preview-section p-0 bg-white border-none">
            <div className="flex justify-center mb-4">
              <Image
                src="/starparth-logo.png"
                alt="StarParth Logo"
                width={200}
                height={200}
                className="object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-xl font-bold">
                STARPARTH TECHNOLOGIES PVT LTD
              </p>
              <p className="text-sm">
                CHIEF INVIGILATOR NON-PARTICIPATION / NO RELATION &
                CONFIDENTIALITY AGREEMENT & APPOINTMENT LETTER
              </p>
            </div>
            <p className="text-sm mb-2 text-center">
              I, <strong>{formData.name || "__________"}</strong> hereby declare
              that I am not appearing in the IAF Agniveer Vayu Examination,
              01/2025, Mar 2025 held from 19th Mar to 26th Mar 2025 as a
              candidate either at the exam centre or have been deputed at any
              other centre which is involved in the conduct of the exam. If I am
              absent or leave the examination Centre at any time during the
              mentioned dates, or found doing any Suspicious Activity /
              Malpractice / Unethical Behavior / Professional Misconduct, then
              StarParth Technologies Pvt Ltd or their client has full authority
              to take any disciplinary action (regarding Duty Code of Conduct as
              specified in IPC Section).
            </p>
            <p className="text-sm mb-2 text-center">
              As a condition of serving as an Operations Chief Invigilator,
              StarParth Technologies Pvt Ltd, I understand and agree to accept
              the responsibility for maintaining and protecting the confidential
              nature of StarParth Technologies Pvt Ltd and related resources. I
              understand that revealing the content of the test in the form of
              any duplication, unauthorized distribution, disclosure, or other
              breaches of confidentiality can render the tests unusable and/or
              severely compromised with respect to the purpose for which they
              are administered. As a Chief Invigilator, I agree that:
            </p>
            <ol className="list-decimal list-inside text-sm mb-2">
              <li>
                I will oversee and carry out the administration of StarParth
                Technologies Pvt Ltd tests in conformance with the conditions
                described by StarParth Technologies Pvt Ltd.
              </li>
              <li>
                I will not, directly or indirectly, in any way compromise the
                security of any tests or their content.
              </li>
              <li>
                Only I am responsible for my own behavior, character, or any
                other work that is beyond my authorization.
              </li>
            </ol>
            <p className="text-sm mb-2">Required documents:</p>
            <ol className="list-decimal list-inside text-sm mb-2">
              <li>Photo Id Proof (Aadhaar Card / PAN Card)</li>
              <li>2 Passport Size Photo</li>
            </ol>
            <div className="grid grid-cols-2 gap-4 text-sm mb-2 items-center">
              <div className="text-left">
                <p>
                  Name: <strong>{formData.name || "__________"}</strong>
                </p>
                <p>
                  Email: <strong>{formData.email || "__________"}</strong>
                </p>
                <p>
                  DOB: <strong>{formData.dob || "__________"}</strong>
                </p>
                <p>
                  Mobile No.: <strong>{formData.phone || "__________"}</strong>
                </p>
                <p>
                  Area: <strong>{formData.area || "__________"}</strong>
                </p>
                <p>
                  Landmark: <strong>{formData.landmark || "__________"}</strong>
                </p>
                <p>
                  Address: <strong>{formData.address || "__________"}</strong>
                </p>
                <p>
                  Date: <strong>{formData.currentDate || "__________"}</strong>
                </p>
                <p>
                  Signature:{" "}
                  {formData.signature ? (
                    <img
                      src={formData.signature}
                      alt="Signature"
                      className="w-40 h-20 object-cover mx-auto block"
                    />
                  ) : (
                    "____________________"
                  )}
                </p>
                <div className="w-16 h-16 border-2 border-gray-500 mx-auto mt-2"></div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="mb-2 text-center">
                  Paste Your Recent Passport Size Photo here
                </p>
                {formData.photo && (
                  <div className="w-24 h-30 border-2 border-gray-500 flex items-center justify-center mb-4">
                    <img
                      src={formData.photo}
                      alt="Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center flex-col text-sm">
                  <p>Thumb Impression</p>
                  <div className="w-24 h-16 border-2 border-gray-500 mt-2 flex justify-center">
                    {formData.thumbprint && (
                      <img
                        src={formData.thumbprint}
                        alt="Thumbprint"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-center">
              <p>
                Exam city Preference - 1){" "}
                <strong>{formData.examCityPreference1 || "__________"}</strong>{" "}
                2){" "}
                <strong>{formData.examCityPreference2 || "__________"}</strong>{" "}
                & Role-{" "}
                <strong>{formData.cdaExperienceRole || "__________"}</strong>
              </p>
              <p>
                Previous CDAC Exam Experience -{" "}
                <strong>
                  {formData.previousCdaExperience || "__________"}
                </strong>{" "}
                & No. of Years{" "}
                <strong>{formData.cdaExperienceYears || "__________"}</strong> &
                Role-{" "}
                <strong>{formData.cdaExperienceRole || "__________"}</strong>
              </p>
              <p className="italic">
                *The meaning of relatives is defined as under: Wife, husband,
                son, daughter, grand-son, granddaughter, brother, sister,
                son-in-law, sister-in-law, daughter-in-law, nephew, niece,
                sister’s daughter and son and their son and their son and
                daughter, uncle, aunty.
              </p>
              <p>
                Note:- Exam City preference doesn’t guarantee for the actual
                allocation, it’s only a probability.
              </p>
            </div>
          </div>

          {/* humbly adding Self-Declaration - COVID-19 Section */}
          <div className="preview-section p-0 bg-white border-none">
            <div className="flex justify-center mb-4">
              <Image
                src="/starparth-logo.png"
                alt="StarParth Logo"
                width={200}
                height={200}
                className="object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-xl font-bold">
                STARPARTH TECHNOLOGIES PVT LTD
              </p>
              <p className="text-sm">
                IAF Agniveer Vayu 01/2025 (19th Mar to 26th Mar 2025)
              </p>
              <p className="text-sm">Self-Declaration - COVID-19</p>
            </div>
            <div className="text-sm p-4 text-center">
              <p>
                Name: <strong>{formData.name || "__________"}</strong>
              </p>
              <p>
                ID Proof: <strong>{formData.aadhaarNo || "__________"}</strong>
              </p>
              <p>Centre Code: __________ Centre Name: __________</p>
              <p>City: __________ ATCs / C-DAC Centre's Name: __________</p>
              <p className="font-bold mb-2">
                1. Do you have any of the following flu-like symptoms:
              </p>
              <ul className="list-disc list-inside mb-4 text-left">
                <li className="mb-1">
                  Fever (38 degree or higher):{" "}
                  <strong>{formData.fever || "__________"}</strong>
                </li>
                <li className="mb-1">
                  Cough: <strong>{formData.cough || "__________"}</strong>
                </li>
                <li className="mb-1">
                  Breathlessness:{" "}
                  <strong>{formData.breathlessness || "__________"}</strong>
                </li>
                <li className="mb-1">
                  Sore Throat:{" "}
                  <strong>{formData.soreThroat || "__________"}</strong>
                </li>
                <li className="mb-1">
                  Others:{" "}
                  <strong>
                    {formData.otherSymptomsDetails || "__________"}
                  </strong>
                </li>
              </ul>
              <p className="font-bold mb-2">
                2. Have you or an immediate family member come in close contact
                with a confirmed case of the coronavirus in the last 14 days?
              </p>
              <p className="mb-2">
                <strong>{formData.closeContact || "__________"}</strong> (Close
                contact means being at a distance of less than one meter for
                more than 15 minutes.)
              </p>
              <p className="mb-2">
                I hereby declare that all the information mentioned above is
                true to the best of my knowledge and will immediately inform to
                Covid -19 Central/State Govt. authority, if any symptoms arise
                during or after examination.
              </p>
              <p className="mb-2">
                Signature:{" "}
                {formData.signature ? (
                  <img
                    src={formData.signature}
                    alt="Signature"
                    className="w-40 h-20 object-cover mx-auto block"
                  />
                ) : (
                  "____________________"
                )}
              </p>
              <p className="mb-2">
                Date: <strong>{formData.currentDate || "__________"}</strong>
              </p>
              <p className="mb-2">
                Place: <strong>{formData.resident || "__________"}</strong>
              </p>
            </div>
          </div>

          {/* humbly adding Undertaking Section (StarParth) */}
          <div className="preview-section p-0 bg-white border-none">
            <div className="flex justify-center mb-4">
              <Image
                src="/starparth-logo.png"
                alt="StarParth Logo"
                width={200}
                height={200}
                className="object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-xl font-bold">
                STARPARTH TECHNOLOGIES PVT LTD
              </p>
              <p className="text-sm">
                IAF Agniveer Vayu 01/2025 (19th Mar to 26th Mar 2025)
              </p>
              <p className="text-2xl font-semibold text-center underline mb-4">
                Undertaking
              </p>
            </div>
            <div className="text-sm p-4 text-center">
              <p>
                I <strong>{formData.aadhaarNo || "__________"}</strong> S/O{" "}
                <strong>{formData.sonOf || "__________"}</strong> Resident of{" "}
                <strong>{formData.resident || "__________"}</strong> is working
                for the IAF Agniveer Vayu Examination (01/2025) held from 19th
                Mar to 26th Mar 2025.
              </p>
              <p>
                I will be there at from 19th Mar to 26th Mar 2025 and this is
                final confirmation, and I will not refuse in any condition.
              </p>
              <p className="font-bold mb-2">Penalty Clause:</p>
              <ol className="list-decimal list-inside mb-4 text-left">
                <li className="mb-1">
                  I hereby take a responsibility of all the hardware items
                  provided to me for conduction of examination will submit once
                  the examination will be over without any damage. If any damage
                  will be there, you may authorize to charge the penalty
                  equalling to the loss happen whatever.
                </li>
                <li className="mb-1">
                  I hereby commit for my behaviour during examination. If Exam
                  will be start before 5 minutes in any slot during the entire
                  Examination and I have the charge of Server Handling, I agree
                  to penalize myself for this mistake from my side.
                </li>
                <li className="mb-1">
                  I hereby responsible whatever duties will be given on the
                  centre i.e., CI1, CI2, CI3, CI4 whatever decided on the centre
                  during examination and if any discrepancy will be occur from
                  my side for that particular responsibility and eligible for
                  penalty, I am agreeing to pay the sum of the penalty because
                  of my irresponsible behaviour.
                </li>
                <li className="mb-1">
                  If I would be found in any Suspicious Activity/ Malpractice/
                  Unethical Behaviour/ Professional Misconduct during whole
                  Examination Process, Company will fully right to wave off my
                  all payment whatever I am eligible for taken off during the
                  course.
                </li>
                <li className="mb-1">
                  All the documents and information whatever I had submitted to
                  StarParth Technologies Pvt Ltd are correct and genuine. If any
                  of the document/information found guilty, I would be wholly
                  responsible for the same and company will fully authorize to
                  take a legal action and no payment will be given to me as a
                  penalty.
                </li>
                <li className="mb-1">
                  If I will backout after this confirmation due to any of the
                  reason, I should be penalized for the same and debarred to
                  function as a Chief Invigilator in all future Examination of
                  StarParth Technologies Pvt Ltd or their client.
                </li>
              </ol>
              <p>
                Company will have penalized me either if any of the above points
                could be happened or any other mistake from my side which could
                be harmful for the Examination and beyond the scope of work in
                any manner during the entire project.
              </p>
              <div className="flex justify-between items-center mt-4">
                <p>
                  Name: <strong>{formData.name || "__________"}</strong>
                </p>
                <p>
                  Mobile No: <strong>{formData.phone || "__________"}</strong>
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="w-24 h-24 border-2 flex items-center justify-center">
                  <p className="text-center">Revenue Stamp</p>
                </div>
                <div className="text-center">
                  <p>
                    Signature:{" "}
                    {formData.signature ? (
                      <img
                        src={formData.signature}
                        alt="Signature"
                        className="w-40 h-20 object-cover mx-auto block"
                      />
                    ) : (
                      "____________________"
                    )}
                  </p>
                </div>
                <div className="w-24 h-24 flex flex-col items-center justify-center">
                  <p className="text-center">Thumb</p>
                  {formData.thumbprint && (
                    <img
                      src={formData.thumbprint}
                      alt="Thumbprint"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* humbly adding Payout Section (StarParth) */}
          <div className="preview-section p-0 bg-white border-none">
            <div className="flex justify-center mb-4">
              <Image
                src="/starparth-logo.png"
                alt="StarParth Logo"
                width={200}
                height={200}
                className="object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-xl font-bold">
                STARPARTH TECHNOLOGIES PVT LTD
              </p>
              <p className="text-sm">
                IAF Agniveer Vayu 01/2025 (19th Mar to 26th Mar 2025)
              </p>
              <p className="text-xl font-bold mb-4">Payout</p>
            </div>
            <div className="text-sm p-4 text-center">
              <p>
                I <strong>{formData.aadhaarNo || "__________"}</strong> S/O{" "}
                <strong>{formData.sonOf || "__________"}</strong> Resident of{" "}
                <strong>{formData.resident || "__________"}</strong> is working
                for the IAF Agniveer Vayu Examination (01/2025) held from 19th
                Mar to 26th Mar 2025.
              </p>
              <p>
                I will be there at from 19th Mar to 26th Mar 2025 and this is
                final confirmation, and I will not refuse in any condition.
              </p>
              <p>
                I will be agreeing to work as a Chief Invigilator on behalf of
                StarParth Technologies Pvt Ltd on the payout of Rs.{" "}
                <strong>500/Day</strong> as a remuneration for the No. of days
                how I should be deployed on the centre according to allocation
                on that particular centre.
              </p>
              <p className="font-bold mb-2">My Bank Details are as under:</p>
              <div className="text-left mb-2">
                <p>
                  Account Holder Name:{" "}
                  <strong>{formData.accountHolderName || "__________"}</strong>
                </p>
                <p>
                  Bank Name:{" "}
                  <strong>{formData.bankName || "__________"}</strong>
                </p>
                <p>
                  IFSC: <strong>{formData.ifsc || "__________"}</strong>
                </p>
                <p>
                  Branch: <strong>{formData.branch || "__________"}</strong>
                </p>
                <p>
                  Bank Account No.:{" "}
                  <strong>{formData.bankAccountNo || "__________"}</strong>
                </p>
              </div>
              <p>
                Canceled cheque/Passbook copy should be attached for Reference
              </p>
              <p className="mb-2">
                Note: Payment will be given for the above duty and attendance
                whatever applicable from Starparth Technologies Pvt Ltd in your
                above-mentioned account through IMPS/NEFT or through CASH.
              </p>
              <div className="flex justify-between items-center mt-4">
                <p>
                  Signature:{" "}
                  {formData.signature ? (
                    <img
                      src={formData.signature}
                      alt="Signature"
                      className="w-40 h-20 object-cover mx-auto block"
                    />
                  ) : (
                    "____________________"
                  )}
                </p>
                <p>
                  Date: <strong>{formData.currentDate || "__________"}</strong>
                </p>
                <p>
                  Place: <strong>{formData.resident || "__________"}</strong>
                </p>
              </div>
            </div>
            <div className="text-sm p-4 mt-4 text-center">
              <p className="text-xl font-bold mb-4">Debit Note</p>
              <p>
                I <strong>{formData.aadhaarNo || "__________"}</strong> S/O{" "}
                <strong>{formData.sonOf || "__________"}</strong> Resident of{" "}
                <strong>{formData.resident || "__________"}</strong> is working
                for the IAF Agniveer Vayu Examination (01/2025) held from 19th
                Mar to 26th Mar 2025.
              </p>
              <p>
                I am interested to join a Certification Program i.e., Basic
                Certificate Course in Online Exam Management System for the
                duration of 80 Hours.
              </p>
              <p>
                To join this certification program, I am authorizing StarParth
                Technologies Pvt Ltd to Debit a Sum of Rs. <strong>2000</strong>{" "}
                from the total payout of IAF Agniveer Vayu 01/2025 prior and
                after deducting this amount rest of amount will pay me through
                Bank/Cash.
              </p>
              <div className="flex justify-between items-center mt-4">
                <p>
                  Signature:{" "}
                  {formData.signature ? (
                    <img
                      src={formData.signature}
                      alt="Signature"
                      className="w-40 h-20 object-cover mx-auto block"
                    />
                  ) : (
                    "____________________"
                  )}
                </p>
                <p>
                  Date: <strong>{formData.currentDate || "__________"}</strong>
                </p>
                <p>
                  Place: <strong>{formData.resident || "__________"}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* humbly adding Netparam Undertaking Section */}
          <div className="preview-section p-0 bg-white border-none">
            <div className="flex justify-center mb-4">
              <Image
                src="/netparam-logo.png"
                alt="Netparam Logo"
                width={200}
                height={200}
                className="object-contain"
                crossOrigin="anonymous"
              />
              <Image
                src="/netparam-logo-2.png"
                alt="Netparam Secondary Logo"
                width={200}
                height={200}
                className="object-contain ml-4"
                crossOrigin="anonymous"
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-xl font-bold">NETPARAM TECHNOLOGIES PVT LTD</p>
              <p className="text-sm">
                IAF Agniveer Vayu 01/2025 (19th Mar to 26th Mar 2025)
              </p>
              <p className="text-2xl font-semibold text-center underline mb-4">
                Undertaking
              </p>
            </div>
            <div className="text-sm p-4 text-center">
              <p>
                I <strong>{formData.aadhaarNo || "__________"}</strong> S/O{" "}
                <strong>{formData.sonOf || "__________"}</strong> Resident of{" "}
                <strong>{formData.resident || "__________"}</strong> is working
                for the IAF Agniveer Vayu Examination (01/2025) held from 19th
                Mar to 26th Mar 2025.
              </p>
              <p>
                I will be there at from 19th Mar to 26th Mar 2025 and this is
                final confirmation, and I will not refuse in any condition.
              </p>
              <p className="font-bold mb-2">Penalty Clause:</p>
              <ol className="list-decimal list-inside mb-4 text-left">
                <li className="mb-1">
                  I hereby take a responsibility of all the hardware items
                  provided to me for conduction of examination will submit once
                  the examination will be over without any damage. If any damage
                  will be there, you may authorize to charge the penalty
                  equalling to the loss happen whatever.
                </li>
                <li className="mb-1">
                  I hereby commit for my behaviour during examination. If Exam
                  will be start before 5 minutes in any slot during the entire
                  Examination and I have the charge of Server Handling, I agree
                  to penalize myself for this mistake from my side.
                </li>
                <li className="mb-1">
                  I hereby responsible whatever duties will be given on the
                  centre i.e., CI1, CI2, CI3, CI4 whatever decided on the centre
                  during examination and if any discrepancy will be occur from
                  my side for that particular responsibility and eligible for
                  penalty, I am agreeing to pay the sum of the penalty because
                  of my irresponsible behaviour.
                </li>
                <li className="mb-1">
                  If I would be found in any Suspicious Activity/ Malpractice/
                  Unethical Behaviour/ Professional Misconduct during whole
                  Examination Process, Company will fully right to wave off my
                  all payment whatever I am eligible for taken off during the
                  course.
                </li>
                <li className="mb-1">
                  All the documents and information whatever I had submitted to
                  Netparam Technologies Pvt Ltd are correct and genuine. If any
                  of the document/information found guilty, I would be wholly
                  responsible for the same and company will fully authorize to
                  take a legal action and no payment will be given to me as a
                  penalty.
                </li>
                <li className="mb-1">
                  If I will backout after this confirmation due to any of the
                  reason, I should be penalized for the same and debarred to
                  function as a Chief Invigilator in all future Examination of
                  Netparam Technologies Pvt Ltd or their client.
                </li>
              </ol>
              <p>
                Company will have penalized me either if any of the above points
                could be happened or any other mistake from my side which could
                be harmful for the Examination and beyond the scope of work in
                any manner during the entire project.
              </p>
              <div className="flex justify-between items-center mt-4">
                <p>
                  Name: <strong>{formData.name || "__________"}</strong>
                </p>
                <p>
                  Mobile No: <strong>{formData.phone || "__________"}</strong>
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="w-24 h-24 border-2 flex items-center justify-center">
                  <p className="text-center">Revenue Stamp</p>
                </div>
                <div className="text-center">
                  <p>
                    Signature:{" "}
                    {formData.signature ? (
                      <img
                        src={formData.signature}
                        alt="Signature"
                        className="w-40 h-20 object-cover mx-auto block"
                      />
                    ) : (
                      "____________________"
                    )}
                  </p>
                </div>
                <div className="w-24 h-24 flex flex-col items-center justify-center">
                  <p className="text-center">Thumb</p>
                  {formData.thumbprint && (
                    <img
                      src={formData.thumbprint}
                      alt="Thumbprint"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* humbly adding Netparam Payout Section */}
          <div className="preview-section p-0 bg-white border-none">
            <div className="flex justify-center mb-4">
              <Image
                src="/netparam-logo.png"
                alt="Netparam Logo"
                width={200}
                height={200}
                className="object-contain"
                crossOrigin="anonymous"
              />
              <Image
                src="/netparam-logo-2.png"
                alt="Netparam Secondary Logo"
                width={200}
                height={200}
                className="object-contain ml-4"
                crossOrigin="anonymous"
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-xl font-bold">NETPARAM TECHNOLOGIES PVT LTD</p>
              <p className="text-sm">
                IAF Agniveer Vayu 01/2025 (19th Mar to 26th Mar 2025)
              </p>
              <p className="text-xl font-bold mb-4">Payout</p>
            </div>
            <div className="text-sm p-4 text-center">
              <p>
                I <strong>{formData.aadhaarNo || "__________"}</strong> S/O{" "}
                <strong>{formData.sonOf || "__________"}</strong> Resident of{" "}
                <strong>{formData.resident || "__________"}</strong> is working
                for the IAF Agniveer Vayu Examination (01/2025) held from 19th
                Mar to 26th Mar 2025.
              </p>
              <p>
                I will be there at from 19th Mar to 26th Mar 2025 and this is
                final confirmation, and I will not refuse in any condition.
              </p>
              <p>
                I will be agreeing to work as a Chief Invigilator on behalf of
                Netparam Technologies Pvt Ltd on the payout of Rs.{" "}
                <strong>500/Day</strong> as a remuneration for the No. of days
                how I should be deployed on the centre according to allocation
                on that particular centre.
              </p>
              <p className="font-bold mb-2">My Bank Details are as under:</p>
              <div className="text-left mb-2">
                <p>
                  Account Holder Name:{" "}
                  <strong>{formData.accountHolderName || "__________"}</strong>
                </p>
                <p>
                  Bank Name:{" "}
                  <strong>{formData.bankName || "__________"}</strong>
                </p>
                <p>
                  IFSC: <strong>{formData.ifsc || "__________"}</strong>
                </p>
                <p>
                  Branch: <strong>{formData.branch || "__________"}</strong>
                </p>
                <p>
                  Bank Account No.:{" "}
                  <strong>{formData.bankAccountNo || "__________"}</strong>
                </p>
              </div>
              <p>
                Canceled cheque/Passbook copy should be attached for Reference
              </p>
              <p className="mb-2">
                Note: Payment will be given for the above duty and attendance
                whatever applicable from Netparam Technologies Pvt Ltd in your
                above-mentioned account through IMPS/NEFT or through CASH.
              </p>
              <div className="flex justify-between items-center mt-4">
                <p>
                  Signature:{" "}
                  {formData.signature ? (
                    <img
                      src={formData.signature}
                      alt="Signature"
                      className="w-40 h-20 object-cover mx-auto block"
                    />
                  ) : (
                    "____________________"
                  )}
                </p>
                <p>
                  Date: <strong>{formData.currentDate || "__________"}</strong>
                </p>
                <p>
                  Place: <strong>{formData.resident || "__________"}</strong>
                </p>
              </div>
            </div>
            <div className="text-sm p-4 mt-4 text-center">
              <p className="text-xl font-bold mb-4">Debit Note</p>
              <p>
                I <strong>{formData.aadhaarNo || "__________"}</strong> S/O{" "}
                <strong>{formData.sonOf || "__________"}</strong> Resident of{" "}
                <strong>{formData.resident || "__________"}</strong> is working
                for the IAF Agniveer Vayu Examination (01/2025) held from 19th
                Mar to 26th Mar 2025.
              </p>
              <p>
                I am interested to join a Certification Program i.e., Basic
                Certificate Course in Online Exam Management System for the
                duration of 80 Hours.
              </p>
              <p>
                To join this certification program, I am authorizing Netparam
                Technologies Pvt Ltd to Debit a Sum of Rs. <strong>2000</strong>{" "}
                from the total payout of IAF Agniveer Vayu 01/2025 prior and
                after deducting this amount rest of amount will pay me through
                Bank/Cash.
              </p>
              <div className="flex justify-between items-center mt-4">
                <p>
                  Signature:{" "}
                  {formData.signature ? (
                    <img
                      src={formData.signature}
                      alt="Signature"
                      className="w-40 h-20 object-cover mx-auto block"
                    />
                  ) : (
                    "____________________"
                  )}
                </p>
                <p>
                  Date: <strong>{formData.currentDate || "__________"}</strong>
                </p>
                <p>
                  Place: <strong>{formData.resident || "__________"}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* humbly adding Netparam Appointment Letter Section */}
          <div className="preview-section p-0 bg-white border-none">
            <div className="flex justify-center mb-4">
              <Image
                src="/netparam-logo.png"
                alt="Netparam Logo"
                width={200}
                height={200}
                className="object-contain"
                crossOrigin="anonymous"
              />
              <Image
                src="/netparam-logo-2.png"
                alt="Netparam Secondary Logo"
                width={200}
                height={200}
                className="object-contain ml-4"
                crossOrigin="anonymous"
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-xl font-bold">NETPARAM TECHNOLOGIES PVT LTD</p>
              <p className="text-sm">
                CHIEF INVIGILATOR NON-PARTICIPATION / NO RELATION &
                CONFIDENTIALITY AGREEMENT & APPOINTMENT LETTER
              </p>
            </div>
            <p className="text-sm mb-2 text-center">
              I, <strong>{formData.name || "__________"}</strong> hereby declare
              that I am not appearing in the IAF Agniveer Vayu Examination,
              01/2025, Mar 2025 held from 19th Mar to 26th Mar 2025 as a
              candidate either at the exam centre or have been deputed at any
              other centre which is involved in the conduct of the exam. If I am
              absent or leave the examination Centre at any time during the
              mentioned dates, or found doing any Suspicious Activity /
              Malpractice / Unethical Behavior / Professional Misconduct, then
              Netparam Technologies Pvt Ltd or their client has full authority
              to take any disciplinary action (regarding Duty Code of Conduct as
              specified in IPC Section).
            </p>
            <p className="text-sm mb-2 text-center">
              As a condition of serving as an Operations Chief Invigilator,
              Netparam Technologies Pvt Ltd, I understand and agree to accept
              the responsibility for maintaining and protecting the confidential
              nature of Netparam Technologies Pvt Ltd and related resources. I
              understand that revealing the content of the test in the form of
              any duplication, unauthorized distribution, disclosure, or other
              breaches of confidentiality can render the tests unusable and/or
              severely compromised with respect to the purpose for which they
              are administered. As a Chief Invigilator, I agree that:
            </p>
            <ol className="list-decimal list-inside text-sm mb-2">
              <li>
                I will oversee and carry out the administration of Netparam
                Technologies Pvt Ltd tests in conformance with the conditions
                described by Netparam Technologies Pvt Ltd.
              </li>
              <li>
                I will not, directly or indirectly, in any way compromise the
                security of any tests or their content.
              </li>
              <li>
                Only I am responsible for my own behavior, character, or any
                other work that is beyond my authorization.
              </li>
            </ol>
            <p className="text-sm mb-2">Required documents:</p>
            <ol className="list-decimal list-inside text-sm mb-2">
              <li>Photo Id Proof (Aadhaar Card / PAN Card)</li>
              <li>2 Passport Size Photo</li>
            </ol>
            <div className="grid grid-cols-2 gap-4 text-sm mb-2 items-center">
              <div className="text-left">
                <p>
                  Name: <strong>{formData.name || "__________"}</strong>
                </p>
                <p>
                  Email: <strong>{formData.email || "__________"}</strong>
                </p>
                <p>
                  DOB: <strong>{formData.dob || "__________"}</strong>
                </p>
                <p>
                  Mobile No.: <strong>{formData.phone || "__________"}</strong>
                </p>
                <p>
                  Area: <strong>{formData.area || "__________"}</strong>
                </p>
                <p>
                  Landmark: <strong>{formData.landmark || "__________"}</strong>
                </p>
                <p>
                  Address: <strong>{formData.address || "__________"}</strong>
                </p>
                <p>
                  Date: <strong>{formData.currentDate || "__________"}</strong>
                </p>
                <p>
                  Signature:{" "}
                  {formData.signature ? (
                    <img
                      src={formData.signature}
                      alt="Signature"
                      className="w-40 h-20 object-cover mx-auto block"
                    />
                  ) : (
                    "____________________"
                  )}
                </p>
                <div className="w-16 h-16 border-2 border-gray-500 mx-auto mt-2"></div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="mb-2 text-center">
                  Paste Your Recent Passport Size Photo here
                </p>
                {formData.photo && (
                  <div className="w-24 h-30 border-2 border-gray-500 flex items-center justify-center mb-4">
                    <img
                      src={formData.photo}
                      alt="Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center flex-col text-sm">
                  <p>Thumb Impression</p>
                  <div className="w-24 h-16 border-2 border-gray-500 mt-2 flex justify-center">
                    {formData.thumbprint && (
                      <img
                        src={formData.thumbprint}
                        alt="Thumbprint"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-center">
              <p>
                Exam city Preference - 1){" "}
                <strong>{formData.examCityPreference1 || "__________"}</strong>{" "}
                2){" "}
                <strong>{formData.examCityPreference2 || "__________"}</strong>{" "}
                & Role-{" "}
                <strong>{formData.cdaExperienceRole || "__________"}</strong>
              </p>
              <p>
                Previous CDAC Exam Experience -{" "}
                <strong>
                  {formData.previousCdaExperience || "__________"}
                </strong>{" "}
                & No. of Years{" "}
                <strong>{formData.cdaExperienceYears || "__________"}</strong> &
                Role-{" "}
                <strong>{formData.cdaExperienceRole || "__________"}</strong>
              </p>
              <p className="italic">
                *The meaning of relatives is defined as under: Wife, husband,
                son, daughter, grand-son, granddaughter, brother, sister,
                son-in-law, sister-in-law, daughter-in-law, nephew, niece,
                sister’s daughter and son and their son and their son and
                daughter, uncle, aunty.
              </p>
              <p>
                Note:- Exam City preference doesn’t guarantee for the actual
                allocation, it’s only a probability.
              </p>
            </div>
          </div>
        </div>

        {/* humbly displaying error if any */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* humbly adding navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={() => router.push("/apply")}
            className="bg-gray-600 text-white hover:bg-gray-700"
          >
            Back to Edit
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700 relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex justify-center items-center space-x-2">
                <ClipLoader size={20} color="#ffffff" />
                <span>Submitting...</span>
              </span>
            ) : (
              "Confirm & Submit"
            )}
          </Button>
        </div>
      </div>

      {/* humbly adding styles for print and PDF */}
      <style jsx>{`
        .print-container * {
          color: initial !important;
          background-color: initial !important;
          border-color: initial !important;
        }
        .preview-section {
          font-family: "Times New Roman", serif;
          line-height: 1.5;
          padding: 20px;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #000;
          box-shadow: none;
          page-break-inside: avoid;
          background-color: #ffffff !important;
        }
        .preview-section p,
        .preview-section li {
          margin: 5px 0;
          color: #000000 !important;
        }
        .preview-section .grid {
          gap: 10px;
        }
        .preview-section img {
          display: block;
        }
        .bg-gray-100 {
          background-color: #f3f4f6 !important;
        }
        .bg-green-600 {
          background-color: #16a34a !important;
        }
        .bg-yellow-600 {
          background-color: #d97706 !important;
        }
        .bg-blue-600 {
          background-color: #2563eb !important;
        }
        .text-white {
          color: #ffffff !important;
        }
        .text-red-500 {
          color: #ef4444 !important;
        }
        @media print {
          .print-container .preview-section {
            border: 1px solid #000;
            padding: 20px;
            page-break-inside: avoid;
            page-break-before: auto;
            page-break-after: auto;
          }
          button,
          h1,
          .flex.justify-center.gap-4.mb-6,
          .flex.justify-between.mt-6,
          p.text-red-500.text-center.mt-4 {
            display: none;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}
