# Diagnóstico I2C / I2C diagnostics

Para saber qué sensores I2C responden antes de culpar al programa: escanea el bus e imprime cada dirección con el sensor que suele usarla, o comprueba si hay algo en una dirección. Arduino (C++) y MicroPython (ESP32).

To know which I2C sensors answer before blaming the program: scans the bus and prints each address with the sensor that usually uses it, or checks whether something is at an address. Arduino (C++) and MicroPython (ESP32).

## Bloques / Blocks

- **escanear I2C en SDA … SCL … e imprimir**: imprime en el monitor `I2C 0x29 TCS34725 (color) o VL53L0X (láser)` por cada dirección y al final cuántos dispositivos hay. Tarda unos 100 ms; úsalo al iniciar.
- **hay dispositivo I2C en (0x29) (SDA … SCL …)**: verdadero si algo responde en esa dirección. Escríbela como `0x29` o `41`. Una dirección inválida detiene el programa con «Dirección I2C inválida».
- **cantidad de dispositivos I2C (SDA … SCL …)**: cuántas direcciones responden.

- **scan I2C on SDA … SCL … and print**: prints `I2C 0x29 TCS34725 (color) o VL53L0X (láser)` on the monitor for each address and at the end how many devices there are. Takes about 100 ms; use it at start.
- **I2C device at (0x29) (SDA … SCL …)**: true if something answers at that address. Write it as `0x29` or `41`. An invalid address stops the program with “Invalid I2C address”.
- **number of I2C devices (SDA … SCL …)**: how many addresses answer.

Usa los mismos pines SDA/SCL que tus sensores: en Arduino eligen el bus (`Wire`, `Wire1`…) y en MicroPython comparten el mismo bus que los demás bloques I2C. En la GIGA, SDA1/SCL1 (D102/D101) es `Wire1`.

Use the same SDA/SCL pins as your sensors: on Arduino they choose the bus (`Wire`, `Wire1`…) and on MicroPython they share the same bus as the other I2C blocks. On the GIGA, SDA1/SCL1 (D102/D101) is `Wire1`.

## Direcciones conocidas / Known addresses

0x0D QMC5883L · 0x1E HMC5883L · 0x28 BNO055 · 0x29 TCS34725 o VL53L0X · 0x32 HuskyLens · 0x39 APDS-9960 · 0x3C/0x3D OLED · 0x40 INA219 o PCA9685 · 0x41/0x44/0x45 INA219 · 0x48 ADS1115 · 0x4A/0x4B BNO085 · 0x50 EEPROM o HuskyLens 2 · 0x68/0x69 MPU6050 · 0x70 TCA9548A · 0x76/0x77 BMP280/BME280. Otras direcciones se imprimen sin nombre. / Other addresses print without a name.

## Si no aparece nada / If nothing shows up

1. ¿El sensor tiene alimentación? En el robot Rescue Line el riel de 3.3 V solo se enciende con el interruptor de la batería.
2. SDA con SDA y SCL con SCL, y GND común.
3. Pull-ups: la mayoría de los módulos ya los traen; sin ninguno el bus no funciona.
4. Dos sensores con la misma dirección se estorban (por ejemplo varios VL53L0X sin cambiar su dirección con XSHUT).

- Does the sensor have power? On the Rescue Line robot the 3.3 V rail only turns on with the battery switch.
- SDA to SDA and SCL to SCL, and a common GND.
- Pull-ups: most modules already have them; with none the bus does not work.
- Two sensors with the same address get in each other's way (for example several VL53L0X without changing their address with XSHUT).

## Ejemplo / Example

`examples/revisar-sensores.blocks.json` (GIGA, bus `Wire1`): escanea al arrancar, avisa si falta la IMU BNO055 (0x28) y si responden menos de 3 dispositivos. / scans at start, warns if the BNO055 IMU (0x28) is missing and if fewer than 3 devices answer.

Pybricks (SPIKE/EV3) no está incluido. Experimental hasta probarlo en hardware. / Pybricks (SPIKE/EV3) is not included. Experimental until tested on hardware.
