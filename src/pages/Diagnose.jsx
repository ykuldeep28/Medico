import { useState } from "react";
import PatientForm from "../components/PatientForm";
import Prescription from "../components/Prescription";

export default function Diagnose() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMedicines = async (symptom) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.fda.gov/drug/label.json?search=indications_and_usage:${symptom}&limit=5`
      );
      const result = await res.json();

      const medicines = result.results
        .map((item) => ({
          name: item.openfda.brand_name?.[0] || "Unknown",
          dose: "Refer to label",
          days: "Consult doctor"
        }))
        .filter((med) => med.name !== "Unknown");

      return medicines;
    } catch (err) {
      console.error("API error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async ({ name, age, problem }) => {
    const keywords = problem.toLowerCase().split(" ");
    let allMeds = [];

    for (let keyword of keywords) {
      const meds = await fetchMedicines(keyword);
      allMeds = [...allMeds, ...meds];
    }

    setData({
      name,
      age,
      symptoms: keywords,
      medicines: allMeds
    });
  };

  return (
    <div>
      <h2 style={{ padding: 20 }}>🩺 Diagnosis Form</h2>
      <PatientForm onSubmit={handleFormSubmit} />
      {loading && <p style={{ padding: 20 }}>Loading medicines...</p>}
      {data && <Prescription {...data} />}
    </div>
  );
}
