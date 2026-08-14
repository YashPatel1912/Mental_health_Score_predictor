# Mental Health Score Predictor 🧠

A machine learning-based web application that predicts a **mental health score** from user-provided input features. This project demonstrates an end-to-end machine learning workflow including data preprocessing, exploratory data analysis, feature engineering, model training, model evaluation, model serialization, REST API development, frontend integration, and deployment.

> **Note:** This project is intended for educational and demonstration purposes only. The prediction should not be considered a medical diagnosis or professional mental-health assessment.

## 🚀 Live Demo

**Frontend:** https://mental-health-score-predictor-9pmt.onrender.com

**API:** https://mental-health-score-predictor-ml-iell.onrender.com

---

## 📌 Project Overview

The **Mental Health Score Predictor** is a supervised machine learning regression project designed to estimate a mental health score based on relevant user and behavioral input features.

The project follows a complete machine learning and deployment pipeline:

**Data Collection → Data Cleaning → Exploratory Data Analysis → Feature Engineering → Data Preprocessing → Model Training → Model Evaluation → Model Serialization → FastAPI → React Frontend → Deployment**

The application allows users to enter the required information through a web interface and receive a predicted mental health score.

---

## 🎯 Project Objectives

* Build an end-to-end machine learning regression application.
* Analyze factors related to mental health scores.
* Perform data cleaning and exploratory data analysis.
* Handle numerical and categorical features.
* Apply feature engineering and preprocessing techniques.
* Train and compare multiple regression models.
* Evaluate models using R², MAE, and RMSE.
* Select the best-performing model for deployment.
* Serialize the trained ML pipeline using Pickle.
* Develop a REST API using FastAPI.
* Build a responsive React frontend.
* Deploy the complete application using Render.

---

## 🛠️ Tech Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Matplotlib
* Seaborn
* Joblib / Pickle

### Backend

* FastAPI
* Pydantic
* Uvicorn
* Python

### Frontend

* React
* JavaScript
* HTML5
* CSS3

### Deployment & Version Control

* Git
* GitHub
* Render

---

# 🤖 Machine Learning Workflow

## 1. Data Collection

The project uses the following dataset:

**Student Social Media And Mental Health Impact.csv**

The dataset contains student-related and social-media-related features that are used to predict the target mental health score.

---

## 2. Data Preprocessing

The preprocessing workflow includes:

* Missing value handling
* Duplicate checking
* Data type correction
* Outlier analysis
* Numerical feature processing
* Categorical feature encoding
* Skewness analysis and transformation
* Feature scaling where required

The preprocessing pipeline uses Scikit-learn components such as:

* `StandardScaler`
* `OneHotEncoder`
* `OrdinalEncoder`
* `ColumnTransformer`
* `Pipeline`

---

## 3. Exploratory Data Analysis

Exploratory Data Analysis was performed to understand the dataset and identify relationships between features and the target variable.

The analysis includes:

* Feature distributions
* Target distribution
* Correlation analysis
* Missing-value analysis
* Outlier analysis
* Numerical feature relationships
* Categorical feature analysis
* Relationship between input features and mental health score

Visualization tools used:

* Matplotlib
* Seaborn

---

## 4. Feature Engineering

Relevant features were selected and transformed before model training.

The feature engineering process includes:

* Numerical feature preprocessing
* Categorical feature encoding
* Skewness handling
* Feature scaling
* Column transformation
* Pipeline-based preprocessing

Using a unified preprocessing pipeline ensures that the same transformations are applied during both training and prediction.

---

# 📊 Model Training & Evaluation

Three regression models were trained and evaluated:

1. Linear Regression
2. Random Forest Regressor
3. Random Forest Regressor with hyperparameter tuning

The models were evaluated using:

* **R² Score**
* **Mean Absolute Error (MAE)**
* **Root Mean Squared Error (RMSE)**

## Model Performance

| Model                   |   Testing R² | Training R² |          MAE |         RMSE |
| ----------------------- | -----------: | ----------: | -----------: | -----------: |
| Linear Regression       |     0.739794 |    0.723677 |     0.536178 |     0.676032 |
| Random Forest (Default) | **0.878017** |    0.980907 | **0.346502** | **0.462870** |
| Random Forest (Tuned)   |     0.865226 |    0.954656 |     0.368665 |     0.486533 |

---

## 🏆 Best Performing Model

The **Random Forest Regressor (Default)** achieved the best overall performance on the testing dataset.

### Final Model Metrics

| Metric      |        Score |
| ----------- | -----------: |
| Testing R²  | **0.878017** |
| Training R² |     0.980907 |
| MAE         | **0.346502** |
| RMSE        | **0.462870** |

The model achieved a testing **R² score of 0.878**, meaning it explains approximately **87.8% of the variance** in the target variable on the test dataset.

It also achieved the lowest MAE and RMSE among the evaluated models.

Therefore, the **Random Forest Regressor (Default)** was selected as the final model for the deployed prediction application.

---

## 📈 Model Comparison

### Linear Regression

* Testing R²: `0.739794`
* Training R²: `0.723677`
* MAE: `0.536178`
* RMSE: `0.676032`

Linear Regression provides a useful baseline but performs worse than the Random Forest models.

### Random Forest — Default

* Testing R²: `0.878017`
* Training R²: `0.980907`
* MAE: `0.346502`
* RMSE: `0.462870`

The default Random Forest achieved the strongest testing performance and was selected as the final model.

### Random Forest — Tuned

