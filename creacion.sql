/* crea la base de datos */
CREATE DATABASE Simulador;
GO

/* usa la base de datos que creaste recien */
USE Simulador;
GO

/* crea la tabla para guardar las particiones fijas */
CREATE TABLE ParticionesFijas (
	idParticion INT PRIMARY KEY IDENTITY(1, 1),
	nombre VARCHAR(20),
	listado XML,
);
GO

/* crea la tabla para guardar los procesos */
/* modele el ciclo de vida como un varchar momentaneamente,
   hasta que definamos como vamos a representar en el algoritmo */
CREATE TABLE Procesos (
	idProceso INT PRIMARY KEY IDENTITY(1, 1),
	nombre VARCHAR(20),
	listado XML,
);
GO
