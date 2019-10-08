/* crea la base de datos */
CREATE DATABASE Simulador;

/* crea la tabla para guardar las particiones fijas */
CREATE TABLE Simulador.ParticionesFijas (
	idParticion INT PRIMARY KEY IDENTITY(0, 1),
	dirInicio INT NOT NULL,
	dirFin INT NOT NULL,
	tamano INT NOT NULL,
);

/* crea la tabla para guardar los procesos */
CREATE TABLE Simulador.Procesos (
	idProceso INT PRIMARY KEY IDENTITY(0, 1),
	tamano INT NOT NULL,
	prioridad INT NOT NULL,
	tiempoDeArribo INT NOT NULL,
	cicloDeVida VARCHAR(10) NOT NULL,
);