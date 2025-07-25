from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import joblib
import pandas as pd
from io import BytesIO
import random
import requests
import gc

# ============ CONFIGURATION ============
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
WEATHER_API_KEY = "41164adf26a1496389710628251207"

# ============ TRANSFORM IMAGE ==========
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ============ MODEL 1: soil / not_soil ============
soil_binary_model = models.resnet18(weights=None)
soil_binary_model.fc = torch.nn.Linear(soil_binary_model.fc.in_features, 2)
soil_binary_model.load_state_dict(torch.load("soil_filter_model.pth", map_location=device))
soil_binary_model.to(device)
soil_binary_model.eval()
soil_binary_classes = ['not_soil', 'soil']

def is_soil_image(image_bytes):
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = soil_binary_model(tensor)
        prediction = torch.argmax(output, dim=1).item()
    del tensor, output
    gc.collect()
    return soil_binary_classes[prediction] == "soil"

# ============ MODEL 2: soil type ============
class_names = ['alluvial soil', 'black soil', 'clay soil', 'red soil']
soil_type_model = models.resnet18(weights=None)
soil_type_model.fc = torch.nn.Linear(soil_type_model.fc.in_features, len(class_names))
soil_type_model.load_state_dict(torch.load("best_soil_model.pth", map_location=device))
soil_type_model.to(device)
soil_type_model.eval()

# ============ MODEL 3: Naive Bayes crop model ============
crop_model, crop_classes = joblib.load("NBClassifier.pkl")

# ============ Couleurs par type de sol ============
soil_color_mapping = {
    'clay soil': ['gray'],
    'alluvial soil': ['brown', 'yellowish brown', 'dark brown', 'darkbrown', 'lihgtish brown', 'other'],
    'black soil': ['black'],
    'red soil': ['red', 'reddish brown', 'redishbrown']
}

def get_plausible_color(soil_type):
    colors = soil_color_mapping.get(soil_type.lower().strip(), [])
    return random.choice(colors) if colors else "unknown"

def predict_soil_type(image_tensor):
    image_tensor = image_tensor.to(device)
    with torch.no_grad():
        outputs = soil_type_model(image_tensor)
        probabilities = F.softmax(outputs, dim=1)[0]
        predicted_idx = torch.argmax(probabilities).item()
    del image_tensor, outputs
    gc.collect()
    return class_names[predicted_idx], probabilities[predicted_idx].item()

def get_avg_soil_properties_from_csv(color, filepath='soil crop recommendation.txt'):
    try:
        df = pd.read_csv(filepath)
        df['Soilcolor'] = df['Soilcolor'].str.strip('"').str.strip().str.lower()
        df['Soilcolor'] = df['Soilcolor'].replace({
            'redish brown': 'reddish brown',
            'darkbrown': 'dark brown',
            'lihgtish brown': 'lightish brown',
            'redishbrown': 'reddish brown',
        })

        if color.lower() not in df['Soilcolor'].values:
            print(f"❌ Couleur {color} introuvable dans le CSV.")
            return None

        color_data = df[df['Soilcolor'] == color.lower()]
        return {
            'pH': round(color_data['Ph'].mean(), 2),
            'N': round(color_data['N'].mean(), 4),
            'P': round(color_data['P'].mean(), 2),
            'K': round(color_data['K'].mean(), 2)
        }
    except Exception as e:
        print("💥 Erreur lecture CSV :", str(e))
        return None

