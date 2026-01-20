"""
Air Quality Chatbot Service

Handles intent classification and response generation for user queries.
"""

import joblib
import json
import re
import requests
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load Env
load_dotenv(Path(__file__).parent.parent / ".env")
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
    # Use generic alias for stability
    gemini_model = genai.GenerativeModel('models/gemini-flash-latest')
else:
    gemini_model = None

class AirQualityChatbot:
    def __init__(self):
        """Initialize the chatbot with trained models and data"""
        # Absolute path to models directory
        base_dir = Path(__file__).parent.parent
        models_path = base_dir / "models"
        
        # Load trained models
        try:
            self.model = joblib.load(models_path / "chatbot_intent_model.pkl")
            self.vectorizer = joblib.load(models_path / "chatbot_vectorizer.pkl")
            
            # Load intents data
            with open(models_path / "chatbot_intents.json", 'r', encoding='utf-8') as f:
                intents_data = json.load(f)
                self.intents_db = {intent['tag']: intent for intent in intents_data['intents']}
            
            # Station names
            self.station_names = ["Peenya", "RVCE_Mailsandra", "Silkboard"]
            print("[Chatbot] Initialized successfully")
        except Exception as e:
            print(f"[Chatbot] Error initializing: {e}")
            self.model = None
            self.vectorizer = None
            self.intents_db = {}
    
    def predict_intent(self, query: str) -> Tuple[str, float]:
        """
        Predict the intent of a user query
        
        Returns:
            (intent_tag, confidence)
        """
        if not self.model:
            return "error", 0.0

        query_vec = self.vectorizer.transform([query.lower()])
        intent = self.model.predict(query_vec)[0]
        confidence = max(self.model.predict_proba(query_vec)[0])
        return intent, confidence
    
    def extract_location(self, query: str, default_station: Optional[str] = None) -> str:
        """Extract station name from query; fall back to default_station if provided."""
        query_lower = query.lower()
        
        for station in self.station_names:
            if station.lower() in query_lower:
                return station
            # Check for shortened names
            if "rvce" in query_lower or "mailsandra" in query_lower:
                return "RVCE_Mailsandra"
            if "silk" in query_lower or "silboard" in query_lower:
                return "Silkboard"
        
        if default_station in self.station_names:
            return default_station
        return "Peenya"  # Default station
    
    def get_aqi_category(self, aqi: int) -> str:
        """Convert AQI value to category"""
        if aqi <= 50:
            return "Good"
        elif aqi <= 100:
            return "Satisfactory"
        elif aqi <= 200:
            return "Moderate"
        elif aqi <= 300:
            return "Poor"
        elif aqi <= 400:
            return "Very Poor"
        else:
            return "Severe"
    
    def get_aqi_emoji(self, aqi: int) -> str:
        """Get emoji for AQI level"""
        if aqi <= 50:
            return "🟢"
        elif aqi <= 100:
            return "🟡"
        elif aqi <= 200:
            return "🟠"
        elif aqi <= 300:
            return "🔴"
        elif aqi <= 400:
            return "🟣"
        else:
            return "🟤"
    
    def fetch_latest_data(self, station: str) -> Dict:
        """Call API to get latest data for a station"""
        try:
            # Assumes API is running on localhost:8000 (updated to port 8000 as per latest state)
            response = requests.get(
                f"http://127.0.0.1:8000/latest?station_id={station}",
                timeout=5
            )
            return response.json()
        except Exception as e:
            print(f"[Chatbot] Error fetching data: {e}")
            return {"error": "Could not fetch data"}
    
    def fetch_comparison_data(self) -> List[Dict]:
        """Call API to get comparison data"""
        try:
            response = requests.get(
                "http://127.0.0.1:8000/comparison",
                timeout=5
            )
            return response.json()
        except Exception as e:
            print(f"[Chatbot] Error fetching comparison: {e}")
            return []
    
    def generate_response(self, intent: str, query: str, station_id: Optional[str] = None) -> Dict:
        """
        Generate response based on detected intent
        
        Returns:
            {
                "response": str,
                "intent": str,
                "data": dict (optional)
            }
        """
        # Check if this intent requires API call
        if intent == "check_aqi":
            return self._handle_check_aqi(query, station_id=station_id)
        
        elif intent == "outdoor_safety":
            return self._handle_outdoor_safety(query, station_id=station_id)
        
        elif intent == "compare_stations":
            return self._handle_compare_stations()
        
        # For all other intents, return template response
        intent_data = self.intents_db.get(intent)
        if intent_data:
            import random
            response = random.choice(intent_data['responses'])
            return {
                "response": response,
                "intent": intent
            }
        
        # Fallback
        return {
            "response": "I'm not sure how to answer that. Try asking about current AQI, air quality, or if it's safe to go outside!",
            "intent": "fallback"
        }
    
    def _handle_check_aqi(self, query: str, station_id: Optional[str] = None) -> Dict:
        """Handle AQI check queries"""
        station = self.extract_location(query, default_station=station_id)
        data = self.fetch_latest_data(station)
        
        if "error" in data:
            return {
                "response": f"Sorry, I couldn't fetch the latest data for {station}. Please try again later or check the Dashboard.",
                "intent": "check_aqi"
            }
        
        # Calculate AQI from PM2.5 (simplified - using PM25_lag_1 as proxy)
        pm25 = data.get("PM25_lag_1", 0)
        # Fallback if lag_1 is 0 but current PM2.5 exists
        if pm25 == 0 and "PM2.5" in data:
             pm25 = data.get("PM2.5", 0) 
             
        aqi = int(pm25 * 2.5)  # Rough approximation
        category = self.get_aqi_category(aqi)
        
        response = (
            f"{station} air quality\n"
            f"AQI: {aqi} ({category})\n"
            f"PM2.5: {pm25:.1f} ug/m3\n"
            f"PM10: {data.get('PM10', 0):.1f} ug/m3\n"
            f"NO2: {data.get('NO2', 0):.1f} ppb\n"
        )
        
        if aqi <= 50:
            response += "Advice: Good for outdoor activity."
        elif aqi <= 100:
            response += "Advice: Acceptable for most; sensitive groups monitor symptoms."
        elif aqi <= 200:
            response += "Advice: Sensitive groups limit prolonged outdoor exertion."
        elif aqi <= 300:
            response += "Advice: Everyone may experience effects; reduce outdoor activity."
        else:
            response += "Advice: Avoid outdoor activity; stay indoors and use filtration."
        
        return {
            "response": response,
            "intent": "check_aqi",
            "data": {
                "station": station,
                "aqi": aqi,
                "category": category,
                "pm25": float(pm25)
            }
        }
    
    def _handle_outdoor_safety(self, query: str, station_id: Optional[str] = None) -> Dict:
        """Handle outdoor safety queries"""
        station = self.extract_location(query, default_station=station_id)
        data = self.fetch_latest_data(station)
        
        if "error" in data:
            return {
                "response": "Sorry, I couldn't check the current conditions. Please try again.",
                "intent": "outdoor_safety"
            }
        
        pm25 = data.get("PM25_lag_1", 0)
        aqi = int(pm25 * 2.5)
        category = self.get_aqi_category(aqi)
        
        response = f"Safety assessment for {station}\nCurrent AQI: {aqi} ({category})\n"
        
        if aqi <= 50:
            response += "Recommendation: Safe to be outdoors."
        elif aqi <= 100:
            response += "Recommendation: Generally safe; sensitive groups monitor symptoms."
        elif aqi <= 200:
            response += "Recommendation: Limit prolonged outdoor exertion; consider a mask if sensitive."
        elif aqi <= 300:
            response += "Recommendation: Avoid outdoor activity where possible; use N95 if you must go out."
        else:
            response += "Recommendation: Stay indoors; use air filtration; avoid outdoor activity."
        
        return {
            "response": response,
            "intent": "outdoor_safety",
            "data": {
                "station": station,
                "aqi": aqi,
                "safe": aqi <= 100
            }
        }
    
    def _handle_compare_stations(self) -> Dict:
        """Handle station comparison queries"""
        stations_data = self.fetch_comparison_data()
        
        if not stations_data or isinstance(stations_data, dict) and "error" in stations_data:
            return {
                "response": "Sorry, I couldn't fetch comparison data. Please check the Comparison page on the Dashboard.",
                "intent": "compare_stations"
            }
        
        response = "Air quality comparison (all stations)\n"
        
        # Sort by AQI
        stations_data = sorted(stations_data, key=lambda x: x.get('AQI', 999))
        
        for station in stations_data:
            aqi = station.get('AQI', 0)
            category = self.get_aqi_category(aqi)
            
            response += f"{station['name']}: AQI {aqi} ({category}), PM2.5 {station.get('PM25', 0)} ug/m3, PM10 {station.get('PM10', 0)} ug/m3\n"
        
        # Find best and worst
        best = stations_data[0]
        worst = stations_data[-1]
        
        response += f"Best: {best['name']} (AQI {best['AQI']}) | Worst: {worst['name']} (AQI {worst['AQI']})"
        
        return {
            "response": response,
            "intent": "compare_stations",
            "data": stations_data
        }
    
    def process_query(self, query: str, station_id: Optional[str] = None) -> Dict:
        """
        Main processing function for user queries
        
        Args:
            query: User's question
            
        Returns:
            {
                "response": str,
                "intent": str,
                "confidence": float,
                "data": dict (optional)
            }
        """
        # Predict intent
        intent, confidence = self.predict_intent(query)

        # Low confidence fallback: keyword routing for the critical live intents
        if confidence < 0.15:
            q = query.lower()
            if any(k in q for k in ["aqi", "air quality index", "air quality", "how bad is the air"]):
                intent = "check_aqi"
            elif any(k in q for k in ["safe", "outside", "outdoor", "jog", "run", "walk", "exercise"]):
                intent = "outdoor_safety"
            elif any(k in q for k in ["compare", "comparison", "best", "worst", "cleanest", "most polluted", "rank"]):
                intent = "compare_stations"
            else:
                # FALLBACK TO GEMINI if confidence is low and no keywords matched
                if gemini_model:
                     return self._query_gemini(query, station_id)
                
                return {
                    "response": "I'm not confident I understood that correctly. Could you rephrase? You can ask about:\n• Current AQI\n• Is it safe to go outside?\n• Air quality comparisons\n• Pollution information",
                    "intent": "unclear",
                    "confidence": float(confidence)
                }
        
        # Generate response
        result = self.generate_response(intent, query, station_id=station_id)
        result["confidence"] = float(confidence)
        
        return result

    def _query_gemini(self, query: str, station_id: Optional[str] = None) -> Dict:
        """Fallback: Ask Gemini to answer general air quality questions."""
        try:
             # Add context if station is known
             context = ""
             if station_id:
                 data = self.fetch_latest_data(station_id)
                 if "error" not in data:
                      pm25 = data.get("PM25_lag_1", 0)
                      context = f"Context: The user is asking about {station_id}. Current PM2.5 is {pm25}."
             
             prompt = f"""
             You are an expert Air Quality Assistant. Answer this user query concisely and professionally.
             Query: "{query}"
             {context}
             Keep the answer under 3 sentences if possible. Use emojis.
             """
             
             response = gemini_model.generate_content(prompt)
             return {
                 "response": response.text,
                 "intent": "gemini_fallback",
                 "confidence": 0.8  # Artificially high to show it worked
             }
        except Exception as e:
            print(f"Gemini Fallback Error: {e}")
            return {
                "response": "I'm having trouble connecting to my AI brain right now. Please try again later.",
                "intent": "error"
            }
