import {useState} from "react";

function App(){
  const [showForm,setShowForm]=useState(false);
  const [showContact,setShowContact]=useState(false);
  const [data,setData]=useState(null);
  const [form,setForm]=useState({name:"",age:"",patientId:"",problem:"",duration:""});
  const [loading,setLoading]=useState(false);

  const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const fetchMedicines=async(symptom)=>{
    try{
      setLoading(true);
      const res=await fetch(`https://api.fda.gov/drug/label.json?search=indications_and_usage:${symptom}&limit=5`);
      const result=await res.json();
      // medicines filter
      const medicines=result.results
        .map(item=>({name:item.openfda.brand_name?.[0]||"Unknown",dose:"Refer to label",days:"Consult doctor"}))
        .filter(med=>med.name!=="Unknown");
      return medicines;
    }catch(err){
      console.error("API error:",err);
      return [];
    }finally{
      setLoading(false);
    }
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const {name,age,patientId,problem,duration}=form;
    const keywords=problem.toLowerCase().split(" ");

    let allMeds=[];
    for(let keyword of keywords){
      const meds=await fetchMedicines(keyword);
      allMeds=[...allMeds,...meds];
    }

    setData({name,age,patientId,duration,symptoms:keywords,medicines:allMeds});
  };

  return (
    <div className="min-h-screen bg-center bg-no-repeat p-6 relative font-sans" style={{backgroundImage:"url('/medico-bg.jpg')",backgroundSize:"150%"}}>

      {/* Contact Us button on top right */}
      <button onClick={()=>{
        setShowContact(true);
        setShowForm(false);
      }} className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
        Contact Us
      </button>

      {/* Homepage */}
      {!showForm && !showContact &&
        <div className="flex flex-col items-center justify-center text-center h-[80vh]">
          <h1 className="text-9xl font-bold text-blue-700 mb-4">🩺 Medico</h1>
          <p className="text-3xl font-bold text-green-800 max-w-2xl mb-8">
            Your smart AI-powered assistant for medicine suggestions using real-world data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mt-11">
            <div className="p-4 bg-white shadow rounded-xl">
              <h3 className="text-blue-600 font-semibold">💡 AI Diagnosis</h3>
              <p className="text-sm text-gray-600 mt-2">Real-time medicine suggestions based on symptoms.</p>
            </div>
            <div className="p-4 bg-white shadow rounded-xl">
              <h3 className="text-blue-600 font-semibold">🔐 Privacy Focused</h3>
              <p className="text-sm text-gray-600 mt-2">Nothing is stored — your health data stays local.</p>
            </div>
            <div className="p-4 bg-white shadow rounded-xl">
              <h3 className="text-blue-600 font-semibold">📋 Doctor-Style Output</h3>
              <p className="text-sm text-gray-600 mt-2">Clean and printable prescription layout like a real performa.</p>
            </div>
          </div>
        </div>
      }

      {/* Ask AI Button */}
      {!showForm && !showContact &&
        <div className="absolute bottom-[3%] left-1/2 transform -translate-x-1/2 text-center mt-[20%]">
          <div className="w-56 h-56 rounded-full bg-orange-400 flex items-center justify-center animate-pulse shadow-lg">
            <button onClick={()=>{
              setShowForm(true);
              setShowContact(false);
            }} className="w-44 h-44 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold flex items-center justify-center shadow-xl transition duration-300 ease-in-out">
              Ask AI 🤖
            </button>
          </div>
        </div>
      }

      {/* Form Section */}
      {showForm &&
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">AI Diagnosis Form</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input name="name" placeholder="Patient Name" onChange={handleChange} value={form.name} className="border border-gray-300 p-2 rounded" required />
            <input name="age" placeholder="Age" type="number" onChange={handleChange} value={form.age} className="border border-gray-300 p-2 rounded" required />
            <input name="patientId" placeholder="Patient ID" onChange={handleChange} value={form.patientId} className="border border-gray-300 p-2 rounded" required />
            <input name="problem" placeholder="Enter problem (e.g., fever, cold)" onChange={handleChange} value={form.problem} className="border border-gray-300 p-2 rounded" required />
            <input name="duration" placeholder="Problem Duration (days)" type="number" onChange={handleChange} value={form.duration} className="border border-gray-300 p-2 rounded" required />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Get Prescription</button>
          </form>

          {loading && <p className="mt-4 text-blue-500">Loading medicines...</p>}

          {data &&
            <div className="mt-10 border-2 border-gray-300 rounded-xl p-6 bg-white shadow-md text-left">

              <div className="text-center mb-6 border-b pb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl">🩺</span>
                  <h2 className="text-2xl font-bold text-blue-700">Medico Health Center</h2>
                </div>
                <p className="text-gray-600 italic">AI-Generated Medical Prescription</p>
              </div>

              <div className="mb-6 leading-relaxed">
                <p><strong>Patient Name:</strong> {data.name}</p>
                <p><strong>Age:</strong> {data.age}</p>
                <p><strong>Patient ID:</strong> {data.patientId}</p>
                <p><strong>Duration of Problem:</strong> {data.duration} days</p>
                <p><strong>Symptoms:</strong> {data.symptoms.join(", ")}</p>
              </div>

              <hr className="my-4 border-t-2 border-gray-400" />

              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Prescribed Medicines</h3>
                <ul className="list-disc pl-5">
                  {data.medicines.map((med,idx)=>
                    <li key={idx} className="mb-1">💊 <strong>{med.name}</strong> — {med.dose}, {med.days}</li>
                  )}
                </ul>
              </div>

            </div>
          }
        </div>
      }

      {/* Contact Section */}
      {showContact &&
        <section id="contact" className="bg-white py-12 px-6 mt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">📬 Contact Us</h2>
            <p className="text-gray-700 mb-8">Have questions or feedback? We'd love to hear from you.</p>
            <form className="grid grid-cols-1 gap-4">
              <input type="text" placeholder="Your Name" className="border border-gray-300 p-3 rounded" required />
              <input type="email" placeholder="Your Email" className="border border-gray-300 p-3 rounded" required />
              <textarea placeholder="Your Message" rows="5" className="border border-gray-300 p-3 rounded" required />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">Send Message</button>
            </form>
          </div>
        </section>
      }

    </div>
  );
}

export default App;
