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