import { useState } from "react";

export default function PatientForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    patientId: "",
    problem: "",
    duration: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Patient Name" onChange={handleChange} value={form.name} required />
      <input name="age" placeholder="Age" type="number" onChange={handleChange} value={form.age} required />
      <input name="patientId" placeholder="Patient ID" onChange={handleChange} value={form.patientId} required />
      <input name="problem" placeholder="What is the problem?" onChange={handleChange} value={form.problem} required />
      <input name="duration" placeholder="Problem since how many days?" type="number" onChange={handleChange} value={form.duration} required />
      <button type="submit">Get Prescription</button>
    </form>
  );
}
