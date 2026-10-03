# Servos

Extensión **experimental** para MicroPython (probada en simulación; pendiente de prueba física). El pin se elige directamente en el bloque, como en Mind+.

## Bloques

- **servo en pin [pin] a (ángulo) grados**: de 0 a 180. Los valores fuera de rango se limitan.
- **soltar servo en pin [pin]**: deja de enviar pulsos y el servo ya no se sostiene en su posición.

Pulso de 0.5 ms (0°) a 2.5 ms (180°) a 50 Hz. Si tu servo vibra en los extremos, usa un rango más corto, por ejemplo de 10° a 170°.

## Conexiones

- Señal (naranja/amarillo) → un pin con PWM.
- Rojo → 5 V de una fuente externa o de un regulador. Evita sacar los 5 V del USB para servos grandes como el MG996R.
- Café/negro → GND, **común con la placa**.
