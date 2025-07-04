export default function Prescription({ name, age, patientId, duration, symptoms, medicines }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>📝 Prescription</h2>
      <p><strong>Name:</strong> {name} | <strong>Age:</strong> {age}</p>
      <p><strong>Patient ID:</strong> {patientId}</p>
      <p><strong>Problem Duration:</strong> {duration} days</p>
      <p><strong>Symptoms Detected:</strong> {symptoms.join(", ") || "None"}</p>

      {medicines.length > 0 ? (
        <>
          <h3>Suggested Medicines:</h3>
          <ul>
            {medicines.map((med, idx) => (
              <li key={idx}>
                💊 <strong>{med.name}</strong> — {med.dose}, {med.days}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>❌ No matching medicine found.</p>
      )}
    </div>
  );
}
