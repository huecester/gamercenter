#!/usr/bin/env python3
import lorem
from postgres import Postgres

data = []

for i in range(100):
    title = lorem.get_sentence()
    text = lorem.get_paragraph()

    data.append((title, text))

db = Postgres(url='dbname=gamercenter')
db.run('DROP TABLE IF EXISTS posts')
db.run('CREATE TABLE posts (id serial primary key, title text, content text)')
for thing in data:
    db.run(f'INSERT INTO posts (title, content) VALUES (\'{thing[0]}\', \'{thing[1]}\')')
