/* crea la base de datos */
CREATE DATABASE Simulador;
GO

/* usa la base de datos que creaste recien */
USE Simulador;
GO

/* crea la tabla para guardar las particiones fijas */
CREATE TABLE ParticionesFijas (
	idParticion INT PRIMARY KEY IDENTITY(0, 1),
	dirInicio INT NOT NULL,
	dirFin INT NOT NULL,
	tamano INT NOT NULL,
);
GO

/* crea la tabla para guardar los procesos */
/* modele el ciclo de vida como un varchar momentaneamente,
   hasta que definamos como vamos a representar en el algoritmo */
CREATE TABLE Procesos (
	idProceso INT PRIMARY KEY IDENTITY(0, 1),
	tamano INT NOT NULL,
	prioridad INT NOT NULL,
	tiempoDeArribo INT NOT NULL,
	cicloDeVida VARCHAR(10) NOT NULL,
);
GO
