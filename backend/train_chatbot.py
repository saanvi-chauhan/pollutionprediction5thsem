"""
Train Air Quality Chatbot Intent Classifier

This script trains a simple but effective intent classifier using:
- TF-IDF for feature extraction
- Logistic Regression for classification
"""

import json
import joblib
import shutil
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score

def main():
    print("=" * 60)
    print("TRAINING AIR QUALITY CHATBOT")
    print("=" * 60)
    
    # Absolute paths
    base_dir = Path(__file__).parent
    data_path = base_dir / "data" / "chatbot" / "intents.json"
    models_dir = base_dir / "models"
    
    # 1. Load training data
    print(f"\nLoading training data from {data_path}...")
    try:
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find intents.json at {data_path}")
        return

    print(f"[OK] Loaded {len(data['intents'])} intents")
    
    # 2. Prepare training data
    print("\nPreparing training data...")
    X = []  # Questions
    y = []  # Intent tags
    
    for intent in data['intents']:
        for pattern in intent['patterns']:
            X.append(pattern.lower())
            y.append(intent['tag'])
    
    print(f"[OK] Total training examples: {len(X)}")
    print(f"[OK] Unique intents: {len(set(y))}")
    
    # 3. Split data
    print("\nSplitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"[OK] Train: {len(X_train)}, Test: {len(X_test)}")
    
    # 4. Create TF-IDF vectorizer
    print("\nCreating TF-IDF vectorizer...")
    vectorizer = TfidfVectorizer(
        max_features=500,
        ngram_range=(1, 2),
        min_df=1,
        lowercase=True,
        stop_words='english'
    )
    
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    print(f"[OK] Feature matrix shape: {X_train_vec.shape}")
    
    # 5. Train model
    print("\nTraining Logistic Regression model...")
    model = LogisticRegression(
        max_iter=1000,
        random_state=42
    )
    model.fit(X_train_vec, y_train)
    print("[OK] Training complete!")
    
    # 6. Evaluate
    print("\nEvaluating model...")
    y_pred = model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    # Handle cross validation issues with small datasets/stratification by try/except
    try:
        cv_scores = cross_val_score(model, X_train_vec, y_train, cv=3)
        print(f"[RESULT] Cross-Val Score: {cv_scores.mean() * 100:.2f}%")
    except:
        print("[WARN] Could not perform cross-validation (dataset might be too small)")
    
    print(f"\n[RESULT] Test Accuracy: {accuracy * 100:.2f}%")
    
    # Classification report
    print("\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))
    
    # 7. Test with sample queries
    print("\nTesting with sample queries:")
    test_queries = [
        "What's the air quality right now?",
        "Can I go for a jog?",
        "Tell me about PM2.5",
        "Which area has the cleanest air?",
        "Thanks for the help!",
        "How do I protect myself from pollution?"
    ]
    
    for query in test_queries:
        query_vec = vectorizer.transform([query.lower()])
        intent = model.predict(query_vec)[0]
        confidence = max(model.predict_proba(query_vec)[0])
        print(f"\n  Q: '{query}'")
        print(f"  -> {intent} (confidence: {confidence*100:.1f}%)")
    
    # 8. Save models
    print("\nSaving models...")
    models_dir.mkdir(exist_ok=True)
    
    joblib.dump(model, models_dir / 'chatbot_intent_model.pkl')
    joblib.dump(vectorizer, models_dir / 'chatbot_vectorizer.pkl')
    # Copy intents.json for runtime use
    with open(models_dir / 'chatbot_intents.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print("[OK] Models saved successfully!")
    print("\nSaved files:")
    print("  - models/chatbot_intent_model.pkl")
    print("  - models/chatbot_vectorizer.pkl")
    print("  - models/chatbot_intents.json")
    
    # Summary
    print("\n" + "=" * 60)
    print("CHATBOT TRAINING COMPLETE!")
    print("=" * 60)
    print(f"\nFinal Summary:")
    print(f"  - Test Accuracy: {accuracy * 100:.2f}%")
    print(f"  - Total Intents: {len(set(y))}")
    print(f"  - Training Examples: {len(X)}")
    print(f"\nNext: Run the backend server and test the chatbot API!")
    print("=" * 60)

if __name__ == "__main__":
    main()
