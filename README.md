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

### GET ```/problem/:student/:organization/:assignment```

#### Descripción
Obtiene los detalles de la tarea asignada.

#### Privilegios
El usuario necesita estar loggeado.

#### Parámetros
| Parámetro | Tipo   | Descripción |
| ------ |---------| :------|
| ```student``` | string | Nombre del estudiante registrado en GitHub Classroom. |
| ```organization```  | string | Nombre de la organización registrada en GitHub Classroom. |
| ```assignment``` | string | Nombre de la tarea registrada en GitHub Classroom. |

#### Regresa
| Parámetro | Tipo   | Descripción |
| ------ |---------| :------|
| ```instructions``` | string | Instrucciones del tarea asignada. |


### GET ```/calification/:organization/:assignment/:student/:problemAlias/:language/:executionTime```

#### Descripción
Obtiene la última calificación obtenida de la 

#### Privilegios
El usuario necesita estar loggeado.

#### Parámetros
| Parámetro | Tipo   | Descripción |
| ------ |---------| :------|
| ```organization``` | string | Nombre de la organización registrada en GitHub Classroom. |
| ```assignment```  | string | Nombre de la tarea registrada en la clase de GitHub Classroom. |
| ```student``` | string | Nombre del estudiante registrado en GitHub Classroom. |
| ```problemAlias``` | string | Nombre del problema en omegaUp. |
| ```language``` | string | Lenguaje en el que fue hecho el código de la tarea. |
| ```executionTime``` | int | Tiempo de demora máximo para ser ejecutado el código. |

#### Regresa
| Parámetro | Tipo   | Descripción |
| ------ |---------| :------|
| ```score``` | double | Puntuación obtenida de la tarea enviada. |

### POST ```/create-problem```

#### Descripción
Crea un problema en la plataforma omegaUp.

#### Privilegios
El usuario necesita estar loggeado.

#### Parámetros
| Parámetro | Tipo   | Descripción |
| ------ |---------| :------|
| ```authorUsername``` | String | Estado obtenido de la petición. |
| ```title```  | String | Arreglo de los archivos que fueron enviados. |
| ```alias``` | String | Estado obtenido de la petición. |
| ```source```  | String | Arreglo de los archivos que fueron enviados. |
| ```isPublic``` | String | Estado obtenido de la petición. |
| ```validator```  | String | Arreglo de los archivos que fueron enviados. |
| ```timeLimit``` | String | Estado obtenido de la petición. |
| ```problemContents```  | String | Arreglo de los archivos que fueron enviados. |

#### Regresa
| Parámetro | Tipo   | Descripción |
| ------ |---------| :------|
| ```status``` | String | Estado obtenido de la petición. |
| ```uploaded_files```  | String | Arreglo de los archivos que fueron enviados. |
