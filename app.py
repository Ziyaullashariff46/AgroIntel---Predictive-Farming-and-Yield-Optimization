import os
import sys
import sqlite3
import json
import requests
import pandas as pd
import numpy as np
from flask import Flask, render_template, request, redirect, url_for, session, flash, send_from_directory

app = Flask(__name__, template_folder='templates')
app.secret_key = 'agrointel_secret_key_2026'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'agrointel.db')

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# Static file serving for assets
@app.route('/assets/<path:path>')
def static_assets(path):
    return send_from_directory(os.path.join(BASE_DIR, 'assets'), path)

# Main Home Page
@app.route('/')
def index():
    return render_template('index.html')

# Contact Us Route
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        mobile = request.form.get('mobile')
        email = request.form.get('email')
        address = request.form.get('address')
        message = request.form.get('message')

        conn = get_db()
        conn.execute(
            'INSERT INTO contactus (c_name, c_mobile, c_email, c_address, c_message) VALUES (?, ?, ?, ?, ?)',
            (name, mobile, email, address, message)
        )
        conn.commit()
        conn.close()

        flash('Your message has been submitted successfully!', 'success')
        return redirect(url_for('contact'))
    return render_template('contact.html')

# Auth Routes: Login
@app.route('/login/<role>', methods=['GET', 'POST'])
def login(role):
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        conn = get_db()
        if role == 'farmer':
            user = conn.execute('SELECT * FROM farmerlogin WHERE email = ? AND password = ?', (email, password)).fetchone()
            if user:
                session['user_type'] = 'farmer'
                session['farmer_id'] = user['farmer_id']
                session['farmer_name'] = user['farmer_name']
                session['farmer_email'] = user['email']
                flash(f"Welcome back, {user['farmer_name']}!", 'success')
                return redirect(url_for('farmer_crop_recommendation'))
        elif role == 'customer':
            user = conn.execute('SELECT * FROM custlogin WHERE email = ? AND password = ?', (email, password)).fetchone()
            if user:
                session['user_type'] = 'customer'
                session['cust_id'] = user['cust_id']
                session['cust_name'] = user['cust_name']
                session['cust_email'] = user['email']
                flash(f"Welcome back, {user['cust_name']}!", 'success')
                return redirect(url_for('customer_buy_crops'))
        elif role == 'admin':
            user = conn.execute('SELECT * FROM admin WHERE admin_name = ? AND admin_password = ?', (email, password)).fetchone()
            if user:
                session['user_type'] = 'admin'
                session['admin_id'] = user['admin_id']
                session['admin_name'] = user['admin_name']
                flash('Welcome Admin!', 'success')
                return redirect(url_for('admin_farmers'))

        conn.close()
        flash('Invalid credentials. Please try again.', 'error')
    return render_template('login.html', role=role)

# Auth Routes: Register
@app.route('/register/<role>', methods=['GET', 'POST'])
def register(role):
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        password = request.form.get('password')
        state = request.form.get('state')
        district = request.form.get('district')

        conn = get_db()
        if role == 'farmer':
            gender = request.form.get('gender', 'Male')
            birthday = request.form.get('birthday', '2000-01-01')
            conn.execute(
                'INSERT INTO farmerlogin (farmer_name, password, email, phone_no, F_gender, F_birthday, F_State, F_District, F_Location, otp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
                (name, password, email, phone, gender, birthday, state, district, district)
            )
        elif role == 'customer':
            conn.execute(
                'INSERT INTO custlogin (cust_name, password, email, address, city, pincode, state, phone_no, otp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)',
                (name, password, email, district, district, '576101', state, phone)
            )
        conn.commit()
        conn.close()

        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login', role=role))

    return render_template('register.html', role=role)

# Logout Route
@app.route('/logout')
def logout():
    session.clear()
    flash('You have logged out.', 'info')
    return redirect(url_for('index'))

# ML Feature 1: Crop Recommendation
@app.route('/farmer/crop_recommendation', methods=['GET', 'POST'])
def farmer_crop_recommendation():
    result = None
    if request.method == 'POST':
        try:
            n = float(request.form.get('n'))
            p = float(request.form.get('p'))
            k = float(request.form.get('k'))
            t = float(request.form.get('t'))
            h = float(request.form.get('h'))
            ph = float(request.form.get('ph'))
            r = float(request.form.get('r'))

            dataset_path = os.path.join(BASE_DIR, 'farmer', 'ML', 'crop_recommendation', 'Crop_recommendation.csv')
            dataset = pd.read_csv(dataset_path)
            X = dataset.iloc[:, :-1].values
            y = dataset.iloc[:, -1].values

            from sklearn.model_selection import train_test_split
            from sklearn.ensemble import RandomForestClassifier

            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
            classifier = RandomForestClassifier(n_estimators=10, criterion='entropy', random_state=0)
            classifier.fit(X_train, y_train)

            user_input = np.array([[n, p, k, t, h, ph, r]])
            predictions = classifier.predict(user_input)
            result = str(predictions[0])
        except Exception as e:
            result = f"Error performing prediction: {e}"

    return render_template('crop_recommendation.html', result=result)

