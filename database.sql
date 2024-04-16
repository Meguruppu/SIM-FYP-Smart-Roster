CREATE DATABASE FYP;
use FYP;

create TABLE userAccount(
	EmployeeID int auto_increment NOT NULL,
    Fullname varchar(50) NOT NULL,
    Address varchar(60) NOT NULL,
    Email varchar(60) NOT NULL,
    Mobile bigint(8) NOT NULL,
    Username varchar(50) NOT NULL,
    Pass varchar(64) NOT NULL,
	MaxHours int(4) NOT NULL,
    Chatid varchar(60) NOT NULL,
    PlaceHolder varchar(50) NOT NULL,
    PRIMARY KEY (EmployeeID)
);

create TABLE userProfile(
	EmployeeID int NOT NULL,
    MainRole varchar(50) NOT NULL,
    Job varchar(60),
    PRIMARY KEY (EmployeeID),
    CONSTRAINT FK_EmployeeID FOREIGN KEY (EmployeeID)
    REFERENCES userAccount(EmployeeID)
    on update cascade
    on delete cascade
);


CREATE TABLE workshift (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Date varchar(50) NOT NULL,
    shift VARCHAR(255) NOT NULL,
    start TIME NOT NULL,
    end TIME NOT NULL
);

CREATE TABLE EmployeeShiftInformation (
	EmployeeID int NOT NULL,
    Day varchar(50) NOT NULL,
    ShiftPref varchar(50) NOT NULL,
    NoOfHrsWorked DOUBLE NOT NULL,
    CONSTRAINT FK_EmployeeID2 FOREIGN KEY (EmployeeID)
    REFERENCES userAccount(EmployeeID)
    on update cascade
    on delete cascade
);

CREATE TABLE EmployeeLeave (
    LeaveID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID int NOT NULL,
    Date DATE NOT NULL,
    LeaveType VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    reason VARCHAR(50),
    CONSTRAINT FK_EmployeeID3 FOREIGN KEY (EmployeeID)
    REFERENCES userAccount(EmployeeID)
    on update cascade
    on delete cascade
);

CREATE TABLE Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID int NOT NULL,
    Date DATE NOT NULL,
    ClockIn TIME NOT NULL,
    ClockOut TIME NULL,
    Attendance VARCHAR(50) NULL,
    CONSTRAINT FK_EmployeeID4 FOREIGN KEY (EmployeeID)
    REFERENCES userAccount(EmployeeID)
    on update cascade
    on delete cascade
);

CREATE TABLE EmployeeShift (
    EmployeeShiftID INT AUTO_INCREMENT PRIMARY KEY,
    shiftID INT NOT NULL,
    EmployeeID INT NOT NULL,
    shiftDate DATE NOT NULL,
    shiftType VARCHAR(255) NOT NULL,
    FOREIGN KEY (shiftID) REFERENCES workshift(id),
    FOREIGN KEY (EmployeeID) REFERENCES userAccount(EmployeeID)
    on update cascade
    on delete cascade
);

CREATE TABLE Notification (
    EmployeeID INT NOT NULL,
    Notif VARCHAR(255) NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES userAccount(EmployeeID)
    on update cascade
    on delete cascade
);

CREATE TABLE ApprovedEmployeeLeave (
    LeaveID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID int NOT NULL,
    Date DATE NOT NULL,
    LeaveType VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT FK_EmployeeID5 FOREIGN KEY (EmployeeID)
    REFERENCES userAccount(EmployeeID)
    on update cascade
    on delete cascade
);
