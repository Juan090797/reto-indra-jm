# Documentación para Uso del API - Sistema de Citas Médicas

Este proyecto corresponde a un **reto técnico para Indra 2025**.

La aplicación es un sistema serverless para la **gestión de citas médicas** en Perú (PE) y Chile (CL), que utiliza los siguientes servicios y tecnologías:

- API Gateway
- AWS Lambda
- DynamoDB
- SNS
- SQS
- EventBridge
- MySQL
- TypeScript

## Arquitectura General

El sistema está diseñado utilizando una **arquitectura orientada a eventos**, donde cada cita médica pasa por varias etapas de procesamiento automático:

1. Se recibe una solicitud a través de API Gateway.
2. La información de la cita se guarda inicialmente en DynamoDB.
3. Se publica un evento en SNS indicando el país.
4. Se envía la cita a una cola SQS correspondiente (PE o CL).
5. Lambdas específicas procesan las citas y las almacenan en MySQL.
6. Se publica un evento de confirmación en EventBridge.
7. Finalmente, se actualiza el estado de la cita como completada en DynamoDB.

## Endpoints disponibles

### 1. Crear Cita Médica

**Método:** `POST`  
**URL:**  
`https://k4nit9jt3h.execute-api.us-east-1.amazonaws.com/dev/appointments`

**Body del request (formato JSON):**

```json
{
  "insuredId": "00005",
  "scheduleId": 2,
  "countryISO": "PE"
}
```
**Respuesta esperada: (formato JSON):**

```json
{
    "message": "Appointment created successfully",
    "appointment": {
        "id": "c9b70ff0-8698-4f1a-bf57-f543e721cd1b",
        "insuredId": "00005",
        "scheduleId": 2,
        "countryISO": "PE",
        "status": "PENDING",
        "createdAt": "2025-04-25T20:41:21.953Z",
        "updatedAt": "2025-04-25T20:41:21.953Z"
    }
}
```
### 2. Consultar Cita Médica

**Método:** `GET`
  
**URL:**  
`https://k4nit9jt3h.execute-api.us-east-1.amazonaws.com/dev/appointments/{insuredId}`

**Ejemplo de consulta:**  
`https://k4nit9jt3h.execute-api.us-east-1.amazonaws.com/dev/appointments/00005`

**Respuesta esperada: (formato JSON):**

```json
{
    "message": "Appointments retrieved successfully",
    "appointments": [
        {
            "insuredId": "00005",
            "scheduleId": 2,
            "updatedAt": "2025-04-25T22:16:05.531Z",
            "status": "COMPLETED",
            "createdAt": "2025-04-25T22:16:04.393Z",
            "id": "f6e18fc0-807c-4f80-b690-66cbc2197fa6",
            "countryISO": "PE"
        },
    ]
}
```

### 3. Diagrama
![Diagrama del reto](https://i.postimg.cc/gjj5NsCW/Sin-t-tulo.png)
