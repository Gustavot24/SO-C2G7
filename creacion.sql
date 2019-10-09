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
CREATE TABLE Procesos (
	idProceso INT PRIMARY KEY IDENTITY(1, 1),
	nombre VARCHAR(20),
	listado XML,
);
GO

/* crea la tabla para guardar los algoritmos de las colas y las colas multinivel */
/* los algoritmos los meti como varchar hasta ver si se puede hacer algo tipo conjunto */
CREATE TABLE Colas (
	idCola INT PRIMARY KEY IDENTITY(1, 1),
	nombre VARCHAR(20),
	algoritmoColaCPU VARCHAR(20),
	algoritmoColaEntrada VARCHAR(20),
	algoritmoColaSalida	VARCHAR(20),
	colasMultinivel XML,
);
GO

/* el xml puede ser asi:
<particion id="x">
	<dirInicio>direccion de inicio</dirInicio>
	<dirFin>direccion de fin</dirFin>
	<tamano>tamaño</tamano>
</particion>

o asi:
<particion id="x" dirInicio="x" dirFin="x" tamano="x" />

hay que decidir como hacer
*/