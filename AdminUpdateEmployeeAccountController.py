import UserAccountClass
import sys
import json

input = sys.argv[1]
x=json.loads(input)
employeeid = x["employeeid"]
selectedoption = x["selectedoption"]
value = x["value"]

class AdminUpdateEmployeeAccountController:
    def AdminUpdateEmployeeAccountController(employeeid,selectedoption,value):
        adminupdateemployeeacc = UserAccountClass.UserAccount()
        adminupdateemployeeacc.AdminUpdateEmployeeAccount(employeeid,selectedoption,value)

auda = AdminUpdateEmployeeAccountController.AdminUpdateEmployeeAccountController(employeeid,selectedoption,value)