-- Execute this in your Azure SQL Database query editor

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ToDos' and xtype='U')
CREATE TABLE ToDos (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    completed BIT DEFAULT 0,
    createdAt DATETIME DEFAULT GETDATE()
);

INSERT INTO ToDos (title, completed) VALUES 
('Setup Azure Resources', 1),
('Deploy Backend', 0),
('Connect Frontend', 0);
