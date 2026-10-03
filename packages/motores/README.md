# Motores: servo y motor DC (TB6612FNG)

Extensión **experimental** para MicroPython (probada en simulación; pendiente de prueba física). Las plantillas de Arduino llegarán con la fase de compilación.

## Dispositivos

Configúralos en **Mi tarjeta → Configurar dispositivos** y elige sus pines.

| Dispositivo | Pines | Notas |
| --- | --- | --- |
| Servo (SG90, MG90S, MG996R) | Señal → pin con PWM | Pulso de 0.5 ms (0°) a 2.5 ms (180°) a 50 Hz. Si tu servo no llega a los extremos o vibra en ellos, usa un rango más corto, por ejemplo de 10° a 170°. |
| Motor DC · TB6612FNG | PWM → PWMA/PWMB, IN1 → AIN1/BIN1, IN2 → AIN2/BIN2 | Un dispositivo por canal. Para dos motores crea dos dispositivos. |

## Bloques

- **mover servo … a … grados** (0 a 180).
- **soltar servo …**: deja de enviar pulsos y el servo ya no se sostiene en su posición.
- **motor … a velocidad … %**: de -100 (reversa) a 100 (adelante); 0 lo deja en libre.
- **detener motor … frenando / en libre**.

## Conexiones

**Servo**

- Señal (naranja/amarillo) → pin PWM de la placa.
- Rojo → 5 V de una fuente externa o de un regulador. Evita sacar los 5 V del USB para servos grandes como el MG996R.
- Café/negro → GND, **común con la placa**.

**TB6612FNG**

- VM → batería de los motores (hasta 13.5 V). VCC → 3.3 V de la placa. GND → común.
- **STBY → 3.3 V** para que el driver esté siempre activo. Si lo controlas con un pin, ponlo en alto con el bloque «poner pin en alto» de *Pines de la tarjeta* al iniciar.
- AO1/AO2 (o BO1/BO2) → terminales del motor. Si el motor gira al revés, intercambia esos dos cables o usa velocidades negativas.

Tabla de verdad usada (hoja de datos de Toshiba TB6612FNG):

| IN1 | IN2 | PWM | Resultado |
| --- | --- | --- | --- |
| H | L | PWM | Adelante |
| L | H | PWM | Reversa |
| H | H | — | Freno en corto |
| L | L | H | Libre (salidas apagadas) |

Nunca conectes 5 V a los GPIO del ESP32: trabajan a 3.3 V.