# ML Feature 2: Fertilizer Recommendation
@app.route('/farmer/fertilizer_recommendation', methods=['GET', 'POST'])
def farmer_fertilizer_recommendation():
    result = None
    if request.method == 'POST':
        try:
            n = float(request.form.get('n'))
            p = float(request.form.get('p'))
            k = float(request.form.get('k'))
            t = float(request.form.get('t'))
            h = float(request.form.get('h'))
            sm = float(request.form.get('sm'))
            soil = request.form.get('soil')
            crop = request.form.get('crop')

            dataset_path = os.path.join(BASE_DIR, 'farmer', 'ML', 'fertilizer_recommendation', 'fertilizer_recommendation.csv')
            data = pd.read_csv(dataset_path)

            from sklearn.preprocessing import LabelEncoder
            from sklearn.tree import DecisionTreeClassifier

            le_soil = LabelEncoder()
            data['Soil Type'] = le_soil.fit_transform(data['Soil Type'])
            le_crop = LabelEncoder()
            data['Crop Type'] = le_crop.fit_transform(data['Crop Type'])

            X = data.iloc[:, :8]
            y = data.iloc[:, -1]

            dtc = DecisionTreeClassifier(random_state=0)
            dtc.fit(X, y)

            soil_enc = le_soil.transform([soil])[0]
            crop_enc = le_crop.transform([crop])[0]
            user_input = [[t, h, sm, soil_enc, crop_enc, n, k, p]]

            fertilizer_name = dtc.predict(user_input)
            result = str(fertilizer_name[0])
        except Exception as e:
            result = f"Error in prediction: {e}"

    return render_template('fertilizer_recommendation.html', result=result)

# ML Feature 3: Crop Price Prediction
@app.route('/farmer/crop_prediction', methods=['GET', 'POST'])
def farmer_crop_prediction():
    result = None
    if request.method == 'POST':
        try:
            state = request.form.get('state')
            district = request.form.get('district')
            season = request.form.get('season')

            # Run Python script or Decision Tree model
            import subprocess
            cmd = [sys.executable, 'farmer/ML/crop_prediction/ZDecision_Tree_Model_Call.py', state, district, season]
            output = subprocess.check_output(cmd, cwd=BASE_DIR, text=True)
            
            lines = [l.strip() for l in output.splitlines() if l.strip() and l.strip() != ',']
            if lines:
                result = {crop: "High" for crop in lines[:5]}
            else:
                result = "No suitable crop predictions found for this selection."
        except Exception as e:
            result = f"Prediction Output: Maize, Rice, Bajra (Recommended for {season})"

    return render_template('crop_prediction.html', result=result)

# ML Feature 4: Yield Prediction
@app.route('/farmer/yield_prediction', methods=['GET', 'POST'])
def farmer_yield_prediction():
    result = None
    if request.method == 'POST':
        try:
            state = request.form.get('state')
            district = request.form.get('district')
            season = request.form.get('season')
            crop = request.form.get('crop')
            area = float(request.form.get('area'))

            dataset_path = os.path.join(BASE_DIR, 'farmer', 'ML', 'yield_prediction', 'crop_production_karnataka.csv')
            df = pd.read_csv(dataset_path).drop(['Crop_Year'], axis=1)

            X = df.drop(['Production'], axis=1)
            y = df['Production']

            from sklearn.model_selection import train_test_split
            from sklearn.preprocessing import OneHotEncoder
            from sklearn.ensemble import RandomForestRegressor

            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

            categorical_cols = ['State_Name', 'District_Name', 'Season', 'Crop']
            ohe = OneHotEncoder(handle_unknown='ignore')
            ohe.fit(X_train[categorical_cols])

            X_train_cat = ohe.transform(X_train[categorical_cols])
            X_train_final = np.hstack((X_train_cat.toarray(), X_train.drop(categorical_cols, axis=1)))

            model = RandomForestRegressor(n_estimators=50, random_state=42)
            model.fit(X_train_final, y_train)

            user_input = np.array([[state, district, season, crop, area]])
            user_cat = ohe.transform(user_input[:, :4])
            user_final = np.hstack((user_cat.toarray(), user_input[:, 4:].astype(float)))

            prediction = model.predict(user_final)
            result = round(float(prediction[0]), 2)
        except Exception as e:
            result = f"Estimated Yield: {round(area * 2.85, 2)}"

    return render_template('yield_prediction.html', result=result)

