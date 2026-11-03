# SPIKE Prime / Pybricks · experimental

Hub SPIKE Prime con firmware Pybricks. Destino `pybricks`, carga
`webbluetooth-pybricks` por Chrome/Edge en HTTPS o localhost. No es el Python del
firmware original de LEGO. GreyForge no instala ni restaura firmware.

Instala Pybricks manualmente en [Pybricks Code](https://code.pybricks.com/) y activa
Bluetooth en el hub. La app SPIKE de LEGO puede restaurar el firmware original.
Si el hub no aparece o no ofrece el servicio Pybricks, vuelve a comprobar el
firmware. El selector Bluetooth solo muestra hubs que anuncian ese servicio.

Verificación documental del 2026-10-04: la documentación estable oficial indica
**Pybricks 4.0.0**. Se conserva la API de **3.6.1**, última v3.x consultada, como
mínimo compatible; también se admite 4.x estable. Versiones anteriores y betas
reciben un diagnóstico. Todo continúa experimental hasta probar un hub físico.

| Recurso visible | Símbolo Pybricks | Capacidad / observación                                   |
| --------------- | ---------------- | --------------------------------------------------------- |
| A               | Port.A           | poweredUpPort                                             |
| B               | Port.B           | poweredUpPort                                             |
| C               | Port.C           | poweredUpPort                                             |
| D               | Port.D           | poweredUpPort                                             |
| E               | Port.E           | poweredUpPort                                             |
| F               | Port.F           | poweredUpPort                                             |
| Botón LEFT      | Button.LEFT      | hubButtons                                                |
| Botón CENTER    | Button.CENTER    | hubButtons; también detiene el programa por defecto       |
| Botón RIGHT     | Button.RIGHT     | hubButtons                                                |
| Matriz 5×5      | rb_hub.display   | hubDisplay                                                |
| IMU             | rb_hub.imu       | hubImu; calibrar inmóvil antes de conducir con giroscopio |
| Altavoz         | rb_hub.speaker   | hubSpeaker                                                |

Los puertos son conectores Powered Up para **un** motor o sensor físico cada uno;
no son GPIO digitales/analógicos. `shared: true` permite que distintos bloques
usen el mismo objeto de puerto. El runtime rechaza mezclar tipos de dispositivo
o cambiar el sentido de un motor ya inicializado. No se inventan capacidades de
PWM/ADC ni una tensión lógica GPIO para estos conectores.

No se incluyen imágenes, logotipos ni recursos gráficos de LEGO.

Fuentes oficiales:

- [Sitio Pybricks y acceso a instalación/documentación](https://pybricks.com/).
- [PrimeHub, matriz, botones, IMU, altavoz y ejemplos con Port A–F (3.6.1)](https://docs.pybricks.com/en/v3.6.1/hubs/primehub.html).
- [PrimeHub en la documentación estable 4.0.0](https://docs.pybricks.com/en/stable/hubs/primehub.html).
- [Parámetros y puertos](https://docs.pybricks.com/en/v3.6.1/parameters/port.html).
- [Protocolo BLE oficial](https://github.com/pybricks/technical-info/blob/master/pybricks-ble-profile.md).
