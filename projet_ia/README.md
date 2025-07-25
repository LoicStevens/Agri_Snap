
# 🧠 Projet IA - API Flask

Ce projet est une API REST développée avec **Flask** pour exposer des fonctionnalités liées à l’intelligence artificielle (prédiction, classification, etc.).

## 🚀 Fonctionnalités principales

- [x] Endpoints RESTful pour interagir avec le modèle IA
- [x] Chargement de modèles entraînés (Pickle, Joblib, etc.)
- [x] Prédictions en temps réel via requêtes POST
- [x] Architecture modulaire (routes, modèles, services)

## 🛠️ Technologies utilisées

- Python 3.10+
- Flask
- Flask-CORS
- NumPy / Pandas
- scikit-learn
- Joblib / Pickle

## 📦 Installation locale

### 1. Cloner le dépôt

```bash
git clone https://github.com/LoicStevens/Agri_Snap.git

cd Agri_Snap/projet_ia
```
### 2. Installer les dépendances
```bash
pip install -r requirements.txt
```
### 3 Lancer le serveur
```bash
python app.py
Par défaut, le serveur tourne sur http://127.0.0.1:5000
```
## 🚀 Endpoints disponibles

### 📍 `GET /`
#### ➤ Test de disponibilité de l’API

- **Description** : Vérifie que l’API est bien en ligne.
- **Réponse** :
```json
"🌿 API de prédiction de sol et recommandation de culture"
```
### 📸 POST /check-soil
#### ➤ Vérifie si l’image fournie représente un sol ou non
- **Description** : Corps de la requête (Form-Data) :

    image : fichier image (.jpg, .png, etc.)
- **Réponse** :
 ```json {
  "is_soil": true
}
Codes d'erreur :

    400 : Image manquante

    500 : Erreur serveur (souvent liée au traitement d'image)
```
### 🌾 POST /predict-crop
#### Prédit le type de sol, sa couleur, les propriétés chimiques et les cultures recommandées à partir d’une image de sol + géolocalisation
Corps de la requête (Form-Data) :

    image : fichier image du sol

    lat : latitude de l’utilisateur

    lon : longitude de l’utilisateur

    {
  "is_soil": true,
  "predicted_soil_type": "clay soil",
  "confidence": 0.842,
  "soil_color": "gray",
  "properties": {
    "pH": 6.8,
    "N": 75.12,
    "P": 42.6,
    "K": 128.3,
    "temperature": 27.45,
    "humidity": 72.2,
    "precipitation": 56.4
  },
  "recommended_crops": [
    {"crop": "maize", "confidence": 0.834},
    {"crop": "rice", "confidence": 0.721},
    {"crop": "cotton", "confidence": 0.681}
  ]
}