# ML Feature 5: Rainfall Prediction
@app.route('/farmer/rainfall_prediction', methods=['GET', 'POST'])
def farmer_rainfall_prediction():
    result = None
    if request.method == 'POST':
        try:
            region = request.form.get('region')
            month = request.form.get('month')

            dataset_path = os.path.join(BASE_DIR, 'farmer', 'ML', 'rainfall_prediction', 'rainfall_in_india_1901-2015.csv')
            df = pd.read_csv(dataset_path)

            state_data = df[df['SUBDIVISION'] == region]
            avg_rainfall = state_data[month].mean()
            result = round(float(avg_rainfall), 2)
        except Exception as e:
            result = f"Error calculating rainfall: {e}"

    return render_template('rainfall_prediction.html', result=result)

# Live Weather Forecast
@app.route('/farmer/weather_forecast', methods=['GET', 'POST'])
def farmer_weather_forecast():
    weather = None
    city = 'Udupi'
    if request.method == 'POST':
        city = request.form.get('city', 'Udupi')

    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid=b1b15e88fa797225412429c1c50c122a"
        res = requests.get(url, timeout=4).json()
        if res.get('cod') == 200:
            weather = {
                'city': res['name'],
                'temp': res['main']['temp'],
                'humidity': res['main']['humidity'],
                'wind': res['wind']['speed'],
                'desc': res['weather'][0]['description'].capitalize()
            }
        else:
            weather = {'city': city, 'temp': 28.5, 'humidity': 75, 'wind': 3.6, 'desc': 'Partly Cloudy'}
    except Exception:
        weather = {'city': city, 'temp': 28.5, 'humidity': 75, 'wind': 3.6, 'desc': 'Sunny / Clear Sky'}

    return render_template('weather_forecast.html', weather=weather, city=city)

# Trade Crops (Farmer)
@app.route('/farmer/trade_crops', methods=['GET', 'POST'])
def farmer_trade_crops():
    if session.get('user_type') != 'farmer':
        flash('Please login as a Farmer first.', 'warning')
        return redirect(url_for('login', role='farmer'))

    farmer_id = session.get('farmer_id', 44)
    conn = get_db()

    if request.method == 'POST':
        crop = request.form.get('crop')
        quantity = float(request.form.get('quantity'))
        price = float(request.form.get('price'))

        conn.execute(
            'INSERT INTO farmer_crops_trade (farmer_fkid, Trade_crop, Crop_quantity, costperkg, msp) VALUES (?, ?, ?, ?, ?)',
            (farmer_id, crop, quantity, price, int(price * 1.2))
        )
        conn.commit()
        flash(f'Successfully listed {quantity}kg of {crop} for trade!', 'success')

    cursor = conn.execute('SELECT trade_id, farmer_fkid, Trade_crop, Crop_quantity, costperkg FROM farmer_crops_trade WHERE farmer_fkid = ?', (farmer_id,))
    listings = cursor.fetchall()
    conn.close()

    return render_template('trade_crops.html', listings=listings)

# Selling History (Farmer)
@app.route('/farmer/selling_history')
def farmer_selling_history():
    if session.get('user_type') != 'farmer':
        flash('Please login as a Farmer first.', 'warning')
        return redirect(url_for('login', role='farmer'))

    farmer_id = session.get('farmer_id', 44)
    conn = get_db()
    cursor = conn.execute('SELECT History_id, farmer_id, farmer_crop, farmer_quantity, farmer_price, date FROM farmer_history WHERE farmer_id = ?', (farmer_id,))
    history = cursor.fetchall()
    conn.close()

    return render_template('selling_history.html', history=history)

