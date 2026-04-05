import { useState, useEffect } from "react";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { LandingPage } from "./components/LandingPage";
import { UploadPanel } from "./components/UploadPanel";
import { PredictionResponse, TabularInputs } from "./types";
import { predictPatientData, checkApiHealth } from "./services/api";
import { ChevronLeft, ActivitySquare } from "lucide-react";

// Pull metadata from .env
const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Lung Disease Workspace";
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

const initialTabular: TabularInputs = {
  age: 38, gender: "Male", smoking_status: "Never", fev1_percent: 72, 
  spo2: 96, respiratory_rate: 18, cough_severity: 2, wheeze: "No", 
  chest_tightness: "No", crackles: "No", fever: "No", bmi: 24.5, copd_exacerbations: 0,
};

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "app">("home");
  const [tabular, setTabular] = useState<TabularInputs>(initialTabular);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkApiHealth();
      setApiHealthy(isHealthy);
      if (!isHealthy && currentPage === "app") {
        setAlertMessage("⚠️ Backend server is not responding. Please verify the API connection.");
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [currentPage]);

  const handleSubmit = async () => {
    if (!imageFile && !audioFile) {
      setAlertMessage("Please provide at least an image or audio upload.");
      return;
    }
    if (!apiHealthy) {
      setAlertMessage("⚠️ Backend server is offline.");
      return;
    }

    setAlertMessage(null);
    setLoading(true);

    try {
      const response = await predictPatientData({ imageFile, audioFile, tabular });
      setPrediction(response);
    } catch (error) {
      setAlertMessage("❌ " + (error instanceof Error ? error.message : "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImageFile(null); setAudioFile(null); setPrediction(null);
    setTabular(initialTabular); setAlertMessage(null);
  };

  if (currentPage === "home") {
    return <LandingPage onEnterApp={() => setCurrentPage("app")} />;
  }

  return (
    <div className="app-premium-shell animate-fade-in-up">
      <header className="app-premium-header">
        <div className="header-content-wrapper">
          <button className="back-btn-premium" onClick={() => setCurrentPage("home")}>
            <ChevronLeft size={18} />
            <span>Exit Workspace</span>
          </button>
          <div className="header-brand">
            <div className="brand-icon"><ActivitySquare size={22} color="#ffffff" /></div>
            <div className="brand-text">
              <h1>{APP_TITLE}</h1>
              <span className="version-badge">v{APP_VERSION}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-premium-grid">
        <section className="panel-premium intake-panel">
          <div className="panel-header-premium sticky-header">
            <div><h2>Patient Intake</h2><p>Upload diagnostic media and enter vital signs.</p></div>
          </div>
          <div className="panel-scroll-content">
            <UploadPanel imageFile={imageFile} onImageChange={setImageFile} audioFile={audioFile} onAudioChange={setAudioFile} />
            <div className="divider-premium"><span>Clinical Profile</span></div>
            
            <div className="clinical-form-grid">
              {/* Simple Mapping of inputs to reduce code clutter */}
              <div className="input-group-premium">
                <label>Age (Years)</label>
                <input type="number" value={tabular.age} onChange={(e) => setTabular({ ...tabular, age: Number(e.target.value) })} />
              </div>
              <div className="input-group-premium">
                <label>Gender</label>
                <select value={tabular.gender} onChange={(e) => setTabular({ ...tabular, gender: e.target.value })}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="input-group-premium">
                <label>Smoking Status</label>
                <select value={tabular.smoking_status} onChange={(e) => setTabular({ ...tabular, smoking_status: e.target.value })}>
                  <option>Never</option><option>Former</option><option>Current</option>
                </select>
              </div>
              <div className="input-group-premium">
                <label>BMI</label>
                <input type="number" step="0.1" value={tabular.bmi} onChange={(e) => setTabular({ ...tabular, bmi: Number(e.target.value) })} />
              </div>
              <div className="input-group-premium">
                <label>SpO₂ (%)</label>
                <input type="number" value={tabular.spo2} onChange={(e) => setTabular({ ...tabular, spo2: Number(e.target.value) })} />
              </div>
              <div className="input-group-premium">
                <label>Resp. Rate</label>
                <input type="number" value={tabular.respiratory_rate} onChange={(e) => setTabular({ ...tabular, respiratory_rate: Number(e.target.value) })} />
              </div>
              <div className="input-group-premium">
                <label>FEV1 (%)</label>
                <input type="number" value={tabular.fev1_percent} onChange={(e) => setTabular({ ...tabular, fev1_percent: Number(e.target.value) })} />
              </div>
              <div className="input-group-premium">
                <label>Cough Severity (0-5)</label>
                <input type="number" min="0" max="5" value={tabular.cough_severity} onChange={(e) => setTabular({ ...tabular, cough_severity: Number(e.target.value) })} />
              </div>
              <div className="input-group-premium">
                <label>COPD Exacerbations</label>
                <input type="number" value={tabular.copd_exacerbations} onChange={(e) => setTabular({ ...tabular, copd_exacerbations: Number(e.target.value) })} />
              </div>
              <div className="input-group-premium full-width">
                <label>Clinical Symptoms Present</label>
                <div className="symptoms-toggle-grid">
                  {['wheeze', 'crackles', 'chest_tightness', 'fever'].map((symptom) => (
                    <label key={symptom} className="toggle-label">
                      <span className="capitalize">{symptom.replace('_', ' ')}</span>
                      <select 
                        value={(tabular as any)[symptom]} 
                        onChange={(e) => setTabular({ ...tabular, [symptom]: e.target.value })}
                      >
                        <option>No</option><option>Yes</option>
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="action-bar-premium">
            {alertMessage && <div className="alert-premium">{alertMessage}</div>}
            <div className="button-group">
              <button className="btn-outline-premium" onClick={handleClear} disabled={loading}>Clear Form</button>
              <button className="btn-glow flex-1" onClick={handleSubmit} disabled={loading || (!imageFile && !audioFile)}>
                {loading ? "Processing Models..." : "Run Multimodal Analysis"}
              </button>
            </div>
          </div>
        </section>

        <section className="panel-premium results-panel" id="results-view">
          <div className="panel-header-premium sticky-header">
            <div><h2>Diagnostic Findings</h2><p>AI-synthesized multimodal evidence.</p></div>
          </div>
          <div className="panel-scroll-content">
            <ResultsDashboard loading={loading} prediction={prediction} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;