import mysql.connector
import json
from hashlib import sha256
from datetime import datetime

mydb = mysql.connector.connect(
    host ='localhost',
    user ='root',
    password='root',
    auth_plugin='mysql_native_password'
)

mycursor = mydb.cursor()
mycursor.execute("use FYP;")

class UserAccount:
    def __init__(self):
        pass
    def Login(self,username,password,mainrole):
        mycursor.execute("select Username, pass, mainrole from useraccount natural join userprofile where username = '{}' and pass = sha2('{}', 0) and mainrole = '{}'".format(username,password, mainrole))
        data = mycursor.fetchall()
        numberofrow = mycursor.rowcount
        if(numberofrow==0):
            return False
        else:
            data2 = data[0]
            if username == data2[0] and sha256(password.encode('utf-8')).hexdigest() == data2[1] and data2[2] == mainrole:
                return True
            else:
                return False
    def getEmployeeID(self,username,password,mainrole):
        try:
            mycursor.execute("select employeeid from useraccount natural join userprofile where username = '{}' and pass = sha2('{}', 0) and mainrole = '{}'".format(username,password, mainrole))
            data = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                result = json.dumps(data)
                print(result)
        except mysql.connector.Error as error:
            print ("Failed")
    def createAdminAccount(self, fullname, address, email, mobile, username,password,Chatid,MaxHours):
        try:
            mycursor.execute("INSERT INTO  useraccount (fullname, address, email, mobile, username,pass,MaxHours,Chatid,PlaceHolder) VALUES ('{}','{}', '{}','{}', '{}', '{}','{}','{}','Admin')".format(fullname, address, email, mobile, username,password,MaxHours,Chatid))
            mydb.commit()
            print("Success")
            self.HashPlainPasswords()
        except mysql.connector.Error as error:
            print("Failed")
    def createEmployeeAccount(self, fullname, address, email, mobile, username,password,Chatid, MaxHours):
        try:
            mycursor.execute("INSERT INTO  useraccount (fullname, address, email, mobile, username,pass,MaxHours,Chatid,PlaceHolder) VALUES ('{}','{}', '{}','{}', '{}', '{}','{}','{}','Employee')".format(fullname, address, email, mobile, username,password,MaxHours,Chatid))
            mydb.commit()
            print("Success")
            self.HashPlainPasswords()
        except mysql.connector.Error as error:
            print("Failed")
    def createManagerAccount(self, fullname, address, email, mobile, username,password,Chatid, MaxHours):
        try:
            mycursor.execute("INSERT INTO  useraccount (fullname, address, email, mobile, username,pass,MaxHours,Chatid,PlaceHolder) VALUES ('{}','{}', '{}','{}', '{}', '{}','{}','{}','Manager')".format(fullname, address, email, mobile, username,password,MaxHours,Chatid))
            mydb.commit()
            print("Success")
            self.HashPlainPasswords()
        except mysql.connector.Error as error:
            print("Failed")
    def AdminUpdateAdminAccount(self,employeeid,selectedoption,value):
        try:
            mycursor.execute("select mainrole from userprofile where employeeid = '{}'".format(employeeid))
            data = mycursor.fetchone()
            result = data[0]
            if (result == 'Admin'):
                try:
                    mycursor.execute("update useraccount SET {} = '{}' where employeeid = '{}'".format(selectedoption,value,employeeid))
                    mydb.commit()
                    print("Success")
                    self.HashPlainPasswords()
                except mysql.connector.Error as error:
                    print("Failed")
            else:
                print("Failed")
        except mysql.connector.Error as error:
            print("Failed")
    def AdminUpdateManagerAccount(self,employeeid,selectedoption,value):
        try:
            mycursor.execute("select mainrole from userprofile where employeeid = '{}'".format(employeeid))
            data = mycursor.fetchone()
            result = data[0]
            if (result == 'Manager'):
                try:
                    mycursor.execute("update useraccount SET {} = '{}' where employeeid = '{}'".format(selectedoption,value,employeeid))
                    mydb.commit()
                    print("Success")
                    self.HashPlainPasswords()
                except mysql.connector.Error as error:
                    print("Failed")
            else:
                print("Failed")
        except mysql.connector.Error as error:
            print("Failed")
    def AdminUpdateEmployeeAccount(self,employeeid,selectedoption,value):
        try:
            mycursor.execute("select mainrole from userprofile where employeeid = '{}'".format(employeeid))
            data = mycursor.fetchone()
            result = data[0]
            if (result == 'Employee'):
                try:
                    mycursor.execute("update useraccount SET {} = '{}' where employeeid = '{}'".format(selectedoption,value,employeeid))
                    mydb.commit()
                    print("Success")
                    self.HashPlainPasswords()
                except mysql.connector.Error as error:
                    print("Failed")
            else:
                print("Failed")
        except mysql.connector.Error as error:
            print("Failed")
    def DeleteAdminAccount(self,employeeid):
        try:
            mycursor.execute("select mainrole from userprofile where employeeid = '{}'".format(employeeid))
            data = mycursor.fetchone()
            result = data[0]
            if (result == 'Admin'):
                try:
                    mycursor.execute("delete from useraccount where employeeid = '{}'".format(employeeid))
                    mydb.commit()
                    print("Success")
                except mysql.connector.Error as error:
                    print("Failed")
            else:
                print("Failed")
        except mysql.connector.Error as error:
            print("Failed")
    def DeleteManagerAccount(self,employeeid):
        try:
            mycursor.execute("select mainrole from userprofile where employeeid = '{}'".format(employeeid))
            data = mycursor.fetchone()
            result = data[0]
            if (result == 'Manager'):
                try:
                    mycursor.execute("delete from useraccount where employeeid = '{}'".format(employeeid))
                    mydb.commit()
                    print("Success")
                except mysql.connector.Error as error:
                    print("Failed")
            else:
                print("Failed")
        except mysql.connector.Error as error:
            print("Failed")
    def DeleteEmployeeAccount(self,employeeid):
        try:
            today = datetime.now().date()
            mycursor.execute("select * from EmployeeShift where employeeid = '{}' and shiftDate > '{}'".format(employeeid,today))
            shifts = mycursor.fetchall()
            if shifts:
                print("Reassign")
            else:
                mycursor.execute("select mainrole from userprofile where employeeid = '{}'".format(employeeid))
                data = mycursor.fetchone()
                result = data[0]
                if (result == 'Employee'):
                    try:
                        mycursor.execute("delete from useraccount where employeeid = '{}'".format(employeeid))
                        mydb.commit()
                        print("Success")
                    except mysql.connector.Error as error:
                        print("Failed")
                else:
                    print("Failed")
        except mysql.connector.Error as error:
            print("Failed")
    def EmployeeViewAccount(self, employeeid):
        try:
            mycursor.execute("SELECT employeeid, Fullname, Address, Email, mobile, Username, maxhours FROM useraccount WHERE employeeid = '{}'".format(employeeid))
            data = mycursor.fetchone()
            if data is None:
                print("No data found for employee with ID:", employeeid)
            else:
                result = json.dumps(data)
                print(result)
        except mysql.connector.Error as error:
            print("Failed to execute query:", error)

    def AdminViewAdminAccount(self):
        try:
            mycursor.execute("select employeeid, Fullname, Address,Email,mobile,Username,chatid,maxhours from useraccount where placeholder = 'Admin';")
            data = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                result = json.dumps(data)
                print(result)
        except mysql.connector.Error as error:
            print ("Failed")
    def AdminViewManagerAccount(self):
        try:
            mycursor.execute("select employeeid, Fullname, Address,Email,mobile,Username,chatid,maxhours from useraccount where placeholder = 'Manager';")
            data = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                result = json.dumps(data)
                print(result)
        except mysql.connector.Error as error:
            print ("Failed")
    def AdminViewEmployeeAccount(self):
        try:
            mycursor.execute("select employeeid, Fullname, Address,Email,mobile,Username,chatid,maxhours from useraccount where placeholder = 'Employee';")
            data = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                result = json.dumps(data)
                print(result)
        except mysql.connector.Error as error:
            print ("Failed")
    def updateManagerAccount(self,employeeid,selectedoption,value):
        try:
            mycursor.execute("UPDATE useraccount SET {} = '{}' where employeeid = {}".format(selectedoption,value,employeeid))
            mydb.commit()
            print("Success")
            self.HashPlainPasswords()
        except mysql.connector.Error as error:
            print("Failed")
    def updateEmployeeAccount(self,employeeid,selectedoption,value):
        try:
            mycursor.execute("UPDATE useraccount SET {} = '{}' where employeeid = {}".format(selectedoption,value,employeeid))
            mydb.commit()
            print("Success")
            self.HashPlainPasswords()
        except mysql.connector.Error as error:
            print("Failed")
    def searchAdminAccount(self, selectedoption,value):
        try:
            mycursor.execute("select Fullname,Address,Email,Mobile,Username,pass,chatid,MaxHours from useraccount where {} = '{}' and placeholder = 'Admin'".format(selectedoption,value))
            searchingdata = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                searchingresult = json.dumps(searchingdata)
                print(searchingresult)
        except mysql.connector.Error as error:
            print ("Failed")
    def filterAdminAccount(self, selectedoption,value):
        try:
            mycursor.execute("select EmployeeID,Fullname,Address,Email,Mobile,Username from useraccount where {} LIKE '%{}%' and placeholder = 'Admin'".format(selectedoption,value))
            searchingdata = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                searchingresult = json.dumps(searchingdata)
                print(searchingresult)
        except mysql.connector.Error as error:
            print ("Failed")
    def searchManagerAccount(self, selectedoption,value):
        try:
            mycursor.execute("select EmployeeID,Fullname,Address,Email,Mobile,Username,pass,chatid,MaxHours from useraccount where {} = '{}' and placeholder = 'Manager'".format(selectedoption,value))
            searchingdata = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                searchingresult = json.dumps(searchingdata)
                print(searchingresult)
        except mysql.connector.Error as error:
            print ("Failed")
    def filterManagerAccount(self, selectedoption,value):
        try:
            mycursor.execute("select EmployeeID,Fullname,Address,Email,Mobile,Username from useraccount where {} LIKE '%{}%' and placeholder = 'Manager'".format(selectedoption,value))
            searchingdata = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                searchingresult = json.dumps(searchingdata)
                print(searchingresult)
        except mysql.connector.Error as error:
            print ("Failed")
    def searchEmployeeAccount(self, selectedoption,value):
        try:
            mycursor.execute("select EmployeeID,Fullname,Address,Email,Mobile,Username,pass,chatid,MaxHours from useraccount where {} = '{}' and placeholder = 'Employee'".format(selectedoption,value))
            searchingdata = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                searchingresult = json.dumps(searchingdata)
                print(searchingresult)
        except mysql.connector.Error as error:
            print ("Failed")
    def filterEmployeeAccount(self, selectedoption,value):
        try:
            mycursor.execute("select EmployeeID,Fullname,Address,Email,Mobile,Username from useraccount where {} LIKE '%{}%' and placeholder = 'Employee'".format(selectedoption,value))
            searchingdata = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                searchingresult = json.dumps(searchingdata)
                print(searchingresult)
        except mysql.connector.Error as error:
            print ("Failed")
    def grabUserAccountTableColumns(self):
        mycursor.execute("select column_name from information_schema.columns where table_schema = 'FYP' and table_name = 'useraccount' and column_name not in ('EmployeeID')")
        data = mycursor.fetchall()
        result = json.dumps(data)
        print(result)
    def grabFilterUserAccountTableColumns(self):
        mycursor.execute("select column_name from information_schema.columns where table_schema = 'FYP' and table_name = 'useraccount' and column_name not in ('pass','chatid','PlaceHolder','MaxHours')")
        data = mycursor.fetchall()
        result = json.dumps(data)
        print(result)
    def ManagerViewEmployeeAccount(self):
        try:
            mycursor.execute("select employeeid, Fullname, Address,Email,mobile,chatid,maxhours,job from useraccount natural join userprofile where mainrole = 'Employee';")
            data = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                result = json.dumps(data)
                print(result)
        except mysql.connector.Error as error:
            print ("Failed")
    def ManagerFiltergrabTableColumns(self):
        mycursor.execute("select column_name from information_schema.columns where table_schema = 'FYP' and table_name = 'useraccount' and column_name not in ('PlaceHolder','Username','pass') union select column_name from information_schema.columns where table_schema = 'FYP' and table_name = 'userprofile' and column_name not in ('EmployeeID','MainRole') union select column_name from information_schema.columns where table_schema = 'FYP' and table_name = 'employeeshiftinformation' and column_name not in ('EmployeeID');")
        data = mycursor.fetchall()
        result = json.dumps(data)
        print(result)
    def ManagerFilterEmployees(self, selectedoption,value):
        try:
            mycursor.execute("select EmployeeID,FullName,Address,Email,Mobile,chatid,MaxHours,Job,ShiftPref,NoOfHrsWorked from useraccount natural join employeeshiftinformation natural join userprofile where {} LIKE '%{}%';'".format(selectedoption,value))
            searchingdata = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                searchingresult = json.dumps(searchingdata)
                print(searchingresult)
        except mysql.connector.Error as error:
            print ("Failed")
    def ManagerSearchEmployees(self, selectedoption,value):
        try:
            mycursor.execute("select EmployeeID,FullName,Address,Email,Mobile,chatid,MaxHours,Job,ShiftPref,NoOfHrsWorked from useraccount natural join employeeshiftinformation natural join userprofile where {} = '{}';'".format(selectedoption,value))
            searchingdata = mycursor.fetchall()
            numberofrow = mycursor.rowcount
            if(numberofrow==0):
                print("No table left")
            else:
                searchingresult = json.dumps(searchingdata)
                print(searchingresult)
        except mysql.connector.Error as error:
            print ("Failed")
    def HashPlainPasswords(self):
        try:
            mycursor.execute("update useraccount set useraccount.Pass = sha2(useraccount.Pass,0) where useraccount.EmployeeID > 0 AND char_length(useraccount.Pass) < 64")
            mydb.commit()
            self.HashPlainPasswords()
            print("Success")
        except mysql.connector.Error as error:
            print("Failed")
    def ResetPassword(self, newpassword, employeeid):
        try:
            mycursor.execute("update useraccount set useraccount.Pass = sha2('{}',0) where useraccount.EmployeeID = {}".format(newpassword, employeeid))
            mydb.commit()
            self.HashPlainPasswords()
            print("Success")
        except mysql.connector.Error as error:
            print("Failed")

