# Pines de la tarjeta · demo

Paquete declarativo de cuatro bloques: lectura digital booleana, salida alto/bajo, lectura analógica y PWM con porcentaje conectable. Los menús solo muestran recursos que ofrecen la capacidad requerida. Las etiquetas pertenecen al descriptor y la IR conserva IDs; una selección incompatible permanece pendiente al cambiar de tarjeta.

Las tarjetas incluidas son ficticias. No hay drivers, firmware ni definición de Arduino Nano. Entrada digital requiere `digitalInput`; salida requiere `digitalOutput`; P3 no aparece como salida. PWM acepta literales enteros 0–100 sin suponer resolución universal de 8 bits. Carga y deshacer conservan valores inválidos para diagnosticarlos. Servo y RGB siguen pendientes por preferencia del usuario.
