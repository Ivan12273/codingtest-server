# Coding test

Coding test es un sistema enfocado en la evaluación de los códigos de los estudiantes que están en los primeros cursos de programación de las carreras de Ingeniería de Software, Ciencias de la Computación, Ingeniería en Computación u otra carrera que involucre el aprendizaje de la programación. También permite la gestión de las calificaciones obtenidas de los alumnos por parte del maestro.

## Dependencias

Este sistema utiliza las siguientes herramientas:

- **[API de omegaUp](https://github.com/omegaup/omegaup/wiki/REST-API)**: [omegaUp](https://omegaup.com) es una plataforma en lína en donde los estudiantes pueden mejorar sus habilidades de ingeniería de software a través de ejercicios y  otras competencias. El [API de omegaUp](https://github.com/omegaup/omegaup/wiki/REST-API) es utilizada por este sistema para la creación de los ejercicios y para la evaluación de los mismos.
- **[GitHub Classroom](https://classroom.github.com)**: es una herramienta de gestión y manejo que utiliza la API de GitHub para habilitar el flujo de trabajo de GitHub para la educación. Esta herramienta es utilizada por el sistema para la obtención de los códigos del repositorio del maestro el cual contiene el código recibido de los estudiantes para luego ser calificados mediante el API de omegaUp.

## Instrucciones de uso

### Instalación

La aplicación está hecha en **[NodeJS](https://nodejs.org/es/)**. También es necesario instalar **[MongoDB](https://docs.mongodb.com/manual/)** 

### Comandos

Para correr el servidor de **Coding test**, se entra a la consola del ambiente de desarrollo y se introduce el siguiente comando: 

```
npm start
```

Una vez encendido el servidor, puede utilizarse un programa para realizar las peticiones de la API (como **[Postman](https://www.postman.com)**) mostradas en la siguiente sección.

## API

### GET ```/get-all-results```

#### Descripción
Se obtienen todos los resultados de los alumnos de una clase en GitHub Classroom.

#### Privilegios

#### Parámetros

### GET ```/problem/:student/:organization/:assignment```

#### Descripción
Obtiene los detalles de la tarea asignada.

#### Privilegios
El usuario necesita estar loggeado.

#### Parámetros
| Parámetro | Tipo   | Descripción |
| ------ |---------| :------|
| ```student``` | String | Nombre del estudiante registrado en GitHub Classroom|
| ```organization```  | String | Nombre de la organización registrada en GitHub Classroom |
| ```assignment``` | String | Nombre de la tarea registrada en GitHub Classroom |

### GET ```/calification/:organization/:assignment/:student/:problemAlias/:language/:executionTime```

#### Descripción
Obtiene la última calificación obtenida de la 

#### Privilegios
El usuario necesita estar loggeado.

#### Parámetros
| Parámetro | Tipo   | Descripción |
| ------ |---------| :------|
| ```organization``` | String | Nombre del estudiante registrado en GitHub Classroom|
| ```assignment```  | String | Nombre de la organización registrada en GitHub Classroom |
| ```student``` | String | Nombre de la tarea registrada en GitHub Classroom |
| ```problemAlias``` | String | Nombre de la tarea registrada en GitHub Classroom |
| ```language``` | String | Nombre de la tarea registrada en GitHub Classroom |
| ```executionTime``` | String | Nombre de la tarea registrada en GitHub Classroom |

### POST ```/create-problem```

#### Descripción
Crea un problema en la plataforma omegaUp.

#### Privilegios
El usuario necesita estar loggeado.

#### Parámetros
