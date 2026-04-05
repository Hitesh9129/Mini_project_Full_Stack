import oracledb

conn = oracledb.connect(user = "system",password = "dbms123",dsn = "localhost:1522/xe")
username="Anush"
password=123
cur = conn.cursor()
cur.execute("Select * from users where username = :u and password = :p",[username,password])
result = cur.fetchone()
cur.close()
conn.close()


if result:
    print(result)
else:
    print("no result")
