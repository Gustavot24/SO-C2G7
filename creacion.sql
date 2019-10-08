CREATE DATABASE Simulador;

CREATE TABLE Simulador.ParticionesFijas (
	idParticion INT PRIMARY KEY IDENTITY(0, 1),
	dirInicio INT NOT NULL,
	dirFin INT NOT NULL,
	tamano INT NOT NULL,
);