from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from functools import wraps
import random

app = Flask(__name__)
app.secret_key = 'casino_secret'


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


@app.route('/')
def index():
    if 'user' in session:
        return redirect(url_for('game'))
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        if username:
            session['user'] = {'name': username, 'tokens': 100}
            return redirect(url_for('game'))
    return render_template('login.html')


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))


@app.route('/game')
@login_required
def game():
    return render_template('game.html')


@app.route('/status')
@login_required
def status():
    return jsonify(user=session['user'])


@app.route('/spin', methods=['POST'])
@login_required
def spin():
    slot1 = random.randint(0, 4)
    slot2 = random.randint(0, 4)
    slot3 = random.randint(0, 4)
    reward = 0
    user = session['user']
    if slot1 == slot2 == slot3:
        reward = 50
        user['tokens'] += reward
    else:
        user['tokens'] -= 10
    session['user'] = user
    return jsonify(slots=[slot1, slot2, slot3], tokens=user['tokens'], reward=reward)


if __name__ == '__main__':
    app.run(debug=True)
