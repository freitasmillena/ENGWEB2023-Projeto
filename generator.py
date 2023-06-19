import os
import sys
import json
import random
import hashlib
import string
from datetime import datetime

f_id = 0
u_id = 0
g_id = 0
users = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hacker', 'Ingrid', 'Judy', 'Karl', 'Linda', 'Mallory',
         'Nancy', 'Oscar', 'Peggy', 'Quinn', 'Robert', 'Sally', 'Trent', 'Ursula', 'Victor', 'Wendy', 'Xavier', 'Yvonne', 'Zoe']
sur_names = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins',
             'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes']
groups = ['public', 'researchers', 'teachers', 'students', 'administration']
comments = ["Great file post!", "Awesome upload!", "Thanks for sharing!", "Very helpful file!", "Fantastic post!", "Impressive content!", "Well done!", "Love this file!", "Excellent upload!", "Brilliant post!", "Great resource!", "Super useful file!", "Thank you for sharing!", "Incredible work!", "This is gold!", "Amazing contribution!", "This is exactly what I needed!", "High-quality content!", "This is amazing!", "This is outstanding!", "This is exceptional!", "This is top-notch!", "This is superb!", "This is phenomenal!", "This is impressive!", "This is fantastic!", "This is outstanding work!", "This is remarkable!", "This is extraordinary!", "This is excellent work!", "This is exceptional work!", "This is outstanding content!", "This is amazing content!", "This is outstanding quality!", "This is top-level work!", "This is incredible content!", "This is outstanding material!", "This is top-notch content!", "This is a game-changer!", "This is groundbreaking!", "This is top-class work!", "This is top-quality content!", "This is top-notch material!", "This is top-tier material!", "This is top-notch performance!", "This is top-notch execution!", "This is exceptional quality!", "This is top-class performance!", "This is top-notch teamwork!", "This is top-level collaboration!", "This is top-tier collaboration!", "This is outstanding teamwork!", "This is exceptional collaboration!", "This is top-notch collaboration!", "This is top-tier support!"]
categorias = ["Report", "Article", "Thesis", "Application", "Slides", "Test/Exam", "Solved Problems", "Other"]
user_array = []
group_array = []
level_array = ['consumer','producer']

def gen_categories():
    global categorias
    global cat_id
    cat_array = []
    for cat in categorias:
        cat_array.append({'name': cat.capitalize()})
        cat_id += 1
    return cat_array

def gen_groups():
    global g_id
    group_array = []
    for group in groups:
        group_array.append(
            {'_id': g_id, 'name': group.capitalize(), 'owner': None, 'participants': []})
        g_id += 1
    return group_array


def gen_users(amount):
    user_array = []
    global u_id
    global g_id
    global users
    global sur_names
    global groups
    for i in range(amount):
        user = {}
        user['_id'] = u_id
        user['name'] = random.sample(users, 1)[0]
        user['surname'] = random.sample(sur_names, 1)[0]
        user['username'] = f"{user['name'].lower()}{u_id}"
        user['level'] = random.sample(level_array, 1)[0]
        user['dataRegisto'] = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
        user['dataAtualizao'] = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
        user['salt'] = os.urandom(32).hex()
        user['hash'] = (''.join(random.choice(string.hexdigits) for _ in range(1024))).lower()
        user['email'] = str(user['_id'])+'@'+user['surname'].lower()+'.com'
        user['groups'] = random.sample([0,1,2,3,4], 1)
        if 0 not in user['groups']:
            user['groups'].append(0)
        for group in user['groups']:
            for g in group_array:
                if g['_id'] == group and group != 0:
                    if g['participants'] == []:
                        g['owner'] = user['username']
                    g['participants'].append(user['username'])
        user['submissions'] = []
        user['favorites'] = []
        u_id += 1
        user_array.append(user)
    return user_array


def gen_entry(file):
    entry = {}
    global f_id
    global u_id
    global g_id
    global groups
    global u_array
    type = 'unknown'
    if len(file.split('.')) > 1:
        type = file.split('.')[-1]
    entry['_id'] = f_id
    entry['size'] = os.path.getsize(file)
    entry['type'] = type
    entry['path'] = os.path.abspath(file)
    entry['title'] = file.split('/')[-1].split('.')[0]
    entry['category'] = random.sample(categorias, 1)[0]
    if random.randint(0, 1):
        entry['description'] = f"This is a {type} file."
    else:
        entry['description'] = None
    entry['created'] = datetime.fromtimestamp(
        os.path.getctime(file)).strftime('%Y-%m-%dT%H:%M:%S')
    entry['modified'] = datetime.fromtimestamp(
        os.path.getmtime(file)).strftime('%Y-%m-%dT%H:%M:%S')
    u=random.sample(range(0,u_id),1)[0]
    entry['creator'] = f"{user_array[u]['username']}"
    user_array[u]['submissions'].append(entry['_id'])
    entry['available_for'] = {}
    entry['available_for']['groups'] = random.sample( [0,1,2,3,4], random.randint(0, 5))
    if 0 in entry['available_for']['groups']:
        entry['available_for']['groups'] = [0]
        entry['available_for']['users'] = []
    else:
        users = random.sample(range(0, u_id), random.randint(0, 10))
        entry['available_for']['users'] = []
        for user in users:
            entry['available_for']['users'].append(user_array[user]['username'])
        if entry['creator'] not in entry['available_for']['users']:
            entry['available_for']['users'].append(entry['creator'])
    entry['comments'] = []
    if 0 in entry['available_for']['groups']:
        how_many = random.randint(0, 50)
        for i in range(how_many):
            picked_id = random.sample(range(0, u_id), 1)[0]
            if entry['_id'] not in user_array[picked_id]['favorites']:
                user_array[picked_id]['favorites'].append(entry['_id'])
            new_comment = {'user': f"{user_array[picked_id]['username']}",
                           'comment': random.sample(comments, 1)[0],
                           'created': datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
                           }
            entry['comments'].append(new_comment)
    f_id += 1

    return entry


def gen_dict(root):
    json_array = []
    for root, dirs, files in os.walk(root):
        for file in files:
            if file[0] != '.':
                json_array.append(gen_entry(root+'/'+file))
        for dir in dirs:
            if dir[0] != '.':
                json_array += gen_dict(dir)
    return json_array


if __name__ == '__main__':
    if len(sys.argv) != 4:
        print("Usage: python generator.py <user_amount> <root_dir> <output_file>")
        sys.exit(1)
    u_amount = int(sys.argv[1])
    root = sys.argv[2]
    out = sys.argv[3]
    group_array = gen_groups()
    user_array = gen_users(u_amount)
    entries_array = gen_dict(root)
    cat_array = gen_categories()
    #out_dict = {"groups": group_array,
    #            "users": user_array, 
    #            "entries": entries_array}
    with open('groups_'+out, 'w') as f:
        json.dump(group_array, f, indent=4)
    with open('users_'+out, 'w') as f:
        json.dump(user_array, f, indent=4)
    with open('entries_'+out, 'w') as f:
        json.dump(entries_array, f, indent=4)
    with open('categories_'+out, 'w') as f:
        json.dump(cat_array, f, indent=4)