* Testing R²: `0.865226`
* Training R²: `0.954656`
* MAE: `0.368665`
* RMSE: `0.486533`

Although hyperparameter tuning reduced the training score and model complexity, the tuned model did not outperform the default Random Forest on the testing dataset.

---

## ⚠️ Training vs Testing Performance

The Random Forest models have higher training R² scores than testing R² scores:

**Default Random Forest**

```text
Training R²: 0.980907
Testing R² : 0.878017
```

**Tuned Random Forest**

```text
Training R²: 0.954656
Testing R² : 0.865226
```

This indicates some degree of **overfitting**, particularly in the default Random Forest model.

However, the default Random Forest still provides the best testing performance among the evaluated models and was selected for deployment based on its testing R², MAE, and RMSE.

---

# 🧠 Final Prediction Model

The final deployed model is:

```text
Random Forest Regressor
        ↓
Preprocessing Pipeline
        ↓
Trained Model
        ↓
Mental Health Score Prediction
```

The complete trained pipeline is stored in:

```text
Mental_health.pkl
```

The saved pipeline allows the backend to apply the required preprocessing and generate predictions using the trained model.

---

# ⚡ FastAPI Backend

The FastAPI backend exposes the machine learning model through a REST API.

## Prediction Endpoint

```http
POST /predict
```

The endpoint receives user input, validates the request, applies the saved preprocessing pipeline, and returns the predicted mental health score.

### Example Response

```json
{
  "predicted_score": 72.45
}
```

> The example value above is only for demonstrating the API response format.

The API uses **Pydantic** for request validation and **FastAPI** for REST API development.

---

# 🔄 Prediction Pipeline

```text
User Input
     ↓
React Frontend
     ↓
HTTP POST /predict
     ↓
FastAPI
     ↓
Pydantic Validation
     ↓
Saved ML Pipeline
     ↓
Feature Preprocessing
     ↓
Random Forest Regressor
     ↓
Predicted Mental Health Score
     ↓
JSON Response
     ↓
React Frontend
```

---

# 📂 Project Structure

```text
Mental_health_Score_predictor/
│
├── Student Social Media And Mental Health Impact.csv
├── Mental_health.pkl
├── Mental_health.ipynb
├── main.py
├── requirement.txt
├── README.md
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.jsx
        └── style.css
```

---

# 💻 Installation

## Clone Repository

```bash
git clone https://github.com/YashPatel1912/Mental_health_Score_predictor.git
```

## Navigate to Project

```bash
cd Mental_health_Score_predictor
```

## Install Python Dependencies

```bash
pip install -r requirement.txt
```

---

# ▶️ Run FastAPI Backend

Start the FastAPI server using Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

## FastAPI Documentation

Swagger UI:

```text
http://127.0.0.1:8000/docs
```
---

# ▶️ Run Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will then be available through the Vite development server.

---

# 🌐 Application Architecture

```text
                  ┌──────────────────────┐
                  │       React          │
                  │      Frontend        │
                  │      HTML/CSS        │
                  └──────────┬───────────┘
                             │
                             │ HTTP Request
                             ▼
                  ┌──────────────────────┐
                  │       FastAPI        │
                  │      REST API        │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Input Validation   │
                  │      Pydantic        │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Preprocessing        │
                  │ Pipeline             │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Random Forest        │
                  │ Regressor            │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Mental Health Score  │
                  │     Prediction       │
                  └──────────────────────┘
```

---

# ✨ Key Features

* Machine learning-based mental health score prediction
* Random Forest regression model
* Automated preprocessing pipeline
* Numerical and categorical feature handling
* Feature scaling and encoding
* Skewness handling
* Model evaluation and comparison
* Serialized ML model using Pickle
* FastAPI REST API
* Pydantic input validation
* Swagger API documentation
* React frontend
* Responsive user interface
* Frontend and backend integration
* Render deployment

---

# 📚 Machine Learning Concepts Used

This project demonstrates practical knowledge of:

* Supervised Learning
* Regression
* Exploratory Data Analysis
* Data Cleaning
* Feature Engineering
* Numerical Feature Processing
* Categorical Encoding
* Feature Scaling
* Skewness Transformation
* Train-Test Split
* Random Forest Regression
* Hyperparameter Tuning
* Model Comparison
* Model Evaluation
* R² Score
* MAE
* RMSE
* Scikit-learn Pipeline
* ColumnTransformer
* Model Serialization
* REST API Integration
* Machine Learning Deployment

---

# ⚠️ Disclaimer

This application is developed for **educational and machine learning demonstration purposes**.

The predicted score is generated by a machine learning model and should **not be interpreted as a clinical diagnosis, medical assessment, or substitute for professional mental-health advice**.

Users should consult a qualified mental-health professional for actual assessment, diagnosis, or treatment.

---

# 👨‍💻 Author

**Yash Patel**

Computer Engineering Student | Full Stack Developer | Machine Learning Enthusiast

### Technical Interests

* Full Stack Development
* Machine Learning
* Data Science
* DevOps
* Cloud Computing
* Software Engineering

---

# ⭐ Project Highlights

**Mental Health Score Predictor** is an end-to-end machine learning application combining:

**Machine Learning + Data Preprocessing + Random Forest Regression + Scikit-learn + FastAPI + React + REST API + GitHub + Render**

### Final Model Performance

```text
Model: Random Forest Regressor (Default)

Testing R² : 0.878017
MAE        : 0.346502
RMSE       : 0.462870
```

The project demonstrates how a trained machine learning regression model can be integrated into a complete web application and deployed as a production-style ML prediction service.
