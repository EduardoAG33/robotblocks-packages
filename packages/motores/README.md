# Motores DC (puente H)

Extensión **experimental** para MicroPython (probada en simulación; pendiente de prueba física). Funciona con **TB6612FNG**, **L298N** y el shield **Pololu Dual VNH5019** (#2507), o con cualquier puente H que use PWM + IN1 + IN2. Las plantillas de Arduino llegarán con la fase de compilación.

## Bloques

| Bloque                                                            | Uso                                                                                                                                                                    |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **configurar motor [A–D] PWM [pin] IN1 [pin] IN2 [pin]**          | En «al iniciar», una vez por motor. Es el único lugar donde se eligen pines.                                                                                           |
| **motor [A–D] a (velocidad) %**                                   | De -100 (reversa) a 100 (adelante). Los valores mayores se limitan, así que puedes conectar la salida de un control PID sin miedo a errores. 0 deja el motor en libre. |
| **motores [B] (50) [C] (50)**                                     | Dos motores a la vez, por ejemplo izquierdo y derecho.                                                                                                                 |
| **detener [todos los motores / motor A–D] [frenando / en libre]** | Frenando se detiene enseguida; en libre gira hasta pararse solo.                                                                                                       |

Usar un motor que no se configuró detiene el programa con `RB_ERROR` y la app resalta el bloque.

## Conexiones

| Puente H                             | PWM                                    | IN1           | IN2           |
| ------------------------------------ | -------------------------------------- | ------------- | ------------- |
| TB6612FNG canal A / B                | PWMA / PWMB                            | AIN1 / BIN1   | AIN2 / BIN2   |
| L298N motor A / B                    | ENA / ENB (quita el puente del jumper) | IN1 / IN3     | IN2 / IN4     |
| Pololu Dual VNH5019 (shield) M1 / M2 | D9 / D10                               | D2 / D7 (INA) | D4 / D8 (INB) |

- **TB6612FNG:** VM → batería de los motores (hasta 13.5 V), VCC → 3.3 V de la placa, **STBY → 3.3 V** (o ponlo en alto con un bloque de pin al iniciar).
- **L298N:** +12 V → batería; une su GND con el de la placa.
- **Pololu Dual VNH5019:** se monta sobre la Arduino GIGA o Uno; VIN de 5.5 a 24 V, hasta 12 A por motor. Acepta lógica de 3.3 V. Sus pines EN/DIAG (D6/D12) quedan en alto por defecto y bajan si hay una falla; CS (A0/A1) entrega unos 140 mV por amperio. Bloques de corriente y falla: pendientes.
- **Siempre GND común** entre la placa, el driver y la batería.
- Si un motor gira al revés, intercambia IN1 e IN2 en «configurar motor» o los cables del motor.
- Nunca conectes 5 V a los GPIO del ESP32: trabajan a 3.3 V.

## Lógica usada

| Acción   | IN1 | IN2 | PWM       |
| -------- | --- | --- | --------- |
| Adelante | H   | L   | velocidad |
| Reversa  | L   | H   | velocidad |
| Frenar   | H   | H   | alto      |
| Libre    | L   | L   | 0         |

Es la misma convención que el bloque `MOTORES` de Los Grises en Mind+. Frena en el TB6612FNG (freno en corto), en el L298N («fast motor stop») y en el VNH5019 (freno a VCC). En el VNH5019, «libre» apaga las salidas.

## Arduino/C++

Plantillas declarativas experimentales, sin código ejecutable en el paquete. Se mantienen las plantillas MicroPython. Copiar código y Descargar archivo dan un único `.ino` con el runtime integrado. Generación verificada; compilación del core y prueba física pendientes.

TB6612FNG y VNH5019 usan PWM + INA + INB. Velocidad limitada a −100…100; PWM escalado a `(2 ** pwm.bits) − 1`. Cero/libre: PWM 0 e INA/INB bajos; frenar: ambas entradas altas y PWM máximo. TB6612 requiere STBY alto; no se controla automáticamente.

Para Pololu Dual VNH5019 #2507 sobre GIGA: M1/B = PWM D9, INA D2, INB D4; M2/C = PWM D10, INA D7, INB D8. El nuevo bloque «habilitar VNH5019 EN/DIAG» usa INPUT_PULLUP en D6 y D12; libera la señal sin forzar HIGH contra el diagnóstico de fallo (salida de drenador abierto). Puede leerse con el bloque digital de Pines básicos; no agrega parada automática por diagnóstico.

VDD alimenta los pull-ups del shield: debe ser **3.3 V al conectar EN/DIAG a GIGA/Teensy**, sin pull-up externo a 5 V. Comprueba las conexiones del shield antes de apilarlo: su conexión Arduino estándar alimenta VDD desde 5 V. Fuente de motores separada y tierra común. A0/A1 son CS; quedan libres en el ejemplo PD.

En UNO/Nano Servo.h toma Timer1: combinar Servos con PWM D9/D10 produce diagnóstico y no genera sketch. Usa D3/D5/D6/D11 para motores.

Fuentes: [Pololu: pines del shield](https://www.pololu.com/docs/0J49/3.c), [Pololu: PWM, EN/DIAG y VDD](https://www.pololu.com/docs/0J49/4.b), [Toshiba TB6612FNG](https://toshiba.semicon-storage.com/info/docget.jsp?did=10660&prodName=TB6612FNG).
