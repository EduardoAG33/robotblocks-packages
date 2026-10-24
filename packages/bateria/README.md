# Batería / Battery

## Español

Extensión experimental 1.0.0 para Arduino y MicroPython ESP32. Autor: Los Grises · GreyForge. Requiere GreyForge 0.4.0 o posterior. Dos métodos independientes, cada uno con una configuración activa.

### Divisor resistivo

Configura al iniciar el pin analógico, R1 y R2 en kΩ y VREF. R1 va del positivo de la batería al pin; R2 del pin a GND. Une las tierras. Selecciona **5 V en UNO/Nano** y **3.3 V en las demás**; el campo empieza en 3.3 V y debe ajustarse manualmente. El voltaje es el promedio de ocho lecturas: lectura/ADC_MAX × VREF × (R1+R2)/R2; ADC_MAX procede de la tarjeta. En ESP32 se prefiere ADC.read_uv(), calibrado; VREF solo se usa como escala si no existe read_uv(). Se configura atenuación de 11 dB, cuyo rango útil depende del chip.

Ejemplo LiPo 2S: 8.4 V con R1 = 20 kΩ y R2 = 10 kΩ produce 8.4 × 10/30 = **2.8 V** en el pin. Nunca excedas VREF ni el rango medible del ADC. Calcula para el voltaje máximo, incluidas tolerancias. El porcentaje entre 6.4 y 8.4 V se limita a 0–100; es una aproximación lineal, no un medidor de carga química. El máximo debe superar el mínimo. El booleano de batería baja compara voltaje con el umbral.

### INA219

Configura dirección 0x40–0x45 y SDA/SCL al iniciar; Arduino resuelve el bus con el mapa de la tarjeta, como TCS34725. Comparte los mismos pines con los demás sensores. Registros directos sin librería: configuración 0x399F (32 V, PGA ±320 mV, ADC 12 bits, continuo bus+shunt); shunt **0.1 Ω**, calibración 4096, Current_LSB 0.1 mA y Power_LSB 2 mW; rango de uso 2 A. Voltaje de bus: registro 2, 4 mV por bit tras desplazar 3; corriente: registro 4 con signo; potencia: registro 3 sin signo. El voltaje corresponde a VIN− respecto a GND.

Los reporters devuelven la última conversión disponible, sin esperar una nueva. Espera al menos 2 ms mediante un bloque cooperativo después de configurar si necesitas la primera medición. Un fallo de comunicación informa la dirección, por ejemplo «No se encontró el INA219 en 0x40»; el desbordamiento también informa fallo. No se ha validado en hardware.

### Ejemplo

`examples/robot-bateria.blocks.json` (GIGA, divisor en A0 e INA219 en SDA1/SCL1): cada segundo lee voltaje, porcentaje y corriente, imprime los mA y avisa con «¡Batería baja!» por debajo de 6.8 V.

## English

Experimental 1.0.0 Arduino and MicroPython ESP32 extension, by Los Grises · GreyForge. Requires GreyForge 0.4.0 or later. The divider and INA219 are independent, each with one active configuration.

Connect R1 from battery positive to the analog pin and R2 from the pin to GND; share grounds. Enter resistances in kΩ. Set VREF manually to **5 V on UNO/Nano**, **3.3 V elsewhere** (default 3.3). Eight readings are averaged using reading/ADC_MAX × VREF × (R1+R2)/R2. ESP32 prefers calibrated ADC.read_uv(); VREF scales only the fallback raw ADC reading. 11 dB attenuation is selected; the useful measurement range depends on the chip.

A 2S LiPo at 8.4 V with R1 = 20 kΩ and R2 = 10 kΩ gives **2.8 V** at the pin. Never exceed VREF or the measurable ADC range; account for maximum battery voltage and resistor tolerance. Percentage defaults to 6.4–8.4 V, clamps to 0–100 and is a linear voltage estimate. Maximum must exceed minimum. Low battery compares voltage to a threshold.

INA219 setup selects address 0x40–0x45 and SDA/SCL. Arduino resolves the board bus like TCS34725; share pins with other I2C sensors. Direct registers, no external library: configuration 0x399F, 32 V / 2 A operating range, 0.1 Ω shunt, calibration 4096, current LSB 0.1 mA, power LSB 2 mW. Bus voltage is VIN− relative to GND, register 2 shifted by 3, at 4 mV/bit; register 4 is signed current and register 3 unsigned power. Reporters read the latest conversion synchronously. Allow at least 2 ms cooperatively after setup for the first measurement. Communication failures name the selected address; overflow also fails. Hardware testing is pending.

Example: `examples/robot-bateria.blocks.json` (GIGA, divider on A0 and INA219 on SDA1/SCL1): every second it reads voltage, percentage and current, prints the mA and warns “¡Batería baja!” below 6.8 V.
