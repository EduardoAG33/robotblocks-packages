# Motores DC (puente H)

Extensión **experimental** para MicroPython (probada en simulación; pendiente de prueba física). Funciona con **TB6612FNG** y **L298N**, o con cualquier puente H que use PWM + IN1 + IN2. Las plantillas de Arduino llegarán con la fase de compilación.

## Bloques

| Bloque | Uso |
| --- | --- |
| **configurar motor [A–D] PWM [pin] IN1 [pin] IN2 [pin]** | En «al iniciar», una vez por motor. Es el único lugar donde se eligen pines. |
| **motor [A–D] a (velocidad) %** | De -100 (reversa) a 100 (adelante). Los valores mayores se limitan, así que puedes conectar la salida de un control PID sin miedo a errores. 0 deja el motor en libre. |
| **motores [B] (50) [C] (50)** | Dos motores a la vez, por ejemplo izquierdo y derecho. |
| **detener [todos los motores / motor A–D] [frenando / en libre]** | Frenando se detiene enseguida; en libre gira hasta pararse solo. |

Usar un motor que no se configuró detiene el programa con `RB_ERROR` y la app resalta el bloque.

## Conexiones

| Puente H | PWM | IN1 | IN2 |
| --- | --- | --- | --- |
| TB6612FNG canal A / B | PWMA / PWMB | AIN1 / BIN1 | AIN2 / BIN2 |
| L298N motor A / B | ENA / ENB (quita el puente del jumper) | IN1 / IN3 | IN2 / IN4 |

- **TB6612FNG:** VM → batería de los motores (hasta 13.5 V), VCC → 3.3 V de la placa, **STBY → 3.3 V** (o ponlo en alto con un bloque de pin al iniciar).
- **L298N:** +12 V → batería; une su GND con el de la placa.
- **Siempre GND común** entre la placa, el driver y la batería.
- Si un motor gira al revés, intercambia IN1 e IN2 en «configurar motor» o los cables del motor.
- Nunca conectes 5 V a los GPIO del ESP32: trabajan a 3.3 V.

## Lógica usada

| Acción | IN1 | IN2 | PWM |
| --- | --- | --- | --- |
| Adelante | H | L | velocidad |
| Reversa | L | H | velocidad |
| Frenar | H | H | alto |
| Libre | L | L | 0 |

Es la misma convención que el bloque `MOTORES` de Los Grises en Mind+ y frena tanto en el TB6612FNG (freno en corto) como en el L298N («fast motor stop»).
