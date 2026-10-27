"""pyb doubles: the UART keeps what was written and the LEDs their state."""
leds = {}


class UART:
    def __init__(self, port, baudrate):
        assert port == 3
        self.baudrate, self.sent = baudrate, []

    def write(self, text): self.sent.append(text)


class LED:
    def __init__(self, number): self.number = number
    def on(self): leds[self.number] = True
    def off(self): leds[self.number] = False