# ============ RESCALE N, P, K ============
def rescale_value(value, old_min, old_max, new_min, new_max):
    if old_max - old_min == 0:
        return new_min
    return ((value - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min

def rescale_npk(properties):
    properties["N"] = rescale_value(properties["N"], 0.000261711, 0.6956, 0, 140)
    properties["P"] = rescale_value(properties["P"], 0.0, 782.0, 5, 145)
    properties["K"] = rescale_value(properties["K"], 41.134, 2119.0, 5, 205)
    return properties

# ============ WEATHER API ============
def get_weather_from_coords(lat, lon):
    try:
        url = f"http://api.weatherapi.com/v1/forecast.json?key={WEATHER_API_KEY}&q={lat},{lon}&days=30"
        res = requests.get(url)
        data = res.json()

        forecast_days = data['forecast']['forecastday']
        
        # Initialisation
        total_precip = 0.0
        total_temp = 0.0
        total_humidity = 0.0
        count = len(forecast_days)

        # Boucle sur chaque jour
        for day in forecast_days:
            total_precip += day['day']['totalprecip_mm']
            total_temp += day['day']['avgtemp_c']
            total_humidity += day['day']['avghumidity']

        return {
            'temperature': round(total_temp / count, 2),
            'humidity': round(total_humidity / count, 2),
            'precipitation': round(total_precip, 2)  # cumul total sur 30 jours
        }

    except Exception as e:
        print("🌧️ Erreur API WeatherAPI :", e)
        return None


# ============ PREDICTION ============
def predict_top_crops(properties, k=3):
    try:
        input_data = [[
            float(properties['N']),
            float(properties['P']),
            float(properties['K']),
            float(properties['temperature']),
            float(properties['humidity']),
            float(properties['pH']),
            float(properties['precipitation'])
        ]]
        proba = crop_model.predict_proba(input_data)[0]
        predictions = sorted(zip(crop_classes, proba), key=lambda x: x[1], reverse=True)

        return [{"crop": c, "confidence": round(p, 3)} for c, p in predictions[:k]]
    except Exception as e:
        print("💥 Erreur dans predict_top_crops :", str(e))
        return [{"crop": "Erreur de prédiction", "confidence": 0.0}]

# ============ ROUTES ===============
@app.route("/")
def home():
    return "🌿 API de prédiction de sol et recommandation de culture"

@app.route("/check-soil", methods=["POST"])
def check_soil():
    print(" Requête reçue pour /check-soil")
    print("Headers:", request.headers)
    print("Files:", request.files)
    print("Form:", request.form)
    if 'image' not in request.files:
        print("❌ Erreur: Aucun fichier image reçu")
        return jsonify({"error": "Aucune image reçue."}), 400
    try:
        image = request.files['image']
        print("Image reçue:", image.filename, "Content-Type:", image.content_type, "Size:", image.content_length)
        result = is_soil_image(image.read())
        print("Résultat is_soil:", result)
        return jsonify({"is_soil": result})
    except Exception as e:
        print("💥 Erreur dans /check-soil :", str(e))
        return jsonify({"error": "Erreur de traitement", "details": str(e)}), 500


@app.route('/predict-crop', methods=['POST'])
def predict_crop():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "Image manquante"}), 400

        image = request.files['image']
        image_bytes = image.read()

        if not is_soil_image(image_bytes):
            return jsonify({"is_soil": False, "message": "L'image ne représente pas un sol."}), 200

        lat = request.form.get("lat")
        lon = request.form.get("lon")
        if not lat or not lon:
            return jsonify({"error": "Latitude ou longitude manquantes"}), 400

        weather = get_weather_from_coords(lat, lon)
        if not weather:
            return jsonify({"error": "Impossible de récupérer la météo"}), 500

        img_tensor = transform(Image.open(BytesIO(image_bytes)).convert("RGB")).unsqueeze(0)
        soil_type, confidence = predict_soil_type(img_tensor)
        soil_color = get_plausible_color(soil_type)

        props = get_avg_soil_properties_from_csv(soil_color)
        if not props:
            return jsonify({"error": f"Propriétés non trouvées pour la couleur : {soil_color}"}), 500

        props.update(weather)

        # 🔁 Rescale des valeurs N, P et K avant prédiction
        props = rescale_npk(props)

        crops = predict_top_crops(props)

        return jsonify({
            "is_soil": True,
            "predicted_soil_type": soil_type,
            "confidence": round(confidence, 3),
            "soil_color": soil_color,
            "properties": props,
            "recommended_crops": crops
        })

    except Exception as e:
        print("💥 Erreur dans /predict-crop :", str(e))
        return jsonify({"error": "Erreur interne", "details": str(e)}), 500

# ============ LANCEMENT ================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
