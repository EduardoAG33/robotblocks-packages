# Luz RGB WS2812 / WS2812 RGB light

Controla tabletas de 8 LEDs y tiras NeoPixel con nueve comandos para inicializar, ajustar brillo, colorear rangos, apagar, crear arcoíris, desplazar, girar y mostrar barras. Un objeto por pin; inicializa cada tira al iniciar. Experimental hasta validación física.

Controls 8-LED boards and NeoPixel strips with nine commands to initialize, adjust brightness, color ranges, turn off, create rainbows, shift, rotate and display bars. One object per pin; initialize each strip at start. Experimental until hardware validation.

## Cableado / Wiring

Datos DIN a un pin digital, alimentación de 5 V y GND común entre tira, fuente y tarjeta. Resistencia de 330 Ω en datos; capacitor de 1000 µF recomendado en tiras largas. Hasta 60 mA por LED en blanco (8 LEDs: hasta 480 mA); dimensiona la fuente externa según la cantidad. Evita alimentar tiras largas desde el USB de la tarjeta.

Connect DIN to a digital pin, supply 5 V and share GND between strip, power supply and board. Use a 330 Ω data resistor; a 1000 µF capacitor is recommended for long strips. Up to 60 mA per LED at white (8 LEDs: up to 480 mA); size the external supply for the LED count. Avoid powering long strips from the board USB.

## Comportamiento / Behavior

Cantidad predeterminada: 8; se limita a 1–21845 (el límite real depende de la memoria disponible). Reinitializar borra colores y restablece brillo a 255. Índices desde 0, extremos inclusivos; fuera de la tira se ignoran y un rango invertido no modifica colores. RGB y brillo se limitan a 0–255. Arcoíris reparte 0–360° en el rango válido. N positivo desplaza hacia índices mayores, negativo hacia menores; desplazar rellena con negro, girar conserva los colores circularmente. La barra enciende en verde la parte entera de LEDs × valor / máximo, limitada al rango; máximo ≤ 0 apaga el rango. Todos los cambios se muestran automáticamente. Sin inicializar: «Inicializa la luz RGB al iniciar».

Default count: 8; clamped to 1–21845 (the practical limit depends on available memory). Reinitializing clears colors and resets brightness to 255. Indices start at 0, endpoints are inclusive; indices outside the strip are ignored and reversed ranges leave colors unchanged. RGB and brightness are clamped to 0–255. Rainbow distributes 0–360° across the valid range. Positive N shifts toward higher indices, negative toward lower indices; shifting fills with black, rotation wraps colors. The bar lights the integer part of LEDs × value / maximum in green, clamped to the range; maximum ≤ 0 clears the range. All changes display automatically. Without initialization: “Initialize the RGB light at start”.

## Bibliotecas / Libraries

Arduino usa [Adafruit NeoPixel](https://github.com/adafruit/Adafruit_NeoPixel), licencia LGPL-3.0 (o posterior), instalada aparte; no se copia en este paquete. Referencia de compilación comunicada: 1.15.5 para GIGA R1, UNO, UNO R4 Minima, XIAO ESP32-S3 y FireBeetle ESP32; no equivale a prueba física. MicroPython (FireBeetle y XIAO) usa `machine.Pin` y el módulo `neopixel` del firmware, escalando RGB al escribir y conservando colores sin escalar por pin.

Arduino uses [Adafruit NeoPixel](https://github.com/adafruit/Adafruit_NeoPixel), LGPL-3.0 (or later), installed separately; it is not copied into this package. Reported compilation reference: 1.15.5 for GIGA R1, UNO, UNO R4 Minima, XIAO ESP32-S3 and FireBeetle ESP32; this does not constitute hardware testing. MicroPython (FireBeetle and XIAO) uses `machine.Pin` and the firmware `neopixel` module, scaling RGB when writing and retaining unscaled colors per pin.
