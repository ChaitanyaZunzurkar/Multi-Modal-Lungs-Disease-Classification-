# 🫁 Multi-Modal Lung Disease Classification Workspace

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?logo=tensorflow&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.105.0-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)

## 📖 Project Summary

The **Multi-Modal Lung Disease Classification Workspace** is an AI-driven diagnostic support system designed to classify respiratory conditions: **COPD, Pneumonia, Asthma, and Healthy states**. 

To replicate the holistic approach of a real medical professional, this system abandons fragile, single-source models. Instead, it utilizes a **Joint Early-Fusion Architecture** that simultaneously ingests and cross-references Chest X-Rays, Respiratory Sounds, and Clinical Patient Vitals. By forcing the neural network to find correlations across these three distinct modalities, the system drastically reduces false positives and generates a highly confident, multimodal "AI Doctor's Report."

---

## 🧠 Project Detailed Info

Medical diagnosis requires synthesizing visual, acoustic, and physiological evidence. Here is how this workspace handles each modality before fusing them into a final prediction:

### 1. Computer Vision (Image Branch)
* **Goal:** Identify spatial anomalies in lung structure (e.g., consolidations, hyperinflation).
* **Processing:** Chest X-rays undergo CLAHE (Contrast Limited Adaptive Histogram Equalization) to enhance local contrast. 
* **Model:** A pre-trained **DenseNet121**, which excels at preserving fine-grained edge features in medical imaging.

### 2. Acoustic Analysis (Audio Branch)
* **Goal:** Capture temporal breathing patterns (e.g., wheezes, crackles).
* **Processing:** 5-second `.wav` respiratory clips are converted into 128-bin Mel-Spectrograms, turning audio frequencies into 2D visual heatmaps.
* **Model:** A pre-trained **EfficientNetB0** evaluates these spectrograms to detect localized acoustic irregularities.

### 3. Clinical Data (Tabular Branch)
* **Goal:** Ground the model in physiological reality (e.g., Age, SpO2%, BMI, Fever).
* **Processing:** Continuous variables are normalized using Scikit-Learn's `StandardScaler`. Mixup Data Augmentation is applied during training to prevent overfitting.
* **Model:** A custom **Residual Deep Neural Network (DNN)** utilizing Batch Normalization, GELU activations, and Gaussian Noise layers.

### 4. The Joint Early-Fusion Core
Rather than averaging three separate guesses (Late Fusion), this system extracts the dense "Feature Embeddings" from the penultimate layer of all three models. These vectors are concatenated into one massive feature array and passed through a joint reasoning network. This allows the model to learn complex, cross-modal rules (e.g., linking a visual shadow directly to a low SpO2 reading).

---

## 🏗️ Architecture

### Data Flow & Directory Structure

    ├── 🧑‍💻 Client (React / Vite)
    │   ├── Interactive Patient Intake Form
    │   ├── Drag-and-Drop Diagnostic Media Upload
    │   └── Real-time "AI Doctor's Report" Dashboard
    │
    ├── 🌐 API Gateway (FastAPI)
    │   ├── Pydantic Data Validation
    │   └── Multi-part Form Data Handling (Images/Audio + Text)
    │
    └── 🤖 Inference Engine (TensorFlow / Keras)
        ├── Preprocessors (OpenCV, Librosa, Joblib)
        ├── Frozen Feature Extractors (DenseNet, EfficientNet, Res-DNN)
        └── Fusion Head -> Final Softmax Probabilities


### Tech Stack
* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Backend:** Python 3.10, FastAPI, Uvicorn
* **Machine Learning:** TensorFlow 2.x, Keras 3, Scikit-Learn
* **Data Processing:** OpenCV, Librosa, NumPy, Pandas
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🚀 How to Clone and Run

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.10 is strictly recommended for TensorFlow stability)

### 1. Clone the Repository

    git clone https://github.com/YourUsername/Multi-Modal-Lungs-Disease-Classification.git
    cd Multi-Modal-Lungs-Disease-Classification


### 2. Add Your Models
Ensure your trained artifacts are placed in the correct directories:
* `models/keras/best_global_model.keras`
* `artifacts/tabular_scaler.joblib`

### 3. Start the Backend (FastAPI)
Open a terminal in the root directory:

    # Set up Python virtual environment
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate

    # Install dependencies
    pip install -r backend/requirements.txt

    # Create environment variables
    echo "PORT=8000" > backend/.env
    echo "HOST=0.0.0.0" >> backend/.env

    # Run the server
    uvicorn backend.main:app --reload


### 4. Start the Frontend (React)
Open a **new** terminal in the root directory:

    cd frontend
    npm install

    # Create environment variables
    echo "VITE_API_URL=http://localhost:8000" > .env

    # Start the dev server
    npm run dev


---

## 🤝 Ways to Contribute

We welcome contributions from the open-source community! Whether it's a bug fix, UI enhancement, or a completely new feature (like Explainable AI heatmaps), your help is appreciated.

### Contribution Workflow
1. **Fork** the project repository.
2. **Create** a new Feature Branch:
    `git checkout -b feature/YourAmazingFeature`
3. **Commit** your changes:
    `git commit -m 'Add some YourAmazingFeature'`
4. **Push** to the branch:
    `git push origin feature/YourAmazingFeature`
5. **Open a Pull Request** describing your changes and what issue it solves.

### Areas for Improvement
* **Mobile Responsiveness:** Enhancing the UI for smaller screens.
* **Explainable AI (XAI):** Integrating Grad-CAM to highlight exactly which part of the X-ray or Spectrogram the model focused on.
* **Expanded Modalities:** Adding support for DICOM image formats or continuous waveform data.

---

## 📄 Disclaimer
* **Disclaimer:** This software is for educational and research purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.