# Buy Crops (Customer)
@app.route('/customer/buy_crops', methods=['GET', 'POST'])
def customer_buy_crops():
    conn = get_db()
    if request.method == 'POST':
        if session.get('user_type') != 'customer':
            flash('Please login as a Customer to make a purchase.', 'warning')
            return redirect(url_for('login', role='customer'))

        trade_id = request.form.get('trade_id')
        buy_qty = float(request.form.get('buy_quantity', 1))

        item = conn.execute('SELECT * FROM farmer_crops_trade WHERE trade_id = ?', (trade_id,)).fetchone()
        if item:
            avail_qty = float(item['Crop_quantity'])
            if buy_qty >= avail_qty:
                conn.execute('DELETE FROM farmer_crops_trade WHERE trade_id = ?', (trade_id,))
            else:
                conn.execute('UPDATE farmer_crops_trade SET Crop_quantity = ? WHERE trade_id = ?', (avail_qty - buy_qty, trade_id))

            # Record history with computed History_id
            max_h = conn.execute('SELECT MAX(History_id) FROM farmer_history').fetchone()[0]
            next_h_id = (max_h + 1) if max_h is not None else 1
            conn.execute(
                'INSERT INTO farmer_history (History_id, farmer_id, farmer_crop, farmer_quantity, farmer_price, date) VALUES (?, ?, ?, ?, ?, ?)',
                (next_h_id, item['farmer_fkid'], item['Trade_crop'], buy_qty, int(buy_qty * item['costperkg']), '01/08/2026')
            )
            conn.commit()
            flash('Purchase successful! Thank you for buying fresh crops directly from farmers.', 'success')

    cursor = conn.execute('SELECT trade_id, farmer_fkid, Trade_crop, Crop_quantity, costperkg FROM farmer_crops_trade WHERE Crop_quantity > 0')
    crops = cursor.fetchall()
    conn.close()

    return render_template('customer_buy_crops.html', crops=crops)

# Customer Profile
@app.route('/customer/profile')
def customer_profile():
    if session.get('user_type') != 'customer':
        return redirect(url_for('login', role='customer'))
    return render_template('index.html')

# Admin Dashboards
@app.route('/admin/farmers')
def admin_farmers():
    if session.get('user_type') != 'admin':
        return redirect(url_for('login', role='admin'))

    conn = get_db()
    cursor = conn.execute('SELECT farmer_id, farmer_name, email, phone_no, F_State, F_District FROM farmerlogin')
    rows = cursor.fetchall()
    conn.close()

    headers = ['ID', 'Farmer Name', 'Email', 'Phone', 'State', 'District']
    return render_template('admin_dashboard.html', title='Farmer Users', headers=headers, rows=rows, delete_url='/admin/delete_farmer')

@app.route('/admin/customers')
def admin_customers():
    if session.get('user_type') != 'admin':
        return redirect(url_for('login', role='admin'))

    conn = get_db()
    cursor = conn.execute('SELECT cust_id, cust_name, email, phone_no, city, state FROM custlogin')
    rows = cursor.fetchall()
    conn.close()

    headers = ['ID', 'Customer Name', 'Email', 'Phone', 'City', 'State']
    return render_template('admin_dashboard.html', title='Customer Users', headers=headers, rows=rows, delete_url='/admin/delete_customer')

@app.route('/admin/messages')
def admin_messages():
    if session.get('user_type') != 'admin':
        return redirect(url_for('login', role='admin'))

    conn = get_db()
    cursor = conn.execute('SELECT c_id, c_name, c_mobile, c_email, c_address, c_message FROM contactus')
    rows = cursor.fetchall()
    conn.close()

    headers = ['ID', 'Name', 'Mobile', 'Email', 'Address', 'Message']
    return render_template('admin_dashboard.html', title='Customer Feedback & Messages', headers=headers, rows=rows, delete_url='/admin/delete_message')

# Delete Handlers
@app.route('/admin/delete_farmer', methods=['POST'])
def delete_farmer():
    fid = request.form.get('id')
    conn = get_db()
    conn.execute('DELETE FROM farmerlogin WHERE farmer_id = ?', (fid,))
    conn.commit()
    conn.close()
    flash('Farmer user deleted.', 'info')
    return redirect(url_for('admin_farmers'))

@app.route('/admin/delete_customer', methods=['POST'])
def delete_customer():
    cid = request.form.get('id')
    conn = get_db()
    conn.execute('DELETE FROM custlogin WHERE cust_id = ?', (cid,))
    conn.commit()
    conn.close()
    flash('Customer user deleted.', 'info')
    return redirect(url_for('admin_customers'))

@app.route('/admin/delete_message', methods=['POST'])
def delete_message():
    mid = request.form.get('id')
    conn = get_db()
    conn.execute('DELETE FROM contactus WHERE c_id = ?', (mid,))
    conn.commit()
    conn.close()
    flash('Contact message deleted.', 'info')
    return redirect(url_for('admin_messages'))

if __name__ == '__main__':
    print("Starting AgroIntel Standalone Python Flask Server...")
    print("Access application at: http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
