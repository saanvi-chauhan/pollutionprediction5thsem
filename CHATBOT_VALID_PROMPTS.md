# Chatbot Valid Prompts (Current + Expanded)

This file lists:
- **Current valid prompts**: derived from `data/chatbot/intents.json` (the classifier training patterns) + UI suggestions.
- **New prompts to add**: 50+ additional example prompts the chatbot should classify/answer correctly (after retraining).

---

## Current valid prompts (training patterns)

Source: `data/chatbot/intents.json`

### greeting
- Hi
- Hello
- Hey
- Good morning
- Good afternoon
- Good evening
- Greetings
- What's up
- Howdy

### goodbye
- Bye
- Goodbye
- See you later
- See you
- Talk to you later
- Catch you later
- I'm leaving
- Have a good day

### thanks
- Thanks
- Thank you
- Thanks a lot
- I appreciate it
- Thank you so much
- Thanks for your help
- Cheers
- Awesome, thanks

### check_aqi
- What is the current AQI?
- Tell me the AQI
- Show me AQI
- What's the air quality index?
- Current AQI
- AQI right now
- Air quality index today
- How is the air quality?
- What's the air quality like?
- Is the air quality good?
- Air quality status
- Check AQI
- What is the AQI in Peenya?
- AQI at RVCE
- Silkboard AQI
- Tell me AQI in Silkboard

### outdoor_safety
- Is it safe to go outside?
- Can I go out?
- Should I go outside?
- Is it safe to exercise outdoors?
- Can I run outside?
- Is it safe for jogging?
- Can I play outside?
- Should children play outside?
- Is outdoor exercise safe?
- Can I go for a walk?
- Is it okay to be outside?
- Should I avoid going out?
- Can kids play outdoors?

### what_is_aqi
- What is AQI?
- Explain AQI
- What does AQI mean?
- Tell me about AQI
- Define AQI
- What is air quality index?
- How is AQI calculated?
- AQI meaning
- What's AQI?
- Explain air quality index

### what_is_pm25
- What is PM2.5?
- Explain PM2.5
- What does PM2.5 mean?
- Tell me about PM2.5
- PM2.5 meaning
- What are fine particles?
- What is particulate matter?
- PM 2.5 definition
- What's PM2.5?

### what_is_pm10
- What is PM10?
- Explain PM10
- PM10 meaning
- What does PM10 mean?
- Tell me about PM10
- PM 10 definition

### compare_stations
- Compare air quality
- Compare stations
- Which area has better air?
- Show me all stations
- Compare Peenya and Silkboard
- Best air quality location
- Which station has cleanest air?
- Comparison of stations
- Compare all areas
- Where is air quality better?
- Best place for air quality

### health_advisory
- Health advice
- What should I do?
- How to stay safe?
- Health recommendations
- Precautions for pollution
- How to protect myself?
- Safety tips
- What are the health effects?
- How does pollution affect health?
- Health impacts of pollution

### pollution_causes
- What causes pollution?
- Why is air quality bad?
- Sources of pollution
- What creates pollution?
- Pollution sources
- Why is the air polluted?
- Main causes of air pollution
- Where does pollution come from?

### reduce_exposure
- How to reduce pollution exposure?
- How to protect from pollution?
- Ways to reduce exposure
- Tips to avoid pollution
- How to breathe clean air?
- Reduce pollution impact
- Minimize exposure to pollution

### sensitive_groups
- Who is at risk?
- Sensitive groups
- Who should be careful?
- Risk groups for pollution
- Vulnerable people
- Who is most affected?
- High risk groups

### seasonal_effects
- When is pollution worst?
- Seasonal pollution
- Which season has bad air?
- Pollution in winter
- Pollution in summer
- Best time of year for air quality
- Monsoon air quality

### prediction
- Future air quality
- Tomorrow's AQI
- Predict air quality
- What will AQI be tomorrow?
- Forecast
- Air quality prediction
- Will air quality improve?
- Next week air quality

### help
- Help
- What can you do?
- How can you help?
- What questions can I ask?
- Help me
- Guide me
- What do you know?
- Commands

### no2_info
- What is NO2?
- Explain NO2
- Nitrogen dioxide
- What does NO2 mean?
- NO2 meaning

### co_info
- What is CO?
- Explain CO
- Carbon monoxide
- What does CO mean?
- CO meaning

### ozone_info
- What is ozone?
- Explain ozone
- O3 meaning
- What does ozone mean?
- Ground level ozone

### mask_advice
- Should I wear a mask?
- Do I need a mask?
- What mask to wear?
- N95 mask
- Pollution mask
- Best mask for pollution

### air_purifier
- Air purifier
- Should I buy air purifier?
- Do air purifiers work?
- Best air purifier
- HEPA filter
- Indoor air quality

---

## Current UI “quick suggestions”

Source: `frontend-react/src/pages/Chatbot.jsx` and `GET /chatbot/suggestions`

- What is the current AQI?
- Is it safe to go outside?
- Compare air quality across stations
- What is PM2.5?
- Show pollution levels
- How do I protect myself from pollution?

---

## Add 50+ new prompts (recommended)

These should be added into `data/chatbot/intents.json` patterns and the model retrained.

### check_aqi (15)
- AQI in my area right now?
- What’s the AQI near me?
- Air quality right now in Peenya
- Air quality right now in Silkboard
- Air quality right now in RVCE
- What is today’s AQI in Peenya?
- What is today’s AQI in Silkboard?
- What is today’s AQI in RVCE?
- Give me the latest air quality index
- Show latest AQI reading
- What’s the AQI value currently?
- Current AQI at Peenya station
- Current AQI at Silkboard station
- Current AQI at RVCE station
- How bad is the air right now?

### outdoor_safety (10)
- Is it safe to go for a run right now?
- Can I exercise outside today?
- Is it okay to take a walk now?
- Should I stay indoors today?
- Is it safe for kids to play outside today?
- Can elderly people go outside now?
- Is it safe to commute by bike?
- Is it safe to play football outside?
- Should I avoid outdoor workout today?
- Is it okay to go out without a mask?

### compare_stations (8)
- Which station has the lowest AQI right now?
- Which place has the cleanest air today?
- Which area is most polluted right now?
- Compare AQI across all stations
- Rank stations by air quality
- Which is better right now: Peenya or RVCE?
- Which is better right now: Silkboard or Peenya?
- Which station has worst air quality currently?

### mask_advice (6)
- Do I need an N95 right now?
- Should I wear N95 in Peenya today?
- Is a cloth mask enough for pollution?
- Which mask is best for PM2.5?
- When should I wear a mask outside?
- N95 or N99 for today’s air?

### reduce_exposure (6)
- How can I reduce my exposure today?
- What should I do to avoid pollution outdoors?
- Tips for commuting in high pollution
- How do I keep indoor air clean?
- What to do when AQI is high?
- How to protect children from pollution?

### air_purifier (5)
- Is an air purifier worth it in Bengaluru?
- Which HEPA rating should I buy?
- How do I size an air purifier for my room?
- Should I run purifier all day?
- Do air purifiers remove PM2.5 effectively?

### seasonal_effects (3)
- Why is air quality worse in winter?
- Is monsoon season better for air quality?
- When does Bengaluru pollution peak?

### pollution_causes (3)
- Why is Silkboard usually more polluted?
- Why is Peenya polluted?
- What are the main sources of PM2.5 here?

### help (3)
- What can I ask you about air quality?
- Give me examples of questions I can ask
- Show me what you can do

**Total new prompts above: 59**

