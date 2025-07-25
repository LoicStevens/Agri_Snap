import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
import os

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️ Using device: {device}")

# === Transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# === Datasets & Loaders
train_dir = 'Dataset_binary'  # contient /soil et /not_soil
dataset = datasets.ImageFolder(train_dir, transform=transform)
loader = DataLoader(dataset, batch_size=16, shuffle=True)

class_names = dataset.classes  # ['not_soil', 'soil']
print("🔍 Classes:", class_names)

# === Modèle
model = models.resnet18(pretrained=True)
model.fc = nn.Linear(model.fc.in_features, 2)
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.0001)

# === Entraînement simple
epochs = 5
for epoch in range(epochs):
    model.train()
    running_loss = 0.0
    correct = 0

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        preds = torch.argmax(outputs, 1)
        correct += (preds == labels).sum().item()

    accuracy = correct / len(dataset)
    print(f"Epoch {epoch+1}/{epochs} - Loss: {running_loss:.4f} - Acc: {accuracy:.2%}")

# === Sauvegarde
torch.save(model.state_dict(), "soil_filter_model.pth")
print("✅ Modèle sauvegardé : soil_filter_model.pth")
