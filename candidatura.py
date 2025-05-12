import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from sklearn.preprocessing import LabelEncoder

# Datos simulados de 10 candidatos
data = pd.DataFrame({
    "cv_text": [
        "Ingeniero con 10 años de experiencia en políticas públicas",
        "Economista joven con enfoque en innovación social",
        "Abogado con experiencia en derechos humanos",
        "Administrador público con trayectoria en gobierno local",
        "Médico con experiencia en salud rural y gestión hospitalaria",
        "Empresario tecnológico con experiencia en startups",
        "Líder comunitario con 15 años en organizaciones sociales",
        "Ingeniera ambiental con proyectos de sostenibilidad urbana",
        "Militar retirado con formación en seguridad ciudadana",
        "Profesor universitario con doctorado en educación pública"
    ],
    "promesas": [
        "Reducir la pobreza y mejorar la educación",
        "Crear empleos verdes y apoyar a emprendedores",
        "Fortalecer derechos civiles y justicia",
        "Modernizar la administración pública y reducir la corrupción",
        "Mejorar el sistema de salud y acceso a medicinas",
        "Fomentar la economía digital y capacitar jóvenes",
        "Empoderar comunidades vulnerables y fomentar participación ciudadana",
        "Combatir el cambio climático y promover transporte limpio",
        "Aumentar la seguridad en barrios y reformar la policía",
        "Transformar el sistema educativo y reducir la deserción escolar"
    ],
    "etiqueta": [1, 0, 1, 0, 1, 0, 1, 1, 0, 1]  # Ficticio: 1 = buen candidato, 0 = no destacado
})

# Concatenar texto del CV y las promesas
data["texto_total"] = data["cv_text"] + " " + data["promesas"]

# Vectorización del texto
vectorizer = TfidfVectorizer(max_features=500)
X = vectorizer.fit_transform(data["texto_total"]).toarray()
y = data["etiqueta"].values

# Dividir en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modelo de red neuronal simple
model = Sequential()
model.add(Dense(128, input_dim=X.shape[1], activation='relu'))
model.add(Dropout(0.3))
model.add(Dense(64, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=10, batch_size=2, validation_data=(X_test, y_test))

# Ejemplo de predicción con nuevos candidatos
nuevos_candidatos = [
    "Científico ambiental con experiencia internacional promueve energías limpias",
    "Profesor universitario con propuestas de inclusión digital y educación rural"
]
nuevos_vectores = vectorizer.transform(nuevos_candidatos).toarray()
predicciones = model.predict(nuevos_vectores)

# Mostrar resultados
for i, p in enumerate(predicciones):
    print(f"Candidato {i+1} → probabilidad de ser destacado: {p[0]:.2f}")