import mysql.connector

mydb = mysql.connector.connect(
    host='localhost',
    user='root',
    password='root',
    auth_plugin='mysql_native_password'
)

mycursor = mydb.cursor()
mycursor.execute("use FYP;")


class WorkShift:
    def __init__(self):
        pass

    def createws(self, date, shift, start, end):
        try:
            mycursor.execute("INSERT INTO  workshift (date, shift, start, end) VALUES ('{}','{}', '{}','{}')".format(date, shift, start, end))
            mydb.commit()
            print("Success")
        except mysql.connector.Error as error:
            print("Failed")