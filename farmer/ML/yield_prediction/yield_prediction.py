import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "crop_production_karnataka.csv")
MODEL_PATH = os.path.join(BASE_DIR, "yield_model.joblib")

def train_and_save():
    df = pd.read_csv(CSV_PATH)
    cat_cols = ['State_Name', 'District_Name', 'Season', 'Crop']
    for col in cat_cols:
        df[col] = df[col].astype(str).str.strip()

    valid = df[(df['Area'] > 0) & (df['Production'].notna()) & (df['Production'] >= 0)].copy()
    valid['Yield_Per_Ha'] = valid['Production'] / valid['Area']

    X = valid[cat_cols]
    y = valid['Yield_Per_Ha']

    ohe = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    X_ohe = ohe.fit_transform(X)

    model = RandomForestRegressor(n_estimators=60, max_depth=16, min_samples_leaf=2, random_state=42, n_jobs=-1)
    model.fit(X_ohe, y)

    joblib.dump((model, ohe, cat_cols), MODEL_PATH, compress=3)
    return model, ohe, cat_cols

def predict(state, district, season, crop, area_acres):
    if not os.path.exists(MODEL_PATH):
        model, ohe, cat_cols = train_and_save()
    else:
        model, ohe, cat_cols = joblib.load(MODEL_PATH)

    area_ha = float(area_acres) * 0.4047
    inp = pd.DataFrame([[state.strip(), district.strip(), season.strip(), crop.strip()]], columns=cat_cols)
    feat = ohe.transform(inp)
    if hasattr(feat, 'toarray'):
        feat = feat.toarray()
    yield_per_ha = float(model.predict(feat)[0])
    total_yield = round(yield_per_ha * area_ha, 2)
    return total_yield

if __name__ == '__main__':
    if len(sys.argv) >= 6:
        Jstate = sys.argv[1]
        Jdistrict = sys.argv[2]
        Jseason = sys.argv[3]
        Jcrops = sys.argv[4]
        Jarea = sys.argv[5]
        print(predict(Jstate, Jdistrict, Jseason, Jcrops, Jarea))
    else:
        train_and_save()
        print("Model trained and saved to", MODEL_PATH)
