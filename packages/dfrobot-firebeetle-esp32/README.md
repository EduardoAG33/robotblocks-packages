# FireBeetle ESP32 DFR0478 — experimental

Descriptor DFR0478 con ESP-WROOM-32 y puente USB-serie CH340; no es FireBeetle 2 ESP32-E.
MicroPython ESP32 vía Web Serial. No instala drivers ni flashea firmware. Sigue experimental
hasta confirmar físicamente parpadeo, ADC y error por serie.

Pinout: [wiki oficial DFRobot DFR0478](https://wiki.dfrobot.com/dfr0478/)
y [imagen de pines](https://dfimg.dfrobot.com/62fba4cb025a892c98c6da64/wikien/555ad7fa66fecc61fe288e251ac267ce_0x0.png.webp).
Módulo y límites: [hoja ESP32-WROOM-32, secciones 2–4](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf).
Etiquetas con serigrafía y GPIO; símbolos numéricos para MicroPython/Arduino.
GPIO32/33/37/38 no aparecen en los conectores de este pinout; no se añaden. NC no es GPIO.

- LED D9/GPIO2: alto enciende, bajo apaga; también strapping.
- A0/36, A1/39, A2/34, A3/35: solo entrada, sin resistencias internas.
- GPIO0/2/5/12/15: strapping; no forzar niveles durante arranque.
- GPIO6–11: flash, incluidos D5/GPIO9 y D6/GPIO10; no seleccionables.
- D0/GPIO3 y D1/GPIO1: reservados a USB/UART0; no seleccionables.
- Lógica 3.3 V; nunca 5 V en GPIO. ADC de 12 bits (crudo 0–4095).
- ADC1 A0–A3; ADC2 no disponible con WiFi activo.
- PWM 5000 Hz, duty 0–1023. [Referencia ESP32 MicroPython](https://docs.micropython.org/en/latest/esp32/quickref.html).

[DFRobot confirma CH340](https://wiki.dfrobot.com/dfr0478/docs/19899);
[driver oficial WCH](https://www.wch.cn/downloads/CH341SER_EXE.html).
Firmware: [ESP32_GENERIC](https://micropython.org/download/ESP32_GENERIC/).

Arduino queda para Fase 8. `arduino-cli` no está instalado; no se ejecutó `board listall firebeetle`.
El candidato `esp32:esp32:firebeetle32` existe en
[boards.txt oficial](https://github.com/espressif/arduino-esp32/blob/master/boards.txt).
Se pospone declarar Arduino hasta comprobar core/CLI; no se afirma carga C++ probada.
