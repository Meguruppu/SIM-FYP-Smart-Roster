CREATE DATABASE FYP;
use FYP;

create TABLE userAccount(
	EmployeeID int auto_increment NOT NULL,
    Fullname varchar(50) NOT NULL,
    Address varchar(60) NOT NULL,
    Email varchar(60) NOT NULL,
    Mobile bigint(8) NOT NULL,
    Username varchar(50) NOT NULL,
    Pass varchar(50) NOT NULL,
	MaxHours int(4) NOT NULL,
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
    date DATE NOT NULL,
    shift VARCHAR(255) NOT NULL,
    start TIME NOT NULL,
    end TIME NOT NULL
);

drop database FYP;
