from flask import Flask,request,jsonify
from flask_cors import CORS
import openai
import json
import oracledb

openai.api_type = "open_ai"
openai.api_base = "http://127.0.0.1:1234/v1"
openai.api_key = "NULL"

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Flask backend is working!'

@app.route('/login',methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        conn = oracledb.connect(user = "system",password = "dbms123",dsn = "localhost:1522/xe")
        cur = conn.cursor()
        cur.execute("Select * from users where username = :u and password = :p",[username,password])
        result = cur.fetchone()
        cur.close()
        conn.close()

        if result:
            return jsonify({"success":True,"message":"Login Successful"})
        else:
            return jsonify({"success":False,"message":"Invalid credentials"})
    except Exception as e:
        print("Login error : ",e)
        return jsonify({"success":False,"message":"server error"})

@app.route("/signup",methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        conn = oracledb.connect(user = "system",password = "dbms123",dsn = "localhost:1522/xe")
        cur = conn.cursor()
        cur.execute("insert into users values(:u,:p)",[username,password])
        cur.close()
        conn.commit()
        conn.close()
        return jsonify({"message":"user SignedUp"})
    except Exception as e:
        print("signup error")
        return jsonify({"message":"User Cannot SignedUp"})


@app.route("/get-questions",methods=['POST'])
def get_questions():
    data = request.json
    topic = data.get('topic', 'General Knowledge')
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-0613",
            messages=[{
                "role": "user",
                "content": (
                    f"You are a quiz generator. Create 2 simple, logical multiple-choice questions on '{topic}'. "
                    "Each should have 4 options (A, B, C, D) and one correct answer. Return ONLY JSON:\n"
                    "{ \"questions\": ["
                    "{ \"question\": \"<question_text>\", "
                    "\"options\": [\"<option1>\", \"<option2>\", \"<option3>\", \"<option4>\"], "
                    "\"answer\": \"<correct_answer_in_text>\" } ] }"
                )
            }]
        )

        response_text = response['choices'][0]['message']['content'].strip()
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        json_str = response_text[json_start:json_end]

        questions = json.loads(json_str).get("questions", [])
        return jsonify({"questions": questions})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    data = request.json
    user_answers = data.get("answers",{})
    questions = data.get("questions",[])
    score = 0
    for i,q in enumerate(questions):
        correct = q.get("answer")
        user = user_answers.get(i) or user_answers.get(str(i))
        if user == correct:
            score +=1
    
    return jsonify({"score":score})

@app.route('/submit_history', methods=['POST'])
def submit_history():
    data = request.json
    username = data['username']
    topic = data['topic']
    score = data['score']
    responses = str(data['responses'])  
    questions = str(data['questions'])  

    conn = oracledb.connect(user = "system",password = "dbms123",dsn = "localhost:1522/xe")
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO quiz_history (username, topic, score, responses, questions)
        VALUES (:1, :2, :3, :4, :5)
    """, (username, topic, score, responses, questions))
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"message": "History saved successfully"}), 200

@app.route('/get_history/<username>', methods=['GET'])
def get_history(username):
    conn = oracledb.connect(user = "system",password = "dbms123",dsn = "localhost:1522/xe")
    cur = conn.cursor()
    cur.execute("""
        SELECT topic, score, responses, questions, submitted_at
        FROM quiz_history
        WHERE username = :username
        ORDER BY submitted_at DESC
    """, (username,))
    
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    history = [dict(zip(columns, row)) for row in rows]
    
    cur.close()
    conn.close()
    
    return jsonify(history)

if __name__ == "__main__":
    app.run(debug=True